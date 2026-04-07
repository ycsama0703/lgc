import { shortAddr } from "../lib/format";
import { SEPOLIA_CHAIN_PARAMS } from "../lib/config";

interface Props {
  address: string | null;
  isCorrectChain: boolean;
  connectError: string | null;
  onConnect: () => void;
  onSwitchChain: () => void;
  connecting: boolean;
  pageTitle: string;
}

export function TopBar({
  address,
  isCorrectChain,
  connectError,
  onConnect,
  onSwitchChain,
  connecting,
  pageTitle,
}: Props) {
  return (
    <header className="bg-gray-950 border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Page title */}
        <h1 className="text-white text-base font-semibold">{pageTitle}</h1>

        <div className="flex items-center gap-3">
          {/* Wrong chain */}
          {address && !isCorrectChain && (
            <button
              onClick={onSwitchChain}
              className="flex items-center gap-1.5 text-xs bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Switch to Sepolia
            </button>
          )}

          {/* Connect / address */}
          {address ? (
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-gray-200 text-xs font-mono">{shortAddr(address)}</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              {connecting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <span className="text-base">🦊</span>
                  Connect MetaMask
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {connectError && (
        <div className="mt-2 flex items-center gap-3 text-xs text-red-300 bg-red-950/60 border border-red-800 rounded-lg px-3 py-2">
          <span className="shrink-0">✗</span>
          <span>{connectError}</span>
          {connectError.toLowerCase().includes("not found") && (
            <a
              href={`https://${SEPOLIA_CHAIN_PARAMS.blockExplorerUrls?.[0] ? "metamask.io/download/" : "metamask.io/download/"}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto underline text-red-200 hover:text-white whitespace-nowrap"
            >
              Install MetaMask →
            </a>
          )}
        </div>
      )}
    </header>
  );
}
