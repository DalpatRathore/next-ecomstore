import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

const loaderWait = (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

const getSalesData = async () => {
  const data = await db.order.aggregate({
    _sum: {
      pricePaidInCents: true,
    },
    _count: true,
  });
  await loaderWait(2000);
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
};

const getUserData = async () => {
  //   const userCount = await db.user.count();
  //   const orderData = await db.order.aggregate({
  //     _sum: { pricePaidInCents: true },
  //   });

  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    avgValPerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
};

const getProductData = async () => {
  const [activeCount, inActiveCount] = await Promise.all([
    db.product.count({ where: { inStock: true } }),
    db.product.count({ where: { inStock: false } }),
  ]);

  return { activeCount, inActiveCount };
};

const AdminDashboardPage = async () => {
  //   const salesData = await getSalesData();
  //   const userData = await getUserData();

  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        description={`${formatNumber(salesData.numberOfSales)} Orders`}
        content={formatCurrency(salesData.amount)}
      ></DashboardCard>
      <DashboardCard
        title="Customer"
        description={`${formatNumber(userData.avgValPerUser)} Average Value`}
        content={formatCurrency(userData.userCount)}
      ></DashboardCard>
      <DashboardCard
        title="Active Products"
        description={`${formatNumber(productData.inActiveCount)} Inactive`}
        content={formatNumber(productData.activeCount)}
      ></DashboardCard>
    </div>
  );
};
export default AdminDashboardPage;

type DashboardCardProps = {
  title: string;
  description: string;
  content: string;
};

const DashboardCard = ({ title, description, content }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
