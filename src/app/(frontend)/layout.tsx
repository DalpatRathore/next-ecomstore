import Nav, { NavLinks } from "@/components/Nav";

export const dynamic = "force-dynamic";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[90%]">
      <Nav>
        <NavLinks href={"/"}>Home</NavLinks>
        <NavLinks href={"/products"}>Products</NavLinks>
        <NavLinks href={"/orders"}>My Orders</NavLinks>
      </Nav>
      <div className="container my-6">{children}</div>
    </div>
  );
};
export default MainLayout;