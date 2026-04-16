"use client";

import { ShieldCheck, Loader2, ShieldOff } from "lucide-react";
import JobCard from "@/components/escrow/JobCard";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { formatAddress, formatEth } from "@/lib/utils";

export default function SellerPage() {
  const { connectedAddress, isConnected, useUserEscrows } = useEscrowContract();
  const { data: allEscrows = [], isLoading } = useUserEscrows();

  const sellerEscrows = allEscrows.filter(
    (e) => e.seller.toLowerCase() === connectedAddress?.toLowerCase()
  );

  const activeVolume = sellerEscrows.reduce((sum, e) => sum + e.amount, 0n);

  if (!isConnected) {
    return (
      <main className="pt-40 pb-22 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="vault-card p-14 text-center max-w-md">
          <ShieldOff size={48} className="mx-auto mb-6 text-text-tertiary animate-breathe" />
          <h2 className="text-3xl font-bold mb-4 font-headline gradient-text">Wallet Disconnected</h2>
          <p className="text-text-secondary">
            Please connect your wallet to access the Seller Dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-40 pb-22 px-8 max-w-screen-xl mx-auto min-h-screen">
        {/* Header Section */}
        <div className="mb-22 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-vault font-headline mb-6">
              <span className="gradient-text">Seller</span>{" "}
              <span className="gradient-text-indigo">Dashboard</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Manage your active service engagements and secure onchain payouts.
              Your reputation is your ledger.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="vault-card px-6 py-5">
              <p className="text-text-tertiary text-[11px] uppercase font-semibold tracking-widest mb-1">
                Active Volume
              </p>
              <p className="text-3xl font-bold mono-text text-indigo">
                {formatEth(activeVolume)}{" "}
                <span className="text-sm font-medium text-text-tertiary">ETH</span>
              </p>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Jobs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary font-headline">
                <span className="w-1.5 h-8 bg-indigo rounded-full" />
                Active Engagements
              </h2>
              <span className="text-text-tertiary mono-text text-sm bg-vault-active px-4 py-1.5 rounded-full border border-border-subtle">
                {sellerEscrows.length} TASKS FOUND
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-text-secondary gap-4">
                <Loader2 size={32} className="animate-spin text-indigo" />
                <p>Syncing jobs...</p>
              </div>
            ) : sellerEscrows.length > 0 ? (
              sellerEscrows.map((escrow) => (
                <JobCard key={escrow.id.toString()} escrow={escrow} />
              ))
            ) : (
              <div className="vault-card p-14 text-center text-text-secondary">
                You have no active escrow contracts as a seller.
              </div>
            )}
          </div>

          {/* Right Column: Profile */}
          <div className="lg:col-span-4 space-y-8">
            {/* Seller Identity */}
            <div className="vault-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-text-muted">
                <ShieldCheck size={64} className="animate-breathe opacity-20" />
              </div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                {/* Generative Gradient Avatar */}
                <div className="w-16 h-16 gradient-avatar flex-shrink-0">
                  <span className="relative z-10 text-xl font-bold text-indigo font-label">
                    {connectedAddress ? connectedAddress.slice(2, 4).toUpperCase() : "??"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-text-primary">Seller Alias</h4>
                  <p className="text-indigo text-sm mono-text">
                    {formatAddress(connectedAddress || "")}
                  </p>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                {/* Removed static legacy settlement history to ensure no fake data */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your identity is secured by smart contract cryptography. Complete engagements properly.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="vault-card p-8">
              <h4 className="text-lg font-bold mb-4 text-text-primary">Security Notice</h4>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Always verify the contract address. Avoid submitting deliverables off-chain without cryptographic verification of the buyer&apos;s identity.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-40 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        <p className="text-text-tertiary text-sm mono-text uppercase tracking-widest">
          Powered by Ethereum • Immutable Escrow Protocol
        </p>
      </footer>
    </>
  );
}
