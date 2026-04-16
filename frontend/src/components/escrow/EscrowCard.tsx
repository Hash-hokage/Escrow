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
      className={`vault-card p-8 flex flex-col md:flex-row items-center gap-8 ${
        isAwaiting ? "opacity-70" : ""
      }`}
    >
      {/* Left: Details */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-4">
          <StatusBadge state={escrow.currentState} />
          <span className="text-text-muted font-label text-xs">
            ID: {formatAddress(escrow.id.toString(16).padStart(8, "0"))}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          <div>
            <p className="text-[11px] text-text-tertiary uppercase font-semibold tracking-widest mb-1">
              Seller
            </p>
            <p className="font-label text-text-primary text-sm">
              {formatAddress(escrow.seller)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase font-semibold tracking-widest mb-1">
              Arbitrator
            </p>
            <p className="font-label text-text-primary text-sm">
              {formatAddress(escrow.arbitrator)}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Amount */}
      <div className="text-center md:text-right w-full md:w-auto">
        <p
          className={`text-3xl font-extrabold font-label mb-1 ${
            isFunded ? "text-indigo" : "text-text-secondary"
          }`}
        >
          {formatEth(escrow.amount)} ETH
        </p>
        <p className="text-xs text-text-tertiary font-label">
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
                className="vault-btn vault-btn-primary flex-1 md:flex-none px-6 py-3 rounded-lg text-sm"
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
                className="vault-btn vault-btn-danger flex-1 md:flex-none px-6 py-3 rounded-lg text-sm"
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
                  className={`vault-btn w-full h-full px-6 py-3 rounded-lg text-sm ${
                    canRefund
                      ? "vault-btn-ghost hover:text-scarlet hover:border-scarlet/30"
                      : "opacity-40 cursor-not-allowed border border-border-subtle bg-vault-active/30 text-text-muted"
                  }`}
                >
                  {activeAction === "refund" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Refund"
                  )}
                </button>
                {!canRefund && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-vault-elevated text-[10px] text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-vault text-text-secondary">
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
