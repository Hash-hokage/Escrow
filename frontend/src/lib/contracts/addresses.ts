/**
 * Contract addresses per chain.
 */
export const ESCROW_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || "0xDc57049AD966c99055F29B78EF3F1290b21b566d",
};

/**
 * Returns the escrow contract address for a given chain ID.
 */
export function getEscrowAddress(chainId: number): `0x${string}` {
  return ESCROW_ADDRESSES[chainId] ?? ESCROW_ADDRESSES[11155111];
}
