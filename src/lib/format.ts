import { formatUnits, parseUnits } from "ethers";

/** Shorten an address for display: 0x1234…abcd */
export function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Format a raw uint256 token amount to human-readable string */
export function formatToken(raw: bigint, decimals: number): string {
  return formatUnits(raw, decimals);
}

/** Parse a human-readable amount string to raw uint256 */
export function parseToken(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

/** Format an ISO timestamp to a short local string */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString();
}
