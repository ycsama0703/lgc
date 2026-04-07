import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useLGCRead } from "../hooks/useLGCRead";
import { useLGCWrite } from "../hooks/useLGCWrite";
import { loadBlockedTxs, type BlockedTx } from "../lib/blockedTxStore";
import { Sidebar, type Page } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { TokenOverview } from "../components/TokenOverview";
import { WalletStatus } from "../components/WalletStatus";
import { AdminPanel } from "../components/AdminPanel";
import { UserPanel } from "../components/UserPanel";
import { MonitoringPanel } from "../components/MonitoringPanel";
import { HowToUse } from "../components/HowToUse";
import { Footer } from "../components/Footer";

const PAGE_TITLES: Record<Page, string> = {
  overview: "Overview",
  admin: "Admin Panel",
  transfer: "Transfer",
  activity: "Activity Log",
  guide: "How to Use",
};

export function Dashboard() {
  const { wallet, connect, switchToSepolia } = useWallet();
  const { tokenInfo, walletInfo, loading, refresh } = useLGCRead();
  const [blockedTxs, setBlockedTxs] = useState<BlockedTx[]>(() => loadBlockedTxs());
  const [activePage, setActivePage] = useState<Page>("overview");

  // Load contract state whenever wallet connects or changes
  useEffect(() => {
    if (wallet.provider && wallet.address && wallet.isCorrectChain) {
      void refresh(wallet.provider, wallet.address);
    }
  }, [wallet.provider, wallet.address, wallet.isCorrectChain, refresh]);

  const handleSuccess = () => {
    if (wallet.provider && wallet.address) {
      void refresh(wallet.provider, wallet.address);
    }
  };

  const handleBlocked = (_tx: BlockedTx) => {
    setBlockedTxs(loadBlockedTxs());
  };

  const write = useLGCWrite(
    wallet.provider,
    wallet.address,
    tokenInfo?.decimals ?? 18,
    handleSuccess,
    handleBlocked
  );

  const isOwner =
    !!wallet.address &&
    !!tokenInfo?.owner &&
    wallet.address.toLowerCase() === tokenInfo.owner.toLowerCase();

  const role = walletInfo?.role ?? "None";

  // Auto-redirect away from admin page if role changes
  useEffect(() => {
    if (activePage === "admin" && role !== "Owner" && role !== "Admin") {
      setActivePage("overview");
    }
  }, [role, activePage]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        address={wallet.address}
        role={role}
        isCorrectChain={wallet.isCorrectChain}
        blockedCount={blockedTxs.length}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          address={wallet.address}
          isCorrectChain={wallet.isCorrectChain}
          connectError={wallet.error}
          onConnect={connect}
          onSwitchChain={switchToSepolia}
          connecting={wallet.connecting}
          pageTitle={PAGE_TITLES[activePage]}
        />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Wrong chain warning */}
          {wallet.address && !wallet.isCorrectChain && (
            <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/60 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
              You are on the wrong network. Please switch to Sepolia to interact with the contract.
            </div>
          )}

          {/* Overview */}
          {activePage === "overview" && (
            <div className="space-y-6 max-w-5xl">
              <TokenOverview tokenInfo={tokenInfo} loading={loading} />
              <WalletStatus address={wallet.address} tokenInfo={tokenInfo} walletInfo={walletInfo} />
            </div>
          )}

          {/* Admin */}
          {activePage === "admin" && (
            <div className="max-w-4xl">
              <AdminPanel walletInfo={walletInfo} isOwner={isOwner} write={write} />
            </div>
          )}

          {/* Transfer */}
          {activePage === "transfer" && (
            <div className="max-w-4xl">
              <UserPanel address={wallet.address} walletInfo={walletInfo} write={write} />
            </div>
          )}

          {/* Activity */}
          {activePage === "activity" && (
            <div className="max-w-4xl">
              <MonitoringPanel
                blockedTxs={blockedTxs}
                onClear={() => setBlockedTxs([])}
              />
            </div>
          )}

          {/* Guide */}
          {activePage === "guide" && (
            <HowToUse />
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}
