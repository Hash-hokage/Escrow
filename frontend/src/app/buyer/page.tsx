"use client";

import CreateEscrowForm from "@/components/escrow/CreateEscrowForm";
import EscrowCard from "@/components/escrow/EscrowCard";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { formatEth } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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
      <main className="pt-32 pb-20 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-surface-container-low p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Wallet Disconnected</h2>
          <p className="text-on-surface-variant">
            Please connect your wallet to access the Buyer Dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-32 pb-20 px-8 max-w-screen-xl mx-auto">
        {/* Hero Section / Create Escrow Form */}
        <CreateEscrowForm />

        {/* Active Escrows Section */}
        <div className="mt-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tighter">
                Active <span className="text-outline">Escrows</span>
              </h2>
              <p className="text-on-surface-variant mt-2">
                Manage your ongoing onchain commitments.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold font-label">
                Total Funded Expected Locked: {formatEth(totalLocked)} ETH
              </span>
            </div>
          </div>

          {/* Escrow List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                <Loader2 size={32} className="animate-spin" />
                <p>Loading buyer escrows...</p>
              </div>
            ) : buyerEscrows.length > 0 ? (
              buyerEscrows.map((escrow) => (
                <EscrowCard key={escrow.id.toString()} escrow={escrow} />
              ))
            ) : (
              <div className="p-12 bg-surface-container-low rounded-3xl text-center border border-outline/10 text-on-surface-variant">
                You have no active escrow contracts as a buyer.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Decorative Background */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 pointer-events-none -z-10 bg-gradient-to-t from-primary/5 to-transparent" />
    </>
  );
}
