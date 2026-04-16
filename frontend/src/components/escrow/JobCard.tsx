"use client";

import { useState } from "react";
import { Loader2, Gavel } from "lucide-react";
import { EscrowTransaction, EscrowState } from "@/lib/types";
import { formatAddress, formatEth, deadlineToTimeLeft, isDeadlinePassed } from "@/lib/utils";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import StatusBadge from "@/components/ui/StatusBadge";

interface JobCardProps {
  escrow: EscrowTransaction;
}

export default function JobCard({ escrow }: JobCardProps) {
  const { executeAction, isWritePending } = useEscrowContract();
  const [isDisputing, setIsDisputing] = useState(false);

  const isFunded = escrow.currentState === EscrowState.FUNDED;
  const isAwaiting = escrow.currentState === EscrowState.AWAITING;

  const handleRaiseDispute = async () => {
    setIsDisputing(true);
    try {
      await executeAction("dispute", escrow.id);
      alert(`Dispute triggered for escrow #${escrow.id.toString()}`);
    } catch (err: any) {
      console.error(err);
      alert(`Error during dispute: ${err.message}`);
    } finally {
      setIsDisputing(false);
    }
  };

  return (
    <div className="vault-card p-8 group">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Left: Job details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge state={escrow.currentState} />
            <span className="text-text-tertiary text-sm mono-text">
              ID: {formatAddress(escrow.id.toString(16).padStart(8, "0"))}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-indigo transition-colors duration-200">
            Escrow Contract Engagement
          </h3>
          <div className="grid grid-cols-2 gap-4 my-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold mb-1">
                Buyer
              </p>
              <p className="font-label text-text-primary text-sm">
                {formatAddress(escrow.buyer)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold mb-1">
                Arbitrator
              </p>
              <p className="font-label text-text-primary text-sm">
                {formatAddress(escrow.arbitrator)}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                Payout
              </p>
              <p className="text-3xl font-bold mono-text text-indigo">
                {formatEth(escrow.amount)} ETH
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                Deadline Status
              </p>
              <p className={`text-sm font-semibold ${isDeadlinePassed(escrow.deadline) ? "text-scarlet" : "text-text-primary"}`}>
                {deadlineToTimeLeft(escrow.deadline)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px] h-full">
          {isFunded && (
            <button
              onClick={handleRaiseDispute}
              disabled={isWritePending}
              className="vault-btn vault-btn-danger px-4 py-8 md:py-16 rounded-xl text-sm flex flex-col items-center justify-center gap-3 h-full"
            >
              {isDisputing ? (
                <Loader2 size={32} className="animate-spin" />
              ) : (
                <Gavel size={32} />
              )}
              Raise Dispute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
