import { EscrowState, EscrowTransaction, NavLink, Role } from "./types";

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
 * Badge styling per state — maps directly to the Tailwind classes
 * used in the HTML templates.
 */
export const STATE_BADGE_STYLES: Record<
  EscrowState,
  { bg: string; text: string }
> = {
  [EscrowState.AWAITING]: {
    bg: "bg-surface-container-highest",
    text: "text-on-surface-variant",
  },
  [EscrowState.FUNDED]: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
  },
  [EscrowState.DISPUTED]: {
    bg: "bg-tertiary-container/20",
    text: "text-tertiary",
  },
  [EscrowState.COMPLETE]: {
    bg: "bg-secondary/20",
    text: "text-secondary",
  },
  [EscrowState.REIMBURSED]: {
    bg: "bg-primary/20",
    text: "text-primary",
  },
  [EscrowState.RESOLVED]: {
    bg: "bg-primary/20",
    text: "text-primary",
  },
};

// Removed MOCK data
