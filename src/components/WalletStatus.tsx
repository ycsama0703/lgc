import { ShieldCheck, CheckCircle2, XCircle, Crown, Wallet } from "lucide-react";
import { shortAddr } from "../lib/format";
import type { TokenInfo, WalletInfo } from "../hooks/useLGCRead";

interface Props {
  address: string | null;
  tokenInfo: TokenInfo | null;
  walletInfo: WalletInfo | null;
}

export function WalletStatus({ address, tokenInfo, walletInfo }: Props) {
  const symbol = tokenInfo?.symbol ?? "LGC";

  if (!address) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]">
        <Wallet size={28} className="text-gray-600" />
        <div>
          <p className="text-gray-400 text-sm font-medium">No wallet connected</p>
          <p className="text-gray-600 text-xs mt-0.5">Connect MetaMask to view your status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <Wallet size={14} className="text-gray-400" />
        <span className="text-gray-300 text-sm font-medium">My Wallet</span>
        <span className="ml-auto text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
          {shortAddr(address)}
        </span>
      </div>

      {/* Balance — hero stat */}
      <div className="px-4 py-5 border-b border-gray-800 bg-gradient-to-br from-indigo-950/30 to-transparent">
        <p className="text-gray-500 text-xs mb-1">Balance</p>
        <p className="text-white text-2xl font-bold font-mono">
          {walletInfo ? walletInfo.balance : "—"}
          <span className="text-gray-400 text-base font-normal ml-1.5">{symbol}</span>
        </p>
      </div>

      {/* Status rows */}
      <div className="divide-y divide-gray-800">
        <StatusRow
          icon={<ShieldCheck size={14} />}
          label="Admin"
          value={walletInfo?.isAdmin}
          trueText="Yes — can manage whitelist & supply"
          falseText="No"
        />
        <StatusRow
          icon={<CheckCircle2 size={14} />}
          label="Whitelisted"
          value={walletInfo?.isWhitelisted}
          trueText="Yes — can transfer tokens"
          falseText="No — transfers will be rejected"
        />
        <div className="px-4 py-3 flex items-center gap-3">
          <span className="text-gray-600"><Crown size={14} /></span>
          <span className="text-gray-400 text-xs w-24">Owner</span>
          <span className="text-gray-300 text-xs font-mono ml-auto">
            {tokenInfo ? shortAddr(tokenInfo.owner) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  trueText,
  falseText,
}: {
  icon: React.ReactNode;
  label: string;
  value?: boolean;
  trueText: string;
  falseText: string;
}) {
  const known = value !== undefined;
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <span className="text-gray-600">{icon}</span>
      <span className="text-gray-400 text-xs w-24">{label}</span>
      <div className="ml-auto flex items-center gap-1.5">
        {!known ? (
          <span className="text-gray-600 text-xs">—</span>
        ) : value ? (
          <>
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="text-green-400 text-xs">{trueText}</span>
          </>
        ) : (
          <>
            <XCircle size={12} className="text-gray-600" />
            <span className="text-gray-500 text-xs">{falseText}</span>
          </>
        )}
      </div>
    </div>
  );
}
