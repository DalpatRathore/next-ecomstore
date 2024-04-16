"use server";
import db from "@/db/db";
import OrderHistory from "@/emails/OrderHistory";
import { getDiscountAmount, usableDiscountCodeWhere } from "@/lib/discountCode";
import { Resend } from "resend";
import Stripe from "stripe";
import * as z from "zod";

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY1 as string);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const emailOrderHistory = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> => {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }
  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products",
    };
  }
  const orders = user.orders.map(async order => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
            productId: order.product.id,
          },
        })
      ).id,
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistory orders={await Promise.all(orders)}></OrderHistory>,
  });

  if (data.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }
  return {
    message:
      "Check your email to view your order history and download your products",
  };
};
export default emailOrderHistory;

export async function createPaymentIntent(
  email: string,
  productId: string,
  discountCodeId?: string
) {
  const product = await db.product.findUnique({ where: { id: productId } });

  if (product == null) return { error: "Unexpected Error" };

  const discountCode =
    discountCodeId == null
      ? null
      : await db.discountCode.findUnique({
          where: { id: discountCodeId, ...usableDiscountCodeWhere(product.id) },
        });

  if (discountCode == null && discountCodeId != null) {
    return { error: "Coupon has expired" };
  }
  const existingOrders = await db.order.findFirst({
    where: { user: { email }, productId },
    select: { id: true },
  });

  if (existingOrders != null) {
    return {
      error:
        "You have already purchased this product. Try downloadin it from the My Orders page",
    };
  }

  const amount =
    discountCode == null
      ? product.priceInCents
      : getDiscountAmount(discountCode, product.priceInCents);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "USD",
    metadata: {
      productId: product.id,
      discountCodeId: discountCode?.id || null,
    },
    description: "Software development services",
    shipping: {
      name: "Jenny Rosen",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return { clientSecret: paymentIntent.client_secret };
}
