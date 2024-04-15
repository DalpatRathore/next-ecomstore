import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getLastestProducts = cache(
  async () => {
    await wait(1000);
    return db.product.findMany({
      where: { inStock: true },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
  },
  ["/", "getLastestProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getFeaturedProducts = cache(
  async () => {
    await wait(2000);
    return db.product.findMany({
      where: { inStock: true },
      orderBy: {
        orders: { _count: "desc" },
      },
      take: 6,
    });
  },
  ["/", "getFeaturedProducts"],
  { revalidate: 60 * 60 * 24 }
);

const wait = (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export default function Home() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Latest Products"
        productFetcher={getLastestProducts}
      ></ProductGridSection>
      <Separator></Separator>
      <ProductGridSection
        title="Most Popular Products"
        productFetcher={getFeaturedProducts}
      ></ProductGridSection>
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
  title,
  productFetcher,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl">{title}</h2>
        <Button asChild variant={"outline"}>
          <Link href={"products"}>
            View All <ArrowRight className="w-4 h-4 ml-2"></ArrowRight>
          </Link>
        </Button>
      </div>
      <Separator className="bg-muted"></Separator>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
            </>
          }
        >
          <ProductSuspense productFetcher={productFetcher}></ProductSuspense>
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  if ((await productFetcher()).length === 0) {
    return (
      <Card className="h-40 md:h-96 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No products found!</p>
      </Card>
    );
  }
  return (await productFetcher()).map(product => (
    <ProductCard key={product.id} {...product}></ProductCard>
  ));
}
