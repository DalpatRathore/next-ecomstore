import PageHeader from "../../_components/PageHeader";
import ProductForm from "../_components/ProductForm";

const NewProductPage = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageHeader>Add Product</PageHeader>
      <ProductForm></ProductForm>
    </div>
  );
};
export default NewProductPage;
