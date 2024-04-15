import { Button } from "@/components/ui/button";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";

import {
  CheckCircle2,
  Download,
  Edit,
  Ellipsis,
  ListChecks,
  MoreVertical,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/ProductActions";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProductsPage = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4 border-b-2 mb-10">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
};

export default ProductsPage;

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      imagePath: true,
      inStock: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0)
    return (
      <Card className="h-40 md:h-96 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No products found!</p>
      </Card>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead className="w-0">
            <ListChecks className="w-5 h-5"></ListChecks>
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="w-0">
            <Ellipsis className="w-5 h-5"></Ellipsis>
            <span className="sr-only">Actions</span>
          </TableHead>
          {/* <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              {product.inStock ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 className="stroke-green-500" />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <Avatar>
                <AvatarImage src={product.imagePath}></AvatarImage>
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>
                      <Download className="w-4 h-4 mr-2"></Download>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2"></Edit>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={product.id}
                    inStock={product.inStock}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
