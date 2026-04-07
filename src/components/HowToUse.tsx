import { useState } from "react";
import { CONTRACT_ADDRESS, CHAIN_NAME } from "../lib/config";
import { shortAddr } from "../lib/format";

const ROLE_ROWS = [
  {
    role: "Owner",
    badge: "bg-purple-600",
    can: "Everything below, plus: Add/Remove Admins, Transfer Ownership",
  },
  {
    role: "Admin",
    badge: "bg-blue-600",
    can: "Add/Remove Whitelist, Mint, Burn",
  },
  {
    role: "Whitelisted",
    badge: "bg-green-600",
    can: "Transfer, Approve, TransferFrom (to/from other whitelisted addresses only)",
  },
  {
    role: "Non-whitelisted",
    badge: "bg-gray-600",
    can: "View dashboard only. Write actions will be rejected by the contract.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Install MetaMask",
    body: (
      <>
        Install the MetaMask browser extension from{" "}
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
          className="underline text-indigo-400 hover:text-indigo-200"
        >
          metamask.io/download
        </a>
        . Then refresh this page.
      </>
    ),
  },
  {
    step: "2",
    title: "Switch to Sepolia",
    body: (
      <>
        In MetaMask, switch your network to <strong>{CHAIN_NAME}</strong> (testnet). If
        you connect on the wrong network, a <em>"Switch to Sepolia"</em> button will
        appear — click it to switch automatically.
      </>
    ),
  },
  {
    step: "3",
    title: "Connect your wallet",
    body: (
      <>
        Click <strong>Connect MetaMask</strong> in the top-right corner. Approve the
        connection in the MetaMask popup. Your address, role badge, and token balance
        will appear automatically.
      </>
    ),
  },
  {
    step: "4",
    title: "Your role is detected automatically",
    body: (
      <>
        The dashboard reads your role from the contract:{" "}
        <strong>Owner → Admin → Whitelisted → Non-whitelisted</strong>. Admin and
        Owner panels are hidden for wallets without those permissions.
      </>
    ),
  },
  {
    step: "5",
    title: "Admin: manage whitelist and supply",
    body: (
      <>
        Admins can add or remove addresses from the whitelist, and mint or burn tokens.
        Enter a wallet address and (where required) an amount in human-readable units
        (e.g. <code className="bg-gray-700 px-1 rounded text-xs">100</code>), then
        click the action button. Confirm the transaction in MetaMask.
      </>
    ),
  },
  {
    step: "6",
    title: "User: transfer tokens",
    body: (
      <>
        Whitelisted users can transfer tokens to other whitelisted addresses. Transfers
        to non-whitelisted addresses will be rejected. Rejected attempts are captured
        and shown in the <strong>Blocked Transaction Log</strong> below.
      </>
    ),
  },
  {
    step: "7",
    title: "Blocked Transaction Log",
    body: (
      <>
        Any failed write attempt (permission denied, not whitelisted, etc.) is recorded
        locally in your browser. It shows the action type, addresses, amount, and
        rejection reason. This data persists across page refreshes and is stored in{" "}
        <code className="bg-gray-700 px-1 rounded text-xs">localStorage</code>.
      </>
    ),
  },
];

export function HowToUse() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-800 transition-colors"
      >
        <span className="text-gray-200 text-sm font-semibold">
          How to Use This Dashboard
        </span>
        <span className="text-gray-400 text-lg leading-none">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-6 border-t border-gray-700 pt-4">
          {/* Contract info */}
          <div className="bg-gray-800 rounded-lg px-4 py-3 text-xs font-mono text-gray-300 space-y-1">
            <div>
              <span className="text-gray-500">Contract </span>
              <span className="text-indigo-300">{CONTRACT_ADDRESS}</span>
            </div>
            <div>
              <span className="text-gray-500">Network  </span>
              <span className="text-green-300">{CHAIN_NAME} (chain ID 11155111)</span>
            </div>
            <div>
              <span className="text-gray-500">Explorer </span>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="underline text-indigo-400 hover:text-indigo-200"
              >
                sepolia.etherscan.io/address/{shortAddr(CONTRACT_ADDRESS)}
              </a>
            </div>
          </div>

          {/* Step-by-step */}
          <div>
            <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-wide mb-3">
              Getting Started
            </h3>
            <ol className="space-y-3">
              {STEPS.map(({ step, title, body }) => (
                <li key={step} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-700 text-white text-xs flex items-center justify-center font-bold">
                    {step}
                  </span>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <strong className="text-white">{title}. </strong>
                    {body}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Role table */}
          <div>
            <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-wide mb-3">
              Role Permissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase border-b border-gray-700">
                    <th className="pb-2 pr-4 font-medium">Role</th>
                    <th className="pb-2 font-medium">What you can do</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLE_ROWS.map(({ role, badge, can }) => (
                    <tr key={role} className="border-b border-gray-800 last:border-0">
                      <td className="py-2 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded text-white font-semibold ${badge}`}>
                          {role}
                        </span>
                      </td>
                      <td className="py-2 text-gray-300 text-xs leading-relaxed">{can}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="text-xs text-gray-500 space-y-1 border-t border-gray-800 pt-3">
            <p>• All token amounts are entered in human-readable units (e.g. 100 = 100 LGC). Decimal conversion is handled automatically.</p>
            <p>• This is a demo on Sepolia testnet. No real funds are involved.</p>
            <p>• Blocked transaction logs are stored in your browser only and are never sent anywhere.</p>
          </div>
        </div>
      )}
    </section>
  );
}
