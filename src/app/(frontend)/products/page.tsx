import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { Suspense } from "react";

const wait = async (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

const getProducts = async () => {
  await wait(1000);
  return db.product.findMany({
    where: { inStock: true },
    orderBy: { name: "asc" },
  });
};

const ProductsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
          </>
        }
      >
        <ProductSuspense></ProductSuspense>
      </Suspense>
    </div>
  );
};
export default ProductsPage;

async function ProductSuspense() {
  const products = await getProducts();

  return products.map(product => (
    <ProductCard key={product.id} {...product}></ProductCard>
  ));
}
