import { EscrowTransaction, EscrowState, Role } from "@/lib/types";
import { formatEth } from "@/lib/utils";
import { ShoppingCart, Gavel, Package, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface EscrowBentoCardProps {
  escrow: EscrowTransaction;
  role: Role;
}

/** Icon and hover shadow per state */
function getStateVisuals(state: EscrowState) {
  switch (state) {
    case EscrowState.FUNDED:
      return {
        Icon: ShoppingCart,
        iconColor: "text-indigo",
      };
    case EscrowState.DISPUTED:
      return {
        Icon: Gavel,
        iconColor: "text-amber",
      };
    default:
      return {
        Icon: Package,
        iconColor: "text-text-secondary",
      };
  }
}

/**
 * EscrowBentoCard — Dashboard grid card.
 * Shows escrow ID, amount, state badge, and role indicator.
 */
export default function EscrowBentoCard({ escrow, role }: EscrowBentoCardProps) {
  const { Icon, iconColor } = getStateVisuals(escrow.currentState);
  const idHex = escrow.id.toString(16).padStart(8, "0");
  const shortId = `#${idHex.slice(0, 4)}...${idHex.slice(-4)}`;

  return (
    <div className="vault-card p-8 flex flex-col h-full">
      {/* Header: Icon + Badge */}
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-vault-active rounded-xl">
          <Icon className={iconColor} size={24} />
        </div>
        <StatusBadge state={escrow.currentState} />
      </div>

      {/* Body: ID + Amount */}
      <div className="flex-1">
        <h3 className="text-text-tertiary font-label text-xs uppercase tracking-widest mb-1">
          Escrow ID
        </h3>
        <p className="font-label text-lg mb-4 text-text-primary">{shortId}</p>
        <div className="space-y-1">
          <h3 className="text-text-tertiary font-label text-xs uppercase tracking-widest">
            Amount
          </h3>
          <p className="text-4xl font-bold font-label tracking-tighter text-text-primary">
            {formatEth(escrow.amount, 3)}{" "}
            <span className="text-indigo text-2xl">ETH</span>
          </p>
        </div>
      </div>

      {/* Footer: Role + Link */}
      <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between items-center">
        <span className="text-sm text-text-secondary">
          Role: <span className="text-text-primary font-medium">{role}</span>
        </span>
        <ExternalLink
          size={20}
          className="text-text-muted group-hover:text-indigo transition-colors duration-200"
        />
      </div>
    </div>
  );
}
