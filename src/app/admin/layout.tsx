import Nav, { NavLinks } from "@/components/Nav";

export const dynamic = "force-dynamic";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[92%]">
      <Nav>
        <NavLinks href={"/admin"}>Dashboard</NavLinks>
        <NavLinks href={"/admin/products"}>Products</NavLinks>
        <NavLinks href={"/admin/users"}>Customers</NavLinks>
        <NavLinks href={"/admin/orders"}>Sales</NavLinks>
      </Nav>
      <div className="container my-6">{children}</div>
    </div>
  );
};
export default AdminLayout;
