import { EscrowState } from "@/lib/types";
import { STATE_LABELS, STATE_BADGE_STYLES } from "@/lib/constants";

interface StatusBadgeProps {
  state: EscrowState;
}

/**
 * State-aware badge — renders the correct colors and label
 * based on the escrow state, styled for the Obsidian Protocol palette.
 */
export default function StatusBadge({ state }: StatusBadgeProps) {
  const style = STATE_BADGE_STYLES[state];
  const label = STATE_LABELS[state];

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 ${style.bg} ${style.text} text-[11px] font-bold rounded-full font-label tracking-tight uppercase backdrop-blur-sm`}
    >
      {style.dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${style.dot}`} />
      )}
      {label}
    </span>
  );
}
