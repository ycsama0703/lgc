import { useState } from "react";
import { Send, ThumbsUp, Repeat2, AlertTriangle } from "lucide-react";
import type { WalletInfo } from "../hooks/useLGCRead";
import type { useLGCWrite } from "../hooks/useLGCWrite";
import { TxStatus } from "./TxStatus";

interface Props {
  address: string | null;
  walletInfo: WalletInfo | null;
  write: ReturnType<typeof useLGCWrite>;
}

export function UserPanel({ address, walletInfo, write }: Props) {
  const [transferTo, setTransferTo] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [approveAddr, setApproveAddr] = useState("");
  const [approveAmt, setApproveAmt] = useState("");
  const [fromAddr, setFromAddr] = useState("");
  const [tfTo, setTfTo] = useState("");
  const [tfAmt, setTfAmt] = useState("");

  if (!address) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <Send size={28} className="text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Connect your wallet to use transfer functions.</p>
      </div>
    );
  }

  const notWhitelisted = walletInfo && !walletInfo.isWhitelisted;

  return (
    <div className="space-y-4">
      {notWhitelisted && (
        <div className="flex items-start gap-3 bg-yellow-950/40 border border-yellow-800/50 rounded-xl px-4 py-3">
          <AlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-xs">
            Your wallet is not whitelisted. Transfer transactions will be rejected by the contract and logged as blocked.
          </p>
        </div>
      )}

      <TxStatus tx={write.tx} onReset={write.reset} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Transfer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Send size={15} className="text-indigo-400" />
            <h3 className="text-white text-sm font-semibold">Transfer</h3>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Recipient address</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="0x…"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Amount</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="e.g. 10"
              value={transferAmt}
              onChange={(e) => setTransferAmt(e.target.value)}
            />
          </div>
          <button
            onClick={() => write.transfer(transferTo, transferAmt)}
            disabled={!transferTo || !transferAmt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg font-medium transition-colors"
          >
            Send Tokens
          </button>
        </div>

        {/* Approve */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp size={15} className="text-blue-400" />
            <h3 className="text-white text-sm font-semibold">Approve</h3>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Spender address</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="0x…"
              value={approveAddr}
              onChange={(e) => setApproveAddr(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Allowance amount</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="e.g. 50"
              value={approveAmt}
              onChange={(e) => setApproveAmt(e.target.value)}
            />
          </div>
          <button
            onClick={() => write.approve(approveAddr, approveAmt)}
            disabled={!approveAddr || !approveAmt}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg font-medium transition-colors"
          >
            Set Allowance
          </button>
        </div>

        {/* TransferFrom */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Repeat2 size={15} className="text-purple-400" />
            <h3 className="text-white text-sm font-semibold">Transfer From</h3>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">From address</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="0x…"
              value={fromAddr}
              onChange={(e) => setFromAddr(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">To address</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="0x…"
              value={tfTo}
              onChange={(e) => setTfTo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Amount</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="e.g. 10"
              value={tfAmt}
              onChange={(e) => setTfAmt(e.target.value)}
            />
          </div>
          <button
            onClick={() => write.transferFrom(fromAddr, tfTo, tfAmt)}
            disabled={!fromAddr || !tfTo || !tfAmt}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg font-medium transition-colors"
          >
            Transfer From
          </button>
        </div>
      </div>
    </div>
  );
}
