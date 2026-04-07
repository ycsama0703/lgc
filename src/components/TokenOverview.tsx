import { Coins, Hash, Layers, TrendingUp } from "lucide-react";
import type { TokenInfo } from "../hooks/useLGCRead";

interface Props {
  tokenInfo: TokenInfo | null;
  loading: boolean;
}

const CARDS = [
  { key: "name",        label: "Token Name",   icon: <Coins size={18} />,     color: "text-indigo-400",  border: "border-indigo-900/60" },
  { key: "symbol",      label: "Symbol",       icon: <Hash size={18} />,      color: "text-purple-400",  border: "border-purple-900/60" },
  { key: "decimals",    label: "Decimals",     icon: <Layers size={18} />,    color: "text-blue-400",    border: "border-blue-900/60" },
  { key: "totalSupply", label: "Total Supply", icon: <TrendingUp size={18} />, color: "text-green-400",  border: "border-green-900/60" },
] as const;

function getValue(key: typeof CARDS[number]["key"], tokenInfo: TokenInfo | null): string {
  if (!tokenInfo) return "—";
  if (key === "name") return tokenInfo.name;
  if (key === "symbol") return tokenInfo.symbol;
  if (key === "decimals") return String(tokenInfo.decimals);
  if (key === "totalSupply") return `${tokenInfo.totalSupply} ${tokenInfo.symbol}`;
  return "—";
}

export function TokenOverview({ tokenInfo, loading }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Token Info</h2>
        {loading && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
            Loading…
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {CARDS.map(({ key, label, icon, color, border }) => (
          <div
            key={key}
            className={`bg-gray-900 border ${border} rounded-xl p-4 space-y-3`}
          >
            <div className={`${color}`}>{icon}</div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
              <p className={`font-semibold font-mono text-sm truncate ${tokenInfo ? "text-white" : "text-gray-600"}`}>
                {getValue(key, tokenInfo)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
