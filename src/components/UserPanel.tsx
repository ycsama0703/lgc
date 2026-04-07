import { useState } from "react";
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

  if (!address) return null;

  const canTransfer = walletInfo?.isWhitelisted;

  return (
    <section>
      <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide mb-3">
        User Panel
      </h2>

      {!canTransfer && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 text-sm rounded px-3 py-2 mb-3">
          Your wallet is not whitelisted. Transfer actions will be rejected by the contract.
        </div>
      )}

      <TxStatus tx={write.tx} onReset={write.reset} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {/* Transfer */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-white text-sm font-semibold">Transfer</h3>
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Recipient address"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
          />
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Amount"
            value={transferAmt}
            onChange={(e) => setTransferAmt(e.target.value)}
          />
          <button
            onClick={() => write.transfer(transferTo, transferAmt)}
            disabled={!transferTo || !transferAmt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2 rounded font-medium"
          >
            Transfer
          </button>
        </div>

        {/* Approve */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-white text-sm font-semibold">Approve</h3>
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Spender address"
            value={approveAddr}
            onChange={(e) => setApproveAddr(e.target.value)}
          />
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Amount"
            value={approveAmt}
            onChange={(e) => setApproveAmt(e.target.value)}
          />
          <button
            onClick={() => write.approve(approveAddr, approveAmt)}
            disabled={!approveAddr || !approveAmt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2 rounded font-medium"
          >
            Approve
          </button>
        </div>

        {/* TransferFrom */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-white text-sm font-semibold">Transfer From</h3>
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="From address"
            value={fromAddr}
            onChange={(e) => setFromAddr(e.target.value)}
          />
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="To address"
            value={tfTo}
            onChange={(e) => setTfTo(e.target.value)}
          />
          <input
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Amount"
            value={tfAmt}
            onChange={(e) => setTfAmt(e.target.value)}
          />
          <button
            onClick={() => write.transferFrom(fromAddr, tfTo, tfAmt)}
            disabled={!fromAddr || !tfTo || !tfAmt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2 rounded font-medium"
          >
            Transfer From
          </button>
        </div>
      </div>
    </section>
  );
}
