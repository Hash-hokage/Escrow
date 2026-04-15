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
        iconColor: "text-primary",
        hoverShadow: "hover:shadow-primary/5",
      };
    case EscrowState.DISPUTED:
      return {
        Icon: Gavel,
        iconColor: "text-tertiary",
        hoverShadow: "hover:shadow-tertiary/5",
      };
    default:
      return {
        Icon: Package,
        iconColor: "text-on-surface-variant",
        hoverShadow: "",
      };
  }
}

/**
 * EscrowBentoCard — Dashboard grid card.
 * Shows escrow ID, amount, state badge, and role indicator.
 */
export default function EscrowBentoCard({ escrow, role }: EscrowBentoCardProps) {
  const { Icon, iconColor, hoverShadow } = getStateVisuals(escrow.currentState);
  const idHex = escrow.id.toString(16).padStart(8, "0");
  const shortId = `#${idHex.slice(0, 4)}...${idHex.slice(-4)}`;

  return (
    <div
      className={`glass-card rounded-3xl p-8 shadow-xl ${hoverShadow} hover:bg-surface-container-high transition-all duration-300 group flex flex-col h-full`}
    >
      {/* Header: Icon + Badge */}
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-surface-container rounded-xl">
          <Icon className={iconColor} size={24} />
        </div>
        <StatusBadge state={escrow.currentState} />
      </div>

      {/* Body: ID + Amount */}
      <div className="flex-1">
        <h3 className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">
          Escrow ID
        </h3>
        <p className="font-label text-lg mb-4">{shortId}</p>
        <div className="space-y-1">
          <h3 className="text-on-surface-variant font-label text-xs uppercase tracking-widest">
            Amount
          </h3>
          <p className="text-4xl font-bold font-label tracking-tighter">
            {formatEth(escrow.amount, 3)}{" "}
            <span className="text-primary-container text-2xl">ETH</span>
          </p>
        </div>
      </div>

      {/* Footer: Role + Link */}
      <div className="mt-8 pt-6 flex justify-between items-center">
        <span className="text-sm text-on-surface-variant">
          Role: <span className="text-on-surface font-medium">{role}</span>
        </span>
        <ExternalLink
          size={20}
          className="text-outline group-hover:text-primary transition-colors"
        />
      </div>
    </div>
  );
}
