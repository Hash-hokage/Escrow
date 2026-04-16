"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import ConnectWalletButton from "@/components/ui/ConnectWalletButton";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-vault-base/60 backdrop-blur-vault border-b border-border-subtle">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-vault font-headline">
          <span className="gradient-text-indigo">Ethereal</span>
          <span className="text-text-primary ml-1.5">Ledger</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2 font-headline tracking-vault">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
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
