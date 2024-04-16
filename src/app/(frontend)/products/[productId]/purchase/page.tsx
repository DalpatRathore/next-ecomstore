import db from "@/db/db";
import { notFound } from "next/navigation";

import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";
import { usableDiscountCodeWhere } from "@/lib/discountCode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const getDiscountCode = (coupon: string, productId: string) => {
  return db.discountCode.findUnique({
    select: { id: true, discountAmount: true, discountType: true },
    where: { ...usableDiscountCodeWhere, code: coupon },
  });
};

const ProductPurchasePage = async ({
  params: { productId },
  searchParams: { coupon },
}: {
  params: { productId: string };
  searchParams: { coupon?: string };
}) => {
  const product = await db.product.findUnique({
    where: { id: productId },
  });
  if (product == null) return notFound();

  const discountCode =
    coupon == null ? undefined : await getDiscountCode(coupon, product.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: {
      productId: product.id,
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
  return (
    <CheckoutForm
      discountCode={discountCode || undefined}
      product={product}
      clientSecret={paymentIntent.client_secret}
    ></CheckoutForm>
  );
};
export default ProductPurchasePage;
