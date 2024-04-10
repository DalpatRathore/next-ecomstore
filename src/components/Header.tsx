import React from "react";
import Image from "next/image";
import Nav, { NavLinks } from "./Nav";

interface HeaderProps {
  navLinks: { href: string; text: string }[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  return (
    <header className="flex w-full items-center justify-between bg-primary">
      <div className="logo">
        <Image
          src={"/logo.svg"}
          width={50}
          height={50}
          alt="logo"
          className="max-w-full h-auto"
        />
      </div>

      <Nav>
        {navLinks.map(link => (
          <NavLinks key={link.href} href={link.href}>
            {link.text}
          </NavLinks>
        ))}
      </Nav>
    </header>
  );
};

export default Header;
