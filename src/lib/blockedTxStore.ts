const STORAGE_KEY = "lgc_blocked_txs";

export interface BlockedTx {
  time: string;       // ISO timestamp
  action: string;     // e.g. "transfer", "mint"
  from: string;
  to: string;
  amount: string;     // human-readable
  reason: string;     // short error message
}

export function loadBlockedTxs(): BlockedTx[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BlockedTx[]) : [];
  } catch {
    return [];
  }
}

export function saveBlockedTx(tx: BlockedTx): BlockedTx[] {
  const existing = loadBlockedTxs();
  const updated = [tx, ...existing].slice(0, 100); // keep last 100
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearBlockedTxs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
