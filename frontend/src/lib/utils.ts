import { formatEther } from "viem";

/**
 * Truncates an address to the format 0x71C7...4E92
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a bigint wei amount to a human-readable ETH string.
 * Example: 2400000000000000000n → "2.40"
 */
export function formatEth(wei: bigint, decimals = 2): string {
  const eth = formatEther(wei);
  const num = parseFloat(eth);
  return num.toFixed(decimals);
}

/**
 * Converts a deadline timestamp to a human-readable time-left string.
 * Example: "Expires in 4 days" or "Expired 2 days ago"
 */
export function deadlineToTimeLeft(deadlineTimestamp: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const diff = deadlineTimestamp - now;

  if (diff <= 0n) {
    const absDays = Number(-diff) / 86400;
    if (absDays < 1) return "Expired recently";
    return `Expired ${Math.floor(absDays)} day${Math.floor(absDays) !== 1 ? "s" : ""} ago`;
  }

  const days = Number(diff) / 86400;
  if (days < 1) {
    const hours = Number(diff) / 3600;
    return `Expires in ${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? "s" : ""}`;
  }
  return `Expires in ${Math.floor(days)} day${Math.floor(days) !== 1 ? "s" : ""}`;
}

/**
 * Checks if the deadline has passed.
 */
export function isDeadlinePassed(deadlineTimestamp: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return now > deadlineTimestamp;
}

/**
 * Converts a date input string (YYYY-MM-DD) to a deadline duration in seconds
 * relative to now (for the createEscrow function).
 */
export function dateToDeadlineDuration(dateString: string): bigint {
  const targetDate = new Date(dateString);
  const now = Math.floor(Date.now() / 1000);
  const target = Math.floor(targetDate.getTime() / 1000);
  const duration = target - now;
  return duration > 0 ? BigInt(duration) : 0n;
}
