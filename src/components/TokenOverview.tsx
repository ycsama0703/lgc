import type { TokenInfo } from "../hooks/useLGCRead";

interface Props {
  tokenInfo: TokenInfo | null;
  loading: boolean;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-white text-lg font-mono font-semibold break-all">{value}</p>
    </div>
  );
}

export function TokenOverview({ tokenInfo, loading }: Props) {
  const placeholder = "—";

  return (
    <section>
      <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide mb-3">
        Token Overview
      </h2>
      {loading && (
        <p className="text-gray-500 text-sm mb-2">Loading token info…</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Name" value={tokenInfo?.name ?? placeholder} />
        <StatCard label="Symbol" value={tokenInfo?.symbol ?? placeholder} />
        <StatCard label="Decimals" value={tokenInfo ? String(tokenInfo.decimals) : placeholder} />
        <StatCard label="Total Supply" value={tokenInfo ? `${tokenInfo.totalSupply} ${tokenInfo.symbol}` : placeholder} />
      </div>
    </section>
  );
}
