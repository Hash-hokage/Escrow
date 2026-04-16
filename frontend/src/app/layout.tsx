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
      <head>
        {/* Satoshi Font */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* Space Grotesk — Monospace Labels */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-screen bg-vault-base text-text-primary">
        {/* Atmospheric Lighting Layer (z-0) */}
        <div className="atmosphere" aria-hidden="true" />
        {/* Noise Texture Layer (z-1) */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Content Layer (z-10+) */}
        <div className="relative z-10">
          <Web3Provider>
            <TopNav />
            {children}
          </Web3Provider>
        </div>
      </body>
    </html>
  );
}
