import { ImagePlus } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import DiscountCodeForm from "../_components/DiscountCodesForm";
import db from "@/db/db";

const NewDiscountCouponPage = async () => {
  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-b-2 mb-10 flex items-center justify-center gap-5">
        <ImagePlus className="w-8 h-8 mb-4"></ImagePlus>
        <PageHeader>Add Product</PageHeader>
      </div>
      <DiscountCodeForm products={products}></DiscountCodeForm>
    </div>
  );
};
export default NewDiscountCouponPage;
