"use client";

import CreateEscrowForm from "@/components/escrow/CreateEscrowForm";
import EscrowCard from "@/components/escrow/EscrowCard";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { formatEth } from "@/lib/utils";
import { Loader2, ShieldOff } from "lucide-react";
import { EscrowState } from "@/lib/types";

export default function BuyerPage() {
  const { connectedAddress, isConnected, useUserEscrows } = useEscrowContract();

  const { data: allEscrows = [], isLoading } = useUserEscrows();

  // For the Buyer page, filter to escrows where connected user is buyer
  const buyerEscrows = allEscrows.filter(
    (e) => e.buyer.toLowerCase() === connectedAddress?.toLowerCase()
  );

  const totalLocked = buyerEscrows.reduce(
    (sum, e) => (e.currentState === EscrowState.FUNDED ? sum + e.amount : sum),
    0n
  );

  if (!isConnected) {
    return (
      <main className="pt-40 pb-22 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="vault-card p-14 text-center max-w-md">
          <ShieldOff size={48} className="mx-auto mb-6 text-text-tertiary animate-breathe" />
          <h2 className="text-3xl font-bold mb-4 font-headline gradient-text">Wallet Disconnected</h2>
          <p className="text-text-secondary">
            Please connect your wallet to access the Buyer Dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-40 pb-22 px-8 max-w-screen-xl mx-auto">
      {/* Hero Section / Create Escrow Form */}
      <CreateEscrowForm />

      {/* Active Escrows Section */}
      <div className="mt-26">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-vault font-headline">
              <span className="gradient-text">Active</span>{" "}
              <span className="text-text-tertiary">Escrows</span>
            </h2>
            <p className="text-text-secondary mt-3">
              Manage your ongoing onchain commitments.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-5 py-2.5 bg-vault-active rounded-full text-xs font-bold font-label text-indigo border border-border-subtle">
              Total Funded Locked: {formatEth(totalLocked)} ETH
            </span>
          </div>
        </div>

        {/* Escrow List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-text-secondary gap-4">
              <Loader2 size={32} className="animate-spin text-indigo" />
              <p>Loading buyer escrows...</p>
            </div>
          ) : buyerEscrows.length > 0 ? (
            buyerEscrows.map((escrow) => (
              <EscrowCard key={escrow.id.toString()} escrow={escrow} />
            ))
          ) : (
            <div className="vault-card p-14 text-center text-text-secondary">
              You have no active escrow contracts as a buyer.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
