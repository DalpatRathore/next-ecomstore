"use client";
import { userOrderExists } from "@/actions/user-order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const StripeForm = ({
  priceIncents,
  productId,
}: {
  priceIncents: number;
  productId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (stripe == null || elements == null || email == null) return;

    const orderExists = await userOrderExists(email, productId);
    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloadin it from the My Orders page"
      );

      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          //   setErrorMessage("Something went wrong");
          setErrorMessage(error.message);
        }
      })
      .finally(() => setIsLoading(false));

    setIsLoading(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement></PaymentElement>
          <LinkAuthenticationElement
            onChange={e => setEmail(e.value.email)}
          ></LinkAuthenticationElement>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size={"lg"}
            disabled={stripe == null || elements == null || isLoading}
          >
            {" "}
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceIncents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
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
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <StripeForm
          priceIncents={product.priceInCents}
          productId={product.id}
        ></StripeForm>
      </Elements>
    </div>
  );
};
export default CheckoutForm;
