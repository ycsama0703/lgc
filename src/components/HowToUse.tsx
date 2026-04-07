import { BookOpen, ExternalLink, AlertCircle } from "lucide-react";
import { CONTRACT_ADDRESS, CHAIN_NAME } from "../lib/config";

const STEPS = [
  {
    step: "1",
    title: "Install MetaMask",
    body: <>Install the MetaMask browser extension from <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className="underline text-indigo-400 hover:text-indigo-200">metamask.io</a>, then refresh this page.</>,
    color: "border-indigo-800 bg-indigo-950/20",
    num: "bg-indigo-600",
  },
  {
    step: "2",
    title: "Switch to Sepolia Testnet",
    body: <>In MetaMask, switch to <strong className="text-white">Sepolia</strong>. If you connect on the wrong network, a <em>"Switch to Sepolia"</em> button appears automatically at the top.</>,
    color: "border-blue-800 bg-blue-950/20",
    num: "bg-blue-600",
  },
  {
    step: "3",
    title: "Connect Your Wallet",
    body: <>Click <strong className="text-white">Connect MetaMask</strong> in the top-right corner and approve in the popup. Your address, role, and balance will load automatically.</>,
    color: "border-purple-800 bg-purple-950/20",
    num: "bg-purple-600",
  },
  {
    step: "4",
    title: "Your Role is Detected",
    body: <>The dashboard reads your role directly from the contract: <strong className="text-white">Owner → Admin → Whitelisted → Non-whitelisted</strong>. The Admin Panel is hidden unless your wallet has admin rights.</>,
    color: "border-gray-700 bg-gray-900",
    num: "bg-gray-600",
  },
  {
    step: "5",
    title: "Admin: Whitelist & Supply",
    body: <>Admins can add/remove addresses from the whitelist and mint or burn tokens. Enter an address and amount, then confirm in MetaMask. The contract enforces all permissions on-chain.</>,
    color: "border-gray-700 bg-gray-900",
    num: "bg-gray-600",
  },
  {
    step: "6",
    title: "Transfer Tokens",
    body: <>Whitelisted users can transfer to other whitelisted addresses only. Transfers to non-whitelisted wallets will be rejected by the contract. Failed attempts are logged in the <strong className="text-white">Activity Log</strong>.</>,
    color: "border-gray-700 bg-gray-900",
    num: "bg-gray-600",
  },
  {
    step: "7",
    title: "Activity Log",
    body: <>All failed write attempts are recorded locally in your browser. Each entry shows the action type, addresses, amount, and rejection reason. Data persists across refreshes via <code className="bg-gray-700 px-1 rounded text-xs">localStorage</code>.</>,
    color: "border-gray-700 bg-gray-900",
    num: "bg-gray-600",
  },
];

const ROLES = [
  { role: "Owner", badge: "bg-purple-600", desc: "Full control: admin management, whitelist, mint, burn, transfer ownership" },
  { role: "Admin", badge: "bg-blue-600", desc: "Add/remove whitelist, mint tokens, burn tokens" },
  { role: "Whitelisted", badge: "bg-green-700", desc: "Transfer, approve, and transferFrom to other whitelisted addresses" },
  { role: "Non-whitelisted", badge: "bg-gray-600", desc: "View only — all write transactions will be rejected by the contract" },
];

export function HowToUse() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Contract reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
          <BookOpen size={14} className="text-gray-400" />
          <span className="text-gray-300 text-sm font-semibold">Contract Reference</span>
        </div>
        <div className="px-4 py-4 space-y-2 text-xs font-mono">
          <div className="flex gap-3">
            <span className="text-gray-600 w-20 shrink-0">Address</span>
            <span className="text-indigo-300 break-all">{CONTRACT_ADDRESS}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-600 w-20 shrink-0">Network</span>
            <span className="text-green-400">{CHAIN_NAME} — Chain ID 11155111</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-600 w-20 shrink-0">Explorer</span>
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-200 underline flex items-center gap-1"
            >
              sepolia.etherscan.io <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">Getting Started</p>
        <div className="space-y-3">
          {STEPS.map(({ step, title, body, color, num }) => (
            <div key={step} className={`border rounded-xl px-4 py-4 flex gap-4 ${color}`}>
              <span className={`shrink-0 w-6 h-6 rounded-full ${num} text-white text-xs font-bold flex items-center justify-center mt-0.5`}>
                {step}
              </span>
              <div className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">{title} — </strong>
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role table */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">Role Permissions</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 text-xs uppercase tracking-wide font-medium px-4 py-3 w-36">Role</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wide font-medium px-4 py-3">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ROLES.map(({ role, badge, desc }) => (
                <tr key={role} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded text-white font-semibold ${badge}`}>{role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs leading-relaxed">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
        <AlertCircle size={15} className="text-gray-500 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-500 space-y-1.5">
          <p>Token amounts are entered in human-readable units (e.g. <code className="bg-gray-800 px-1 rounded">100</code> = 100 LGC). Decimal conversion is handled automatically.</p>
          <p>This is a <strong className="text-gray-400">demo on Sepolia testnet</strong>. No real funds are involved.</p>
          <p>Blocked transaction logs are stored in your browser only (<code className="bg-gray-800 px-1 rounded">localStorage</code>) and are never transmitted anywhere.</p>
        </div>
      </div>
    </div>
  );
}
