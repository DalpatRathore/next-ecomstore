import { Button } from "@react-email/components";
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
import {
  CheckCircle2,
  Globe,
  Infinity,
  ListChecks,
  Minus,
  MoreVertical,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import db from "@/db/db";

import { Prisma } from "@prisma/client";
import {
  formatDateTime,
  formatDiscountCode,
  formatNumber,
} from "@/lib/formatters";

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    {
      limit: { not: null, lte: db.discountCode.fields.uses },
    },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};
const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { name: true } },
  _count: { select: { orders: true } },
};

const getExpiredDiscountCouponCodes = () => {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
    where: WHERE_EXPIRED,
    orderBy: { createdAt: "desc" },
  });
};
const getUnexpiredDiscountCouponCodes = () => {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
    where: { NOT: WHERE_EXPIRED },
    orderBy: { createdAt: "desc" },
  });
};

const DiscountCodes = async () => {
  const [expiredDiscountCodes, unexpiredDiscountCodes] = await Promise.all([
    getExpiredDiscountCouponCodes(),
    getUnexpiredDiscountCouponCodes(),
  ]);
  return (
    <>
      <div className="flex justify-between items-center gap-4 border-b-2 mb-10">
        <PageHeader>Coupons</PageHeader>

        <Link href="/admin/discount-codes/new">Add Coupons</Link>
      </div>
      <DiscountCodesTable discountCodes={unexpiredDiscountCodes} />
      <div className="mt-8">
        <h2 className="text-xl font-bold">Expired Coupons</h2>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} />
      </div>
    </>
  );
};
export default DiscountCodes;

type DiscountCodesTableProps = {
  discountCodes: Awaited<ReturnType<typeof getUnexpiredDiscountCouponCodes>>;
};

async function DiscountCodesTable({ discountCodes }: DiscountCodesTableProps) {
  // if (discountCodes.length === 0)
  //   return (
  //     <Card className="h-40 md:h-96 w-full flex items-center justify-center mt-10">
  //       <p className="text-muted-foreground italic">No products found!</p>
  //     </Card>
  //   );

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead className="w-0">
            <ListChecks className="w-5 h-5"></ListChecks>
            <span className="sr-only">Is Active</span>
          </TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Remaining Uses</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discountCodes.map(discountCode => (
          <TableRow key={discountCode.id}>
            <TableCell>
              {discountCode.isActive ? (
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
            <TableCell>{discountCode.code}</TableCell>
            <TableCell>{formatDiscountCode(discountCode)}</TableCell>
            <TableCell>
              {discountCode.expiresAt == null ? (
                <Minus></Minus>
              ) : (
                formatDateTime(discountCode.expiresAt)
              )}
            </TableCell>
            <TableCell>
              {discountCode.limit == null ? (
                <Infinity></Infinity>
              ) : (
                formatNumber(discountCode.limit - discountCode.uses)
              )}
            </TableCell>
            <TableCell>{formatNumber(discountCode._count.orders)}</TableCell>

            <TableCell>
              {discountCode.allProducts ? (
                <Globe></Globe>
              ) : (
                discountCode.products.map(product => product.name).join("")
              )}
            </TableCell>

            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <ActiveToggleDropdownItem
                    id={discountCode.id}
                    inStock={discountCode.inStock}
                  /> */}
                  <DropdownMenuSeparator />
                  {/* <DeleteDropdownItem
                    id={discountCode.id}
                    disabled={discountCode._count.orders > 0}
                  /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
