import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./_components/OrderInformation";
import React from "react";

type OrderHistoryProps = {
  orders: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
    downloadVerificationId: string;
    product: { name: string; description: string; imagePath: string };
  }[];
};

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  return (
    <Html>
      <Preview>Order History & Download</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, i) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                ></OrderInformation>
                {i < orders.length - 1 && <Hr className="my-8"></Hr>}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default OrderHistory;

OrderHistory.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 1000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Dalpat Rathore",
        imagePath:
          "/products/6a612d85-4ec5-410b-8a42-41020a1a89af-dalpatrathore.jpg",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, veritatis.",
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 2000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Dalpat Singh Rathore",
        imagePath: "/products/8771b9a4-16ea-45c0-bd66-dbeef2c537a7-213.jpg",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, veritatis.",
      },
    },
  ],
} satisfies OrderHistoryProps;
