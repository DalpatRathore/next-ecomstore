import Header from "@/components/Header";

export const dynamic = "force-dynamic";

const navLinks = [
  { href: "/", text: "Home" },
  { href: "/products", text: "Products" },
  { href: "/orders", text: "My Orders" },
];

const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[92%]">
      <Header navLinks={navLinks}></Header>
      <div className="container my-6">{children}</div>
    </div>
  );
};
export default FrontendLayout;
