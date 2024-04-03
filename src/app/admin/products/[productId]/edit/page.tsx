import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "../../_components/ProductForm";
import db from "@/db/db";
import { PencilRuler } from "lucide-react";

const EditProductPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const product = await db.product.findFirst({
    where: {
      id: params.productId,
    },
  });
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-b-2 mb-10 flex items-center justify-center gap-5">
        <PencilRuler className="w-8 h-8 mb-4"></PencilRuler>
        <PageHeader>Edit Product</PageHeader>
      </div>
      <ProductForm product={product}></ProductForm>
    </div>
  );
};
export default EditProductPage;
