import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "../../_components/ProductForm";
import db from "@/db/db";

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
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product}></ProductForm>
    </div>
  );
};
export default EditProductPage;
