import Header from "@/components/Header";
import Nav, { NavLinks } from "@/components/Nav";

export const dynamic = "force-dynamic";

const navLinks = [
  { href: "/admin", text: "Dashboard" },
  { href: "/admin/products", text: "Products" },
  { href: "/admin/users", text: "Customers" },
  { href: "/admin/orders", text: "Sales" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[92%]">
      <Header navLinks={navLinks}></Header>
      <div className="container my-6">{children}</div>
    </div>
  );
};
export default AdminLayout;
