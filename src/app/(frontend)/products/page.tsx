import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const wait = async (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

const getProducts = cache(
  async () => {
    await wait(1000);
    return db.product.findMany({
      where: { inStock: true },
      orderBy: { name: "asc" },
    });
  },
  ["/products", "getProducts"],
  { revalidate: 60 * 60 * 24 }
);

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

  if (products.length === 0) {
    return (
      <Card className="h-40 md:h-96 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No products found!</p>
      </Card>
    );
  }

  return products.map(product => (
    <ProductCard key={product.id} {...product}></ProductCard>
  ));
}
