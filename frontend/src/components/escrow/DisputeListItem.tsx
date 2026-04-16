import { EscrowTransaction } from "@/lib/types";
import { formatAddress } from "@/lib/utils";

interface DisputeListItemProps {
  dispute: EscrowTransaction;
  isSelected: boolean;
  onClick: () => void;
}

export default function DisputeListItem({
  dispute,
  isSelected,
  onClick,
}: DisputeListItemProps) {
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left vault-card p-5 flex items-center justify-between relative overflow-hidden border-l-2 border-indigo"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(79,70,229,0.08)",
        }}
      >
        <div className="flex items-center gap-4 relative z-10">
          <span className="live-dot" />
          <div>
            <div className="text-xs font-label text-text-tertiary mb-1">
              ESCROW ID: {dispute.id.toString()}
            </div>
            <div className="font-bold text-text-primary">Disputed State</div>
          </div>
        </div>
        <div className="font-label text-sm text-indigo relative z-10">
          Active
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left vault-card p-5 flex items-center justify-between opacity-50 hover:opacity-90 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <span className="w-2 h-2 rounded-full bg-text-muted" />
        <div>
          <div className="text-xs font-label text-text-tertiary mb-1">
            ESCROW ID: {dispute.id.toString()}
          </div>
          <div className="font-bold text-text-primary">Disputed State</div>
        </div>
      </div>
      <div className="font-label text-sm text-text-tertiary">Action Required</div>
    </button>
  );
}
