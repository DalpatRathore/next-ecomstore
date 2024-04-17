import ReactConfetti from "@/components/ReactConfetti";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Download } from "lucide-react";
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
    <div className="w-full max-w-5xl mx-auto space-y-10 flex flex-col items-center justify-center">
      <ReactConfetti></ReactConfetti>
      <p className="text-3xl text-emerald-500 italic">
        {isSuccess ? "Payment Successful!" : "Error"}
      </p>
      <div className="flex items-center justify-center gap-4 w-full">
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

          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button asChild size={"lg"} className="w-full max-w-xs">
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                <Download className="w-4 h-4 mr-2"></Download> Download
              </a>
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

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
