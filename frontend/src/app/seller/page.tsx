"use client";

import Image from "next/image";
import { ShieldCheck, Loader2 } from "lucide-react";
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
      <main className="pt-32 pb-20 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-surface-container-low p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Wallet Disconnected</h2>
          <p className="text-on-surface-variant">
            Please connect your wallet to access the Seller Dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-32 pb-20 px-8 max-w-screen-xl mx-auto min-h-screen">
        {/* Header Section */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">
              Seller <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Manage your active service engagements and secure onchain payouts.
              Your reputation is your ledger.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-low px-6 py-4 rounded-xl">
              <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">
                Active Volume
              </p>
              <p className="text-3xl font-bold mono-text text-primary">
                {formatEth(activeVolume)}{" "}
                <span className="text-sm font-medium opacity-60">ETH</span>
              </p>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Jobs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Active Engagements
              </h2>
              <span className="text-on-surface-variant mono-text text-sm bg-surface-container-high px-3 py-1 rounded-full">
                {sellerEscrows.length} TASKS FOUND
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                <Loader2 size={32} className="animate-spin" />
                <p>Syncing jobs...</p>
              </div>
            ) : sellerEscrows.length > 0 ? (
              sellerEscrows.map((escrow) => (
                <JobCard key={escrow.id.toString()} escrow={escrow} />
              ))
            ) : (
              <div className="p-12 bg-surface-container-low rounded-3xl text-center border border-outline/10 text-on-surface-variant">
                You have no active escrow contracts as a seller.
              </div>
            )}
          </div>

          {/* Right Column: Profile */}
          <div className="lg:col-span-4 space-y-8">
            {/* Seller Identity */}
            <div className="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldCheck size={64} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
                  <Image
                    src="/images/seller-profile.webp"
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Seller Alias</h4>
                  <p className="text-primary text-sm mono-text">
                    {formatAddress(connectedAddress || "")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                 {/* Removed static legacy settlement history to ensure no fake data */}
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your identity is secured by smart contract cryptography. Complete engagements properly.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="glass-panel rounded-3xl p-8">
              <h4 className="text-lg font-bold mb-4">Security Notice</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Always verify the contract address. Avoid submitting deliverables off-chain without cryptographic verification of the buyer's identity.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-40 flex items-center justify-center bg-surface-dim">
        <p className="text-on-surface-variant text-sm mono-text opacity-40 uppercase tracking-widest">
          Powered by Ethereum • Immutable Escrow Protocol
        </p>
      </footer>
    </>
  );
}
