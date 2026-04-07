import { useState } from "react";
import type { WalletInfo } from "../hooks/useLGCRead";
import type { useLGCWrite } from "../hooks/useLGCWrite";
import { TxStatus } from "./TxStatus";

interface Props {
  walletInfo: WalletInfo | null;
  isOwner: boolean;
  write: ReturnType<typeof useLGCWrite>;
}

function ActionForm({
  label,
  placeholder,
  buttonLabel,
  onSubmit,
  hasAmount = false,
}: {
  label: string;
  placeholder: string;
  buttonLabel: string;
  onSubmit: (addr: string, amount?: string) => void;
  hasAmount?: boolean;
}) {
  const [addr, setAddr] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-2">
      <p className="text-gray-300 text-sm font-medium">{label}</p>
      <input
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        placeholder={placeholder}
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
      />
      {hasAmount && (
        <input
          className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          placeholder="Amount (e.g. 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      )}
      <button
        onClick={() => onSubmit(addr, amount)}
        disabled={!addr || (hasAmount && !amount)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2 rounded font-medium"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export function AdminPanel({ walletInfo, isOwner, write }: Props) {
  const isAdmin = walletInfo?.isAdmin || isOwner;

  if (!isAdmin) return null;

  return (
    <section>
      <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide mb-3">
        Admin Panel
      </h2>
      <TxStatus tx={write.tx} onReset={write.reset} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Whitelist management */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="text-white text-sm font-semibold">Whitelist Management</h3>
          <ActionForm
            label="Add to Whitelist"
            placeholder="0x address"
            buttonLabel="Add"
            onSubmit={(addr) => write.addToWhitelist(addr)}
          />
          <ActionForm
            label="Remove from Whitelist"
            placeholder="0x address"
            buttonLabel="Remove"
            onSubmit={(addr) => write.removeFromWhitelist(addr)}
          />
        </div>

        {/* Mint / Burn */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="text-white text-sm font-semibold">Mint / Burn</h3>
          <ActionForm
            label="Mint"
            placeholder="Recipient address"
            buttonLabel="Mint"
            hasAmount
            onSubmit={(addr, amount) => write.mint(addr, amount ?? "")}
          />
          {/* ABI: burn(address from, uint256 amount) */}
          <ActionForm
            label="Burn"
            placeholder="Source address"
            buttonLabel="Burn"
            hasAmount
            onSubmit={(addr, amount) => write.burn(addr, amount ?? "")}
          />
        </div>

        {/* Owner-only section */}
        {isOwner && (
          <div className="bg-gray-800 border border-purple-800 rounded-lg p-4 space-y-4 md:col-span-2">
            <h3 className="text-purple-300 text-sm font-semibold">Owner-Only Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionForm
                label="Add Admin"
                placeholder="0x address"
                buttonLabel="Add Admin"
                onSubmit={(addr) => write.addAdmin(addr)}
              />
              <ActionForm
                label="Remove Admin"
                placeholder="0x address"
                buttonLabel="Remove Admin"
                onSubmit={(addr) => write.removeAdmin(addr)}
              />
              <ActionForm
                label="Transfer Ownership"
                placeholder="New owner address"
                buttonLabel="Transfer"
                onSubmit={(addr) => write.transferOwnership(addr)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
