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
        className="w-full text-left bg-gradient-to-r from-surface-container-high to-surface-container-low p-5 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center gap-4 relative z-10">
          <span className="w-2 h-2 rounded-full bg-tertiary-container active-dot" />
          <div>
            <div className="text-xs font-label text-outline mb-1">
              ESCROW ID: {dispute.id.toString()}
            </div>
            <div className="font-bold text-white">Disputed State</div>
          </div>
        </div>
        <div className="font-label text-sm text-primary relative z-10">
          Active
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left glass-card p-5 rounded-xl flex items-center justify-between opacity-60 hover:opacity-100 transition-all cursor-pointer shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="w-2 h-2 rounded-full bg-outline/30" />
        <div>
          <div className="text-xs font-label text-outline mb-1">
            ESCROW ID: {dispute.id.toString()}
          </div>
          <div className="font-bold text-white">Disputed State</div>
        </div>
      </div>
      <div className="font-label text-sm text-outline">Action Required</div>
    </button>
  );
}
