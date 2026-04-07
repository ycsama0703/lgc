import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useLGCRead } from "../hooks/useLGCRead";
import { useLGCWrite } from "../hooks/useLGCWrite";
import { loadBlockedTxs, type BlockedTx } from "../lib/blockedTxStore";
import { TopBar } from "../components/TopBar";
import { HowToUse } from "../components/HowToUse";
import { TokenOverview } from "../components/TokenOverview";
import { WalletStatus } from "../components/WalletStatus";
import { AdminPanel } from "../components/AdminPanel";
import { UserPanel } from "../components/UserPanel";
import { MonitoringPanel } from "../components/MonitoringPanel";
import { Footer } from "../components/Footer";

export function Dashboard() {
  const { wallet, connect, switchToSepolia } = useWallet();
  const { tokenInfo, walletInfo, loading, refresh } = useLGCRead();
  const [blockedTxs, setBlockedTxs] = useState<BlockedTx[]>(() => loadBlockedTxs());

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <TopBar
        address={wallet.address}
        chainId={wallet.chainId}
        isCorrectChain={wallet.isCorrectChain}
        role={walletInfo?.role ?? "None"}
        connectError={wallet.error}
        onConnect={connect}
        onSwitchChain={switchToSepolia}
        connecting={wallet.connecting}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Wrong chain warning */}
        {wallet.address && !wallet.isCorrectChain && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
            You are connected to the wrong network. Please switch to Sepolia to use this dashboard.
          </div>
        )}

        {/* How to use guide — collapsible, always visible */}
        <HowToUse />

        {/* Token overview — always visible */}
        <TokenOverview tokenInfo={tokenInfo} loading={loading} />

        {/* Two-column layout for wallet status + admin/user panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WalletStatus
              address={wallet.address}
              tokenInfo={tokenInfo}
              walletInfo={walletInfo}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AdminPanel
              walletInfo={walletInfo}
              isOwner={isOwner}
              write={write}
            />
            <UserPanel
              address={wallet.address}
              walletInfo={walletInfo}
              write={write}
            />
          </div>
        </div>

        {/* Monitoring */}
        <MonitoringPanel
          blockedTxs={blockedTxs}
          onClear={() => setBlockedTxs([])}
        />
      </main>

      <Footer />
    </div>
  );
}
