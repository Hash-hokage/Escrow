import { EscrowState } from "@/lib/types";
import { STATE_LABELS, STATE_BADGE_STYLES } from "@/lib/constants";

interface StatusBadgeProps {
  state: EscrowState;
}

/**
 * State-aware badge — renders the correct colors and label
 * based on the escrow state. Matches the HTML template classes exactly.
 */
export default function StatusBadge({ state }: StatusBadgeProps) {
  const style = STATE_BADGE_STYLES[state];
  const label = STATE_LABELS[state];

  return (
    <span
      className={`px-4 py-1.5 ${style.bg} ${style.text} text-xs font-bold rounded-full font-label tracking-tight uppercase`}
    >
      {label}
    </span>
  );
}
