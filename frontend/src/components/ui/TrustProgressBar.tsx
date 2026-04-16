interface TrustProgressBarProps {
  /** Number of filled segments */
  filled: number;
  /** Total number of segments */
  total: number;
  /** Height class (default: h-1.5) */
  heightClass?: string;
  /** Label on the left side */
  leftLabel?: string;
  /** Label on the right side */
  rightLabel?: string;
}

/**
 * Segmented progress bar — Electric Indigo neon glow on filled segments.
 * Part of the Obsidian Protocol design system.
 */
export default function TrustProgressBar({
  filled,
  total,
  heightClass = "h-1.5",
  leftLabel,
  rightLabel,
}: TrustProgressBarProps) {
  return (
    <div>
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between items-center mb-4">
          {leftLabel && (
            <span className="text-xs font-bold tracking-[0.2em] text-text-tertiary uppercase">
              {leftLabel}
            </span>
          )}
          {rightLabel && (
            <span className="text-xs font-bold font-label text-emerald">
              {rightLabel}
            </span>
          )}
        </div>
      )}
      <div className={`flex gap-1 ${heightClass}`}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              i < filled
                ? "bg-indigo shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                : "bg-vault-active/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
