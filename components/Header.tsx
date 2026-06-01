"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/notes", label: "笔记" },
  { href: "/projects", label: "项目" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-bold text-gray-900 hover:text-gray-600 transition-colors"
        >
          YourName
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname.startsWith(href)
                  ? "text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
