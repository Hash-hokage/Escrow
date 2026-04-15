"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BOTTOM_LINKS = [
  { href: "/", icon: LayoutDashboard, label: "Dash" },
  { href: "/buyer", icon: ShoppingBag, label: "Buy" },
  { href: "/seller", icon: Tag, label: "Sell" },
  { href: "/arbitrator", icon: Scale, label: "Arb" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low backdrop-blur-lg flex justify-around items-center px-6 z-50">
      {BOTTOM_LINKS.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary" : "text-outline"
            }`}
          >
            <Icon size={24} fill={isActive ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
