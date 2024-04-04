import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const PurchaseSuccessPage = async ({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();
  const product = await db.product.findUnique({
    where: {
      id: paymentIntent.metadata.productId,
    },
  });
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <p className="text-4xl text-emerald-500">
        {isSuccess ? "Success!" : "Error"}
      </p>
      <div className="flex items-center gap-4">
        <div className="relative w-1/3 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          ></Image>
        </div>
        <div className="space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button asChild size={"lg"}>
            {isSuccess ? (
              <a href=""></a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;
