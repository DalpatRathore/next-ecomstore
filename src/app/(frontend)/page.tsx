import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const getLastestProducts = async () => {
  return await db.product.findMany({
    where: { inStock: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
};
const getFeaturedProducts = async () => {
  return await db.product.findMany({
    where: { inStock: true },
    orderBy: {
      orders: { _count: "desc" },
    },
    take: 6,
  });
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
        productFetcher={getLastestProducts}
      ></ProductGridSection>
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

async function ProductGridSection({
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
        {(await productFetcher()).map(product => (
          <ProductCard key={product.id} {...product}></ProductCard>
        ))}
      </div>
    </div>
  );
}
