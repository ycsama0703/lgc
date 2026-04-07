import { shortAddr } from "../lib/format";
import type { TokenInfo, WalletInfo } from "../hooks/useLGCRead";

interface Props {
  address: string | null;
  tokenInfo: TokenInfo | null;
  walletInfo: WalletInfo | null;
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`text-sm font-mono ${highlight ?? "text-white"}`}>{value}</span>
    </div>
  );
}

export function WalletStatus({ address, tokenInfo, walletInfo }: Props) {
  if (!address) {
    return (
      <section>
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide mb-3">
          My Wallet Status
        </h2>
        <p className="text-gray-500 text-sm">Connect your wallet to see status.</p>
      </section>
    );
  }

  const symbol = tokenInfo?.symbol ?? "LGC";

  return (
    <section>
      <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide mb-3">
        My Wallet Status
      </h2>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <Row label="Address" value={shortAddr(address)} />
        <Row
          label="Balance"
          value={walletInfo ? `${walletInfo.balance} ${symbol}` : "—"}
          highlight="text-indigo-300"
        />
        <Row
          label="Admin"
          value={walletInfo ? (walletInfo.isAdmin ? "Yes" : "No") : "—"}
          highlight={walletInfo?.isAdmin ? "text-blue-400" : "text-gray-400"}
        />
        <Row
          label="Whitelisted"
          value={walletInfo ? (walletInfo.isWhitelisted ? "Yes" : "No") : "—"}
          highlight={walletInfo?.isWhitelisted ? "text-green-400" : "text-red-400"}
        />
        <Row
          label="Owner"
          value={tokenInfo ? shortAddr(tokenInfo.owner) : "—"}
        />
      </div>
    </section>
  );
}
