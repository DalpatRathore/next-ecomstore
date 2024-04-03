import { ImagePlus } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ProductForm from "../_components/ProductForm";

const NewProductPage = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-b-2 mb-10 flex items-center justify-center gap-5">
        <ImagePlus className="w-8 h-8 mb-4"></ImagePlus>
        <PageHeader>Add Product</PageHeader>
      </div>
      <ProductForm></ProductForm>
    </div>
  );
};
export default NewProductPage;
