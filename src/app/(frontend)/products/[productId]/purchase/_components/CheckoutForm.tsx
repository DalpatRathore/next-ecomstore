"use client";
import { createPaymentIntent } from "@/actions/email-order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDiscountAmount } from "@/lib/discountCode";
import { formatCurrency, formatDiscountCode } from "@/lib/formatters";
import { DiscountCodeType } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  discountCode?: {
    id: string;
    discountAmount: number;
    discountType: DiscountCodeType;
  };
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const StripeForm = ({
  priceIncents,
  productId,
  discountCode,
}: {
  priceIncents: number;
  productId: string;
  discountCode?: {
    id: string;
    discountAmount: number;
    discountType: DiscountCodeType;
  };
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const coupon = searchParams.get("coupon");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  const discountCodeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const formSubmit = await elements.submit();
    if (formSubmit.error != null) {
      setErrorMessage(formSubmit.error.message);
      setIsLoading(false);
      return;
    }
    const paymentIntent = await createPaymentIntent(
      email,
      productId,
      discountCode?.id
    );
    if (paymentIntent.error != null) {
      setErrorMessage(paymentIntent.error);
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
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

          <CardDescription className="text-destructive">
            {errorMessage && <div className="">{errorMessage}</div>}
            {coupon != null && discountCode == null && (
              <div className="">Invalid discound code</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement></PaymentElement>
          <LinkAuthenticationElement
            onChange={e => setEmail(e.value.email)}
          ></LinkAuthenticationElement>
          <div className="space-y-2 mt-4">
            <Label htmlFor="discountCode"> Coupon</Label>
            <div className="flex items-center justify-center gap-5">
              <Input
                id="discountCode"
                type="text"
                name="discountCode"
                // className="max-w-xs w-full"
                ref={discountCodeRef}
                defaultValue={coupon || ""}
              ></Input>
              <Button
                variant={"secondary"}
                type="button"
                className="w-full"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("coupon", discountCodeRef.current?.value || "");
                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                Apply Coupon
              </Button>
            </div>
            {discountCode != null && (
              <div className="text-muted-foreground italic ml-2">
                {formatDiscountCode(discountCode)} discount
              </div>
            )}
          </div>
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

const CheckoutForm = ({ product, discountCode }: CheckoutFormProps) => {
  const amount =
    discountCode == null
      ? product.priceInCents
      : getDiscountAmount(discountCode, product.priceInCents);
  const isDiscounted = amount != product.priceInCents;
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
          <div className="flex items-center justify-center gap-5 border rounded-md">
            <div
              className={
                isDiscounted ? "line-through text-muted-foreground text-md" : ""
              }
            >
              {formatCurrency(product.priceInCents / 100)}
            </div>
            {isDiscounted && (
              <div className="text-lg">{formatCurrency(amount / 100)}</div>
            )}
          </div>

          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Elements
        options={{ amount, mode: "payment", currency: "usd" }}
        stripe={stripePromise}
      >
        <StripeForm
          priceIncents={amount}
          productId={product.id}
          discountCode={discountCode}
        ></StripeForm>
      </Elements>
    </div>
  );
};
export default CheckoutForm;
