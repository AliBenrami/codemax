"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode; // Optional icon
}

interface NavProps {
  className?: string;
}

const Nav: React.FC<NavProps> = ({ className = "" }) => {
  const pathname = usePathname();

  // Local navigation links
  const navLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Login", href: "/Login" },
  ];

  return (
    <nav
      className={`flex items-center gap-6 p-4 bg-white shadow-sm rounded-lg ${className}`}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 rounded-md hover:bg-gray-100 ${
              isActive
                ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                : "text-gray-700"
            }`}
          >
            {link.icon && (
              <span className={isActive ? "text-blue-500" : "text-gray-500"}>
                {link.icon}
              </span>
            )}
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
