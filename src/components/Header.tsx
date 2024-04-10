import React from "react";
import Image from "next/image";
import Nav, { NavLinks } from "./Nav";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  navLinks: { href: string; text: string }[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  return (
    <header className="flex w-full items-center justify-between bg-gray-200 darK:bg-gray-900 px-5">
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
      <ThemeToggle></ThemeToggle>
    </header>
  );
};

export default Header;
