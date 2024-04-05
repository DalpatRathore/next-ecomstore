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
import { Ellipsis, MoreVertical } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "./_components/UserActions";
import { Card } from "@/components/ui/card";

const getUsers = () => {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const UsersPage = () => {
  return (
    <>
      <PageHeader>Users</PageHeader>
      <UsersTable />
    </>
  );
};
export default UsersPage;

export const UsersTable = async () => {
  const users = await getUsers();

  if (users.length === 0)
    return (
      <Card className="h-40 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No user(s) found!</p>
      </Card>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="w-0">
            <Ellipsis className="w-5 h-5"></Ellipsis>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce(
                  (sum, order) => order.pricePaidInCents + sum,
                  0
                ) / 100
              )}
            </TableCell>
            {/* <TableCell>
              <Avatar>
                <AvatarImage src={product.imagePath}></AvatarImage>
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </TableCell> */}
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <DeleteDropdownItem id={user.id} />
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
