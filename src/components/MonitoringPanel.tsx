import { ShieldX, Trash2, Clock, ArrowRight } from "lucide-react";
import { shortAddr, formatTime } from "../lib/format";
import { clearBlockedTxs, type BlockedTx } from "../lib/blockedTxStore";

const ACTION_COLORS: Record<string, string> = {
  transfer:           "bg-red-900/50 text-red-300 border-red-800",
  transferFrom:       "bg-red-900/50 text-red-300 border-red-800",
  mint:               "bg-orange-900/50 text-orange-300 border-orange-800",
  burn:               "bg-orange-900/50 text-orange-300 border-orange-800",
  addToWhitelist:     "bg-yellow-900/50 text-yellow-300 border-yellow-800",
  removeFromWhitelist:"bg-yellow-900/50 text-yellow-300 border-yellow-800",
};

function getActionStyle(action: string) {
  return ACTION_COLORS[action] ?? "bg-gray-800 text-gray-400 border-gray-700";
}

interface Props {
  blockedTxs: BlockedTx[];
  onClear: () => void;
}

export function MonitoringPanel({ blockedTxs, onClear }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldX size={15} className="text-red-400" />
          <h2 className="text-gray-300 text-sm font-semibold">Blocked Transactions</h2>
          {blockedTxs.length > 0 && (
            <span className="bg-red-900/60 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-800">
              {blockedTxs.length}
            </span>
          )}
        </div>
        {blockedTxs.length > 0 && (
          <button
            onClick={() => { clearBlockedTxs(); onClear(); }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>

      {blockedTxs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <ShieldX size={28} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No blocked transactions yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Failed write attempts (whitelist violations, permission errors) will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {blockedTxs.map((tx, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getActionStyle(tx.action)}`}>
                  {tx.action}
                </span>
                <span className="flex items-center gap-1 text-gray-600 text-xs shrink-0">
                  <Clock size={10} />
                  {formatTime(tx.time)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono mb-2">
                <span className="text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{shortAddr(tx.from)}</span>
                {tx.to && tx.to !== "0" && (
                  <>
                    <ArrowRight size={10} className="text-gray-600 shrink-0" />
                    <span className="text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{shortAddr(tx.to)}</span>
                  </>
                )}
                {tx.amount && tx.amount !== "0" && (
                  <span className="text-gray-500 ml-1">· {tx.amount}</span>
                )}
              </div>
              <p className="text-red-400 text-xs leading-relaxed bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-1.5">
                {tx.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
