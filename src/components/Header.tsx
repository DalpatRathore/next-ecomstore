import Nav, { NavLinks } from "./Nav";

const Header = () => {
  return (
    <header className="bg-red-500">
      <Nav>
        <NavLinks href={"/"}>Home</NavLinks>
        <NavLinks href={"/products"}>Products</NavLinks>
        <NavLinks href={"/orders"}>My Orders</NavLinks>
      </Nav>
    </header>
  );
};
export default Header;
