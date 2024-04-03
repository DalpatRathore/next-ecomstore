import { Button } from "@/components/ui/button";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

const ProductsPage = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Page</PageHeader>
        <Button>
          <Link href={"/admin/products/new"}>Add Product</Link>
        </Button>
      </div>
      <ProductTable></ProductTable>
    </>
  );
};
export default ProductsPage;

export const ProductTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableHead className="w-0">
          <span className="sr-only">Available for purchase</span>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Order</TableHead>
        <TableHead className="w-0">
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
};
