import db from "@/db/db";
import { notFound } from "next/navigation";

import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";
import { usableDiscountCodeWhere } from "@/lib/discountCode";

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

  return (
    <CheckoutForm
      discountCode={discountCode || undefined}
      product={product}
    ></CheckoutForm>
  );
};
export default ProductPurchasePage;
