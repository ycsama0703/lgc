import {
  LayoutDashboard,
  ShieldCheck,
  ArrowLeftRight,
  Activity,
  BookOpen,
  Wallet,
  Circle,
} from "lucide-react";
import { shortAddr } from "../lib/format";
import { type Role } from "../lib/config";

export type Page = "overview" | "admin" | "transfer" | "activity" | "guide";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  roleRequired?: Role[];
}

const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "admin", label: "Admin Panel", icon: <ShieldCheck size={16} />, roleRequired: ["Owner", "Admin"] },
  { id: "transfer", label: "Transfer", icon: <ArrowLeftRight size={16} /> },
  { id: "activity", label: "Activity Log", icon: <Activity size={16} /> },
  { id: "guide", label: "How to Use", icon: <BookOpen size={16} /> },
];

const ROLE_STYLE: Record<Role, { bg: string; text: string; dot: string }> = {
  Owner:       { bg: "bg-purple-900/50", text: "text-purple-300", dot: "bg-purple-400" },
  Admin:       { bg: "bg-blue-900/50",   text: "text-blue-300",   dot: "bg-blue-400" },
  Whitelisted: { bg: "bg-green-900/50",  text: "text-green-300",  dot: "bg-green-400" },
  None:        { bg: "bg-gray-800",      text: "text-gray-400",   dot: "bg-gray-500" },
};

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
  address: string | null;
  role: Role;
  isCorrectChain: boolean;
  blockedCount: number;
}

export function Sidebar({ activePage, onNavigate, address, role, isCorrectChain, blockedCount }: Props) {
  const roleStyle = ROLE_STYLE[role];

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            L
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">LGC</p>
            <p className="text-gray-500 text-xs">Tokenized MMF</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          // Hide admin page for non-admin/owner
          if (item.roleRequired && !item.roleRequired.includes(role)) return null;

          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.id === "activity" && blockedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isActive ? "bg-white/20 text-white" : "bg-red-900 text-red-300"}`}>
                  {blockedCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Wallet info at bottom */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        {address ? (
          <>
            {/* Role badge */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${roleStyle.bg}`}>
              <Circle size={7} className={`fill-current ${roleStyle.dot} shrink-0`} />
              <span className={`text-xs font-semibold ${roleStyle.text}`}>
                {role === "None" ? "Not Whitelisted" : role}
              </span>
            </div>
            {/* Address */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800">
              <Wallet size={13} className="text-gray-500 shrink-0" />
              <span className="text-gray-300 text-xs font-mono">{shortAddr(address)}</span>
              {!isCorrectChain && (
                <span className="ml-auto text-xs text-red-400 font-medium">!</span>
              )}
            </div>
          </>
        ) : (
          <div className="px-3 py-2 rounded-lg bg-gray-800">
            <p className="text-gray-500 text-xs">No wallet connected</p>
          </div>
        )}
        {/* Network */}
        <div className="px-3">
          <span className={`text-xs font-mono ${isCorrectChain && address ? "text-green-500" : "text-gray-600"}`}>
            {address && isCorrectChain ? "● Sepolia" : "○ Sepolia"}
          </span>
        </div>
      </div>
    </aside>
  );
}
