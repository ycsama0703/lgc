import { CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import type { TxState } from "../hooks/useLGCWrite";

interface Props {
  tx: TxState;
  onReset?: () => void;
}

const CONFIG = {
  pending: {
    wrapper: "bg-yellow-950/40 border-yellow-800/60 text-yellow-300",
    icon: <Loader2 size={14} className="animate-spin shrink-0" />,
  },
  success: {
    wrapper: "bg-green-950/40 border-green-800/60 text-green-300",
    icon: <CheckCircle2 size={14} className="text-green-400 shrink-0" />,
  },
  error: {
    wrapper: "bg-red-950/40 border-red-800/60 text-red-300",
    icon: <XCircle size={14} className="text-red-400 shrink-0" />,
  },
};

export function TxStatus({ tx, onReset }: Props) {
  if (tx.status === "idle") return null;
  const { wrapper, icon } = CONFIG[tx.status];
  return (
    <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 text-sm ${wrapper}`}>
      {icon}
      <span className="flex-1 leading-relaxed">{tx.message}</span>
      {tx.status !== "pending" && onReset && (
        <button onClick={onReset} className="opacity-50 hover:opacity-100 shrink-0 mt-0.5">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
