import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { Resend } from "resend";
import { headers } from "next/headers";
import PurchaseReceipts from "@/emails/PurchaseReceipts";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  console.log("working");
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // const event = stripe.webhooks.constructEvent(
  //   await req.text(),
  //   req.headers.get("Stripe-Signature") as string,
  //   process.env.STRIPE_WEBHOOK_SECRET as string
  // );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await db.product.findUnique({ where: { id: productId } });

    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support < ${process.env.SENDER_EMAIL} >`,
      to: email,
      subject: "Order Confirmation",
      react: (
        <PurchaseReceipts
          order={order}
          product={product}
          downloadVerificationId={downloadVerification.id}
        ></PurchaseReceipts>
      ),
    });
  }
  return new NextResponse(null, { status: 200 });
}
