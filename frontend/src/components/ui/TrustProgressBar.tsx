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
 * Segmented progress bar used on Buyer and Dashboard pages.
 * Exact visual match to the "Network Health" and "Trust Progress" bars.
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
            <span className="text-xs font-bold tracking-[0.2em] text-outline uppercase">
              {leftLabel}
            </span>
          )}
          {rightLabel && (
            <span className="text-xs font-bold font-label text-secondary">
              {rightLabel}
            </span>
          )}
        </div>
      )}
      <div className={`flex gap-1 ${heightClass}`}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i < filled
                ? "bg-primary shadow-[0_0_10px_rgba(175,198,255,0.4)]"
                : "bg-surface-variant/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
