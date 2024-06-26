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
import { CircleUser, Ellipsis, ListChecks, MoreVertical } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const UsersTable = async () => {
  const users = await getUsers();

  if (users.length === 0)
    return (
      <Card className="h-40 md:h-96 w-full flex items-center justify-center mt-10">
        <p className="text-muted-foreground italic">No user(s) found!</p>
      </Card>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead className="w-0">
            <ListChecks className="w-5 h-5"></ListChecks>
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          {/* <TableHead>Product</TableHead> */}
          <TableHead className="w-0">
            {/* <Ellipsis className="w-5 h-5"></Ellipsis> */}
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <CircleUser className="stroke-gray-500" />
            </TableCell>
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
                <AvatarImage src={""}></AvatarImage>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
