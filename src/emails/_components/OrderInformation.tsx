import { formatCurrency } from "@/lib/formatters";
import {
  Button,
  Column,
  Hr,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { name: string; description: string; imagePath: string };
  downloadVerificationId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

const OrderInformation = ({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) => {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap font-semibold">
              Order ID
            </Text>
            <Text className="mt-0 mr-4 font-semibold">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap font-semibold">
              Purchase On
            </Text>
            <Text className="mt-0 mr-4 font-semibold">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap font-semibold">
              Price Paid
            </Text>
            <Text className="mt-0 mr-4 font-semibold text-center">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-200 rounded-lg p-2 md:p-4 my-2 ">
        <Img
          width={"100%"}
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
          className="rounded"
        ></Img>
        <Row className="mt-8">
          <Column align="left">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
          <Column align="right">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-1 rounded text-lg"
            >
              Download
            </Button>
          </Column>
        </Row>
        {/* <Hr></Hr> */}
        <Row>
          <Column>
            <Text className="text-gray-500">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
};
export default OrderInformation;
