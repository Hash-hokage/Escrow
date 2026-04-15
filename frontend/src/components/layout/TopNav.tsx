"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import ConnectWalletButton from "@/components/ui/ConnectWalletButton";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121316]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tighter text-[#afc6ff] font-headline">
          Ethereal Ledger
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-10 font-headline tracking-tight">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-[#afc6ff] pb-1 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                    : "text-gray-400 font-medium hover:text-white transition-colors duration-300"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Connect Wallet Button */}
        <ConnectWalletButton />
      </div>
    </nav>
  );
}
