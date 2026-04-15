import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import Web3Provider from "@/components/providers/Web3Provider";

export const metadata: Metadata = {
  title: "Ethereal Ledger | Onchain Escrow Protocol",
  description:
    "Facilitating high-stakes transactions with mathematical certainty. Secure, trustless escrow on-chain for the modern digital economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`font-body min-h-screen bg-background text-on-background`}
      >
        <Web3Provider>
          <TopNav />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
