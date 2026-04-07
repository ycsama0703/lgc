import { shortAddr, formatTime } from "../lib/format";
import { clearBlockedTxs, type BlockedTx } from "../lib/blockedTxStore";

interface Props {
  blockedTxs: BlockedTx[];
  onClear: () => void;
}

export function MonitoringPanel({ blockedTxs, onClear }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
          Blocked Transaction Log
        </h2>
        {blockedTxs.length > 0 && (
          <button
            onClick={() => { clearBlockedTxs(); onClear(); }}
            className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-2 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {blockedTxs.length === 0 ? (
        <p className="text-gray-600 text-sm italic">
          No blocked transactions yet. Attempts that fail due to whitelist restrictions will appear here.
        </p>
      ) : (
        <div className="space-y-2">
          {blockedTxs.map((tx, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-red-900 rounded-lg px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-400 font-medium uppercase text-xs tracking-wide">
                  {tx.action}
                </span>
                <span className="text-gray-500 text-xs">{formatTime(tx.time)}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                <span className="text-gray-400">From</span>
                <span className="text-gray-200">{shortAddr(tx.from)}</span>
                <span className="text-gray-400">To</span>
                <span className="text-gray-200">{shortAddr(tx.to) || "—"}</span>
                {tx.amount !== "0" && (
                  <>
                    <span className="text-gray-400">Amount</span>
                    <span className="text-gray-200">{tx.amount}</span>
                  </>
                )}
                <span className="text-gray-400">Reason</span>
                <span className="text-red-300 break-all">{tx.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
