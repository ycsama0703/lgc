import { useState } from "react";
import { UserPlus, UserMinus, Flame, Sparkles, ShieldPlus, ShieldMinus, KeyRound } from "lucide-react";
import type { WalletInfo } from "../hooks/useLGCRead";
import type { useLGCWrite } from "../hooks/useLGCWrite";
import { TxStatus } from "./TxStatus";

interface Props {
  walletInfo: WalletInfo | null;
  isOwner: boolean;
  write: ReturnType<typeof useLGCWrite>;
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  addrLabel: string;
  amountLabel?: string;
  buttonLabel: string;
  buttonColor?: string;
  onSubmit: (addr: string, amount?: string) => void;
}

function ActionCard({ icon, title, addrLabel, amountLabel, buttonLabel, buttonColor = "bg-indigo-600 hover:bg-indigo-500", onSubmit }: ActionCardProps) {
  const [addr, setAddr] = useState("");
  const [amount, setAmount] = useState("");
  const valid = addr.trim() !== "" && (!amountLabel || amount.trim() !== "");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-white text-sm font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        <div>
          <label className="text-gray-500 text-xs mb-1 block">{addrLabel}</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            placeholder="0x…"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
        </div>
        {amountLabel && (
          <div>
            <label className="text-gray-500 text-xs mb-1 block">{amountLabel}</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="e.g. 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )}
        <button
          onClick={() => { onSubmit(addr, amount); }}
          disabled={!valid}
          className={`w-full ${buttonColor} disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg font-medium transition-colors`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export function AdminPanel({ walletInfo, isOwner, write }: Props) {
  const isAdmin = walletInfo?.isAdmin || isOwner;
  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <TxStatus tx={write.tx} onReset={write.reset} />

      {/* Whitelist + Mint/Burn */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">Whitelist Management</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            icon={<UserPlus size={15} />}
            title="Add to Whitelist"
            addrLabel="Wallet address"
            buttonLabel="Add Address"
            buttonColor="bg-green-700 hover:bg-green-600"
            onSubmit={(addr) => write.addToWhitelist(addr)}
          />
          <ActionCard
            icon={<UserMinus size={15} />}
            title="Remove from Whitelist"
            addrLabel="Wallet address"
            buttonLabel="Remove Address"
            buttonColor="bg-red-800 hover:bg-red-700"
            onSubmit={(addr) => write.removeFromWhitelist(addr)}
          />
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">Supply Management</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            icon={<Sparkles size={15} />}
            title="Mint Tokens"
            addrLabel="Recipient address"
            amountLabel="Amount"
            buttonLabel="Mint"
            buttonColor="bg-indigo-600 hover:bg-indigo-500"
            onSubmit={(addr, amt) => write.mint(addr, amt ?? "")}
          />
          <ActionCard
            icon={<Flame size={15} />}
            title="Burn Tokens"
            addrLabel="Source address"
            amountLabel="Amount"
            buttonLabel="Burn"
            buttonColor="bg-orange-700 hover:bg-orange-600"
            onSubmit={(addr, amt) => write.burn(addr, amt ?? "")}
          />
        </div>
      </div>

      {/* Owner-only */}
      {isOwner && (
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
            Owner Actions
            <span className="ml-2 text-purple-400 normal-case tracking-normal">(owner only)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ActionCard
              icon={<ShieldPlus size={15} />}
              title="Add Admin"
              addrLabel="Wallet address"
              buttonLabel="Add Admin"
              buttonColor="bg-purple-700 hover:bg-purple-600"
              onSubmit={(addr) => write.addAdmin(addr)}
            />
            <ActionCard
              icon={<ShieldMinus size={15} />}
              title="Remove Admin"
              addrLabel="Wallet address"
              buttonLabel="Remove Admin"
              buttonColor="bg-purple-900 hover:bg-purple-800"
              onSubmit={(addr) => write.removeAdmin(addr)}
            />
            <ActionCard
              icon={<KeyRound size={15} />}
              title="Transfer Ownership"
              addrLabel="New owner address"
              buttonLabel="Transfer Ownership"
              buttonColor="bg-red-900 hover:bg-red-800"
              onSubmit={(addr) => write.transferOwnership(addr)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
