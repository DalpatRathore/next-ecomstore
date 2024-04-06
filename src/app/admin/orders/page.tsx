import db from "@/db/db";
import PageHeader from "../_components/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Ellipsis, MoreVertical, Receipt } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { DeleteDropdownItem } from "../_components/OrderActions";

const getOrders = () => {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const OrdersPage = () => {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  );
};
export default OrdersPage;

export const OrdersTable = async () => {
  const orders = await getOrders();

  if (orders.length === 0)
    return (
      <Card className="h-40 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No order(s) found!</p>
      </Card>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead className="w-0">
            <DollarSign className="w-4 h-4"></DollarSign>
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <Ellipsis className="w-5 h-5"></Ellipsis>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>
              <Receipt className="w-4 h-4 stroke-gray-500" />
            </TableCell>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            {/* <TableCell>
              <Avatar>
                <AvatarImage src={product.imagePath}></AvatarImage>
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </TableCell> */}
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <DeleteDropdownItem id={order.id} />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
