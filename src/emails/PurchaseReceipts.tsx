import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./_components/OrderInformation";

type PurchaseReceiptsProps = {
  product: { name: string; description: string; imagePath: string };
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationId: string;
};

const PurchaseReceipts = ({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptsProps) => {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            ></OrderInformation>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default PurchaseReceipts;

PurchaseReceipts.PreviewProps = {
  product: {
    name: "Dalpat Rathore",
    imagePath:
      "/products/6a612d85-4ec5-410b-8a42-41020a1a89af-dalpatrathore.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, veritatis.",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 1000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptsProps;
