import db from "@/db/db";
import { notFound } from "next/navigation";

import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const ProductPurchasePage = async ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const product = await db.product.findUnique({
    where: { id: productId },
  });
  if (product == null) return notFound();

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
      product={product}
      clientSecret={paymentIntent.client_secret}
    ></CheckoutForm>
  );
};
export default ProductPurchasePage;
