"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { EscrowTransaction, EscrowState } from "@/lib/types";
import { formatAddress, formatEth, deadlineToTimeLeft, isDeadlinePassed } from "@/lib/utils";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import StatusBadge from "@/components/ui/StatusBadge";

interface EscrowCardProps {
  escrow: EscrowTransaction;
}

export default function EscrowCard({ escrow }: EscrowCardProps) {
  const { executeAction, isWritePending } = useEscrowContract();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const isFunded = escrow.currentState === EscrowState.FUNDED;
  const isAwaiting = escrow.currentState === EscrowState.AWAITING;
  const canRefund = isFunded && isDeadlinePassed(escrow.deadline);
  const isTerminal =
    escrow.currentState === EscrowState.COMPLETE ||
    escrow.currentState === EscrowState.REIMBURSED ||
    escrow.currentState === EscrowState.RESOLVED;

  const handleAction = async (action: "release" | "dispute" | "refund") => {
    setActiveAction(action);
    try {
      await executeAction(action, escrow.id);
      alert(`Successfully submitted ${action} transaction!`);
    } catch (err: any) {
      console.error(err);
      alert(`Error during ${action}: ${err.message}`);
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div
      className={`bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-surface-container ${
        isAwaiting ? "opacity-80" : ""
      }`}
    >
      {/* Left: Details */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-4">
          <StatusBadge state={escrow.currentState} />
          <span className="text-outline-variant font-label text-xs">
            ID: {formatAddress(escrow.id.toString(16).padStart(8, "0"))}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          <div>
            <p className="text-xs text-outline uppercase font-bold tracking-widest mb-1">
              Seller
            </p>
            <p className="font-label text-on-surface">
              {formatAddress(escrow.seller)}
            </p>
          </div>
          <div>
            <p className="text-xs text-outline uppercase font-bold tracking-widest mb-1">
              Arbitrator
            </p>
            <p className="font-label text-on-surface">
              {formatAddress(escrow.arbitrator)}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Amount */}
      <div className="text-center md:text-right w-full md:w-auto">
        <p
          className={`text-3xl font-extrabold font-label mb-1 ${
            isFunded ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          {formatEth(escrow.amount)} ETH
        </p>
        <p className="text-xs text-outline font-label">
          {isAwaiting
            ? "Pending network confirmation"
            : deadlineToTimeLeft(escrow.deadline)}
        </p>
      </div>

      {/* Right: Actions */}
      {!isTerminal && (
        <div
          className={`flex gap-3 w-full md:w-auto items-stretch flex-col md:flex-row ${
            isAwaiting ? "opacity-40 grayscale pointer-events-none" : ""
          }`}
        >
          {isFunded ? (
            <>
              <button
                onClick={() => handleAction("release")}
                disabled={isWritePending}
                className="flex items-center justify-center gap-2 flex-1 md:flex-none signature-gradient text-on-primary-container px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {activeAction === "release" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Release Funds"
                )}
              </button>
              <button
                onClick={() => handleAction("dispute")}
                disabled={isWritePending}
                className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {activeAction === "dispute" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Dispute"
                )}
              </button>
              <div className="relative group flex-1 md:flex-none">
                <button
                  onClick={() => handleAction("refund")}
                  disabled={!canRefund || isWritePending}
                  className={`w-full h-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    canRefund
                      ? "bg-tertiary/10 text-tertiary hover:bg-tertiary/20 active:scale-95"
                      : "opacity-50 cursor-not-allowed border border-tertiary/30 bg-tertiary/5 text-tertiary shadow-[0_0_15px_rgba(255,180,165,0.05)]"
                  }`}
                >
                  {activeAction === "refund" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Refund"
                  )}
                </button>
                {!canRefund && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-bright text-[10px] text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    Available after deadline passes
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
