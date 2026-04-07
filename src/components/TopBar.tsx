import { shortAddr } from "../lib/format";
import { CONTRACT_ADDRESS, CHAIN_NAME, type Role } from "../lib/config";

const ROLE_COLORS: Record<Role, string> = {
  Owner: "bg-purple-600 text-white",
  Admin: "bg-blue-600 text-white",
  Whitelisted: "bg-green-600 text-white",
  None: "bg-gray-600 text-white",
};

interface Props {
  address: string | null;
  chainId: number | null;
  isCorrectChain: boolean;
  role: Role;
  connectError: string | null;
  onConnect: () => void;
  onSwitchChain: () => void;
  connecting: boolean;
}

export function TopBar({
  address,
  chainId,
  isCorrectChain,
  role,
  connectError,
  onConnect,
  onSwitchChain,
  connecting,
}: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Title */}
        <div>
          <h1 className="text-white text-lg font-bold tracking-tight">
            LGC Tokenized MMF Demo
          </h1>
          <p className="text-gray-400 text-xs font-mono">
            {shortAddr(CONTRACT_ADDRESS)}
            <span className="ml-2 text-gray-600">· Sepolia</span>
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Chain badge */}
          {address && (
            <span
              className={`text-xs px-2 py-1 rounded font-mono ${
                isCorrectChain
                  ? "bg-green-900 text-green-300 border border-green-700"
                  : "bg-red-900 text-red-300 border border-red-700"
              }`}
            >
              {isCorrectChain ? CHAIN_NAME : `Chain ${chainId} — wrong network`}
            </span>
          )}

          {/* Switch chain button */}
          {address && !isCorrectChain && (
            <button
              onClick={onSwitchChain}
              className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
            >
              Switch to Sepolia
            </button>
          )}

          {/* Role badge */}
          {address && (
            <span className={`text-xs px-2 py-1 rounded font-semibold ${ROLE_COLORS[role]}`}>
              {role === "None" ? "Non-whitelisted" : role}
            </span>
          )}

          {/* Wallet address / connect button */}
          {address ? (
            <span className="text-gray-300 text-sm font-mono bg-gray-800 px-3 py-1 rounded border border-gray-700">
              {shortAddr(address)}
            </span>
          ) : (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded font-medium"
            >
              {connecting ? "Connecting…" : "Connect MetaMask"}
            </button>
          )}
        </div>
      </div>

      {/* Connection error banner */}
      {connectError && (
        <div className="mt-2 text-xs text-red-300 bg-red-950 border border-red-800 rounded px-3 py-2 flex items-center gap-3">
          <span>✗ {connectError}</span>
          {connectError.toLowerCase().includes("not found") && (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="underline text-red-200 hover:text-white whitespace-nowrap"
            >
              Install MetaMask →
            </a>
          )}
        </div>
      )}
    </header>
  );
}
