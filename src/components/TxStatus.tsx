import type { TxState } from "../hooks/useLGCWrite";

interface Props {
  tx: TxState;
  onReset?: () => void;
}

const STYLES = {
  idle: "",
  pending: "bg-yellow-900 border-yellow-700 text-yellow-300",
  success: "bg-green-900 border-green-700 text-green-300",
  error: "bg-red-900 border-red-700 text-red-300",
};

export function TxStatus({ tx, onReset }: Props) {
  if (tx.status === "idle") return null;
  return (
    <div className={`border rounded px-3 py-2 text-sm flex items-start justify-between gap-2 ${STYLES[tx.status]}`}>
      <span>
        {tx.status === "pending" && "⏳ "}
        {tx.status === "success" && "✓ "}
        {tx.status === "error" && "✗ "}
        {tx.message}
      </span>
      {tx.status !== "pending" && onReset && (
        <button onClick={onReset} className="opacity-60 hover:opacity-100 shrink-0">
          ✕
        </button>
      )}
    </div>
  );
}
