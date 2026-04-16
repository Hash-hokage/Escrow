import { EscrowState, NavLink } from "./types";

/** Navigation links used in TopNav */
export const NAV_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/" },
  { label: "Buyer", href: "/buyer" },
  { label: "Seller", href: "/seller" },
  { label: "Arbitrator", href: "/arbitrator" },
];

/** Human-readable labels for each escrow state */
export const STATE_LABELS: Record<EscrowState, string> = {
  [EscrowState.AWAITING]: "AWAITING",
  [EscrowState.FUNDED]: "Funded",
  [EscrowState.DISPUTED]: "Disputed",
  [EscrowState.COMPLETE]: "Complete",
  [EscrowState.REIMBURSED]: "Reimbursed",
  [EscrowState.RESOLVED]: "Resolved",
};

/**
 * Badge styling per state — Obsidian Protocol palette.
 * `dot` is optional; renders a colored indicator circle inside the badge.
 */
export const STATE_BADGE_STYLES: Record<
  EscrowState,
  { bg: string; text: string; dot?: string }
> = {
  [EscrowState.AWAITING]: {
    bg: "bg-vault-active",
    text: "text-text-secondary",
  },
  [EscrowState.FUNDED]: {
    bg: "bg-indigo/15",
    text: "text-indigo",
    dot: "bg-indigo shadow-[0_0_6px_rgba(79,70,229,0.6)]",
  },
  [EscrowState.DISPUTED]: {
    bg: "bg-amber/15",
    text: "text-amber",
    dot: "bg-amber shadow-[0_0_6px_rgba(245,158,11,0.6)]",
  },
  [EscrowState.COMPLETE]: {
    bg: "bg-emerald/15",
    text: "text-emerald",
    dot: "bg-emerald",
  },
  [EscrowState.REIMBURSED]: {
    bg: "bg-scarlet/15",
    text: "text-scarlet",
  },
  [EscrowState.RESOLVED]: {
    bg: "bg-indigo/10",
    text: "text-indigo-light",
  },
};

// Removed MOCK data
