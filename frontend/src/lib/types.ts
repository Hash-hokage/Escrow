/**
 * Escrow state enum — mirrors Escrow.sol's State enum exactly.
 *
 * enum State {
 *   Awaiting,   // 0 — Default state, awaiting payment
 *   Funded,     // 1 — Payment made, awaiting delivery
 *   Disputed,   // 2 — Paused for arbitration
 *   Complete,   // 3 — Transaction complete
 *   Reimbursed, // 4 — Buyer refunded
 *   Resolved    // 5 — Dispute resolved, seller paid
 * }
 */
export enum EscrowState {
  AWAITING = 0,
  FUNDED = 1,
  DISPUTED = 2,
  COMPLETE = 3,
  REIMBURSED = 4,
  RESOLVED = 5,
}

/** Role of the connected wallet relative to a given escrow */
export enum Role {
  BUYER = "Buyer",
  SELLER = "Seller",
  ARBITRATOR = "Arbitrator",
  NONE = "None",
}

/** On-chain Transaction struct — mirrors Escrow.sol */
export interface EscrowTransaction {
  id: bigint;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  arbitrator: `0x${string}`;
  amount: bigint;
  deadline: bigint;
  currentState: EscrowState;
}

/** Form data for creating a new escrow */
export interface CreateEscrowFormData {
  seller: string;
  arbitrator: string;
  deadline: string; // ISO date string from <input type="date" />
  amount: string; // ETH amount as string (e.g. "2.40")
}

/** Navigation link item */
export interface NavLink {
  label: string;
  href: string;
}
