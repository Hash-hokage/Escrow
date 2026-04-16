"use client";

import { useState } from "react";
import { EscrowTransaction } from "@/lib/types";
import { formatEth } from "@/lib/utils";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { User, Store, Gavel, Scale, Loader2 } from "lucide-react";

interface DisputeDetailPaneProps {
  dispute: EscrowTransaction;
}

export default function DisputeDetailPane({ dispute }: DisputeDetailPaneProps) {
  const { resolveDispute, isWritePending } = useEscrowContract();
  const [activeResolution, setActiveResolution] = useState<"buyer" | "seller" | null>(null);

  const handleResolveBuyer = async () => {
    setActiveResolution("buyer");
    try {
      await resolveDispute(dispute.id, true);
      alert("Successfully resolved in favor of Buyer!");
    } catch (err: any) {
      console.error(err);
      alert(`Error resolving: ${err.message}`);
    } finally {
      setActiveResolution(null);
    }
  };

  const handleResolveSeller = async () => {
    setActiveResolution("seller");
    try {
      await resolveDispute(dispute.id, false);
      alert("Successfully resolved in favor of Seller!");
    } catch (err: any) {
      console.error(err);
      alert(`Error resolving: ${err.message}`);
    } finally {
      setActiveResolution(null);
    }
  };

  return (
    <div className="vault-card overflow-hidden relative">
      {/* Content Layer */}
      <div className="p-10 md:p-14 space-y-12 relative z-10">
        {/* Header Data */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-4xl font-bold tracking-vault mb-3 gradient-text font-headline">
              Locked Engagement
            </h3>
            <p className="text-text-tertiary font-label text-sm">Escrow ID: {dispute.id.toString()}</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-label text-text-tertiary uppercase mb-1 tracking-widest">
              Locked Value
            </div>
            <div className="text-3xl font-extrabold text-emerald font-label">
              {formatEth(dispute.amount)} ETH
            </div>
          </div>
        </div>

        {/* Technical Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-[11px] font-label text-text-tertiary uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Buyer Address
            </div>
            <div className="bg-vault-active p-5 rounded-xl font-label text-sm break-all text-indigo/80 border border-border-subtle">
              {dispute.buyer}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-[11px] font-label text-text-tertiary uppercase tracking-widest flex items-center gap-2">
              <Store size={14} /> Seller Address
            </div>
            <div className="bg-vault-active p-5 rounded-xl font-label text-sm break-all text-emerald/80 border border-border-subtle">
              {dispute.seller}
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="pt-8">
          <div className="mb-8 text-sm text-text-secondary leading-relaxed vault-card p-5 italic border-l-2 border-amber/30">
            Execution of a resolution is permanent and written to the blockchain
            ledger immediately. Ensure all evidence has been weighed before
            proceeding.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleResolveBuyer}
              disabled={isWritePending}
              className="h-22 rounded-2xl btn-resolve-buyer font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {activeResolution === "buyer" ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Gavel size={22} />
              )}
              Resolve: Favour Buyer
            </button>
            <button
              onClick={handleResolveSeller}
              disabled={isWritePending}
              className="h-22 rounded-2xl btn-resolve-seller font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {activeResolution === "seller" ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Scale size={22} />
              )}
              Resolve: Favour Seller
            </button>
          </div>
        </div>
      </div>

      {/* Background Visual Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </div>
  );
}
