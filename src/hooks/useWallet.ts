import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { CHAIN_ID, SEPOLIA_CHAIN_PARAMS } from "../lib/config";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  isCorrectChain: boolean;
  connecting: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  provider: null,
  isCorrectChain: false,
  connecting: false,
  error: null,
};

// TODO Phase 2: implement full wallet connection logic
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);

  const connect = useCallback(async () => {
    // Phase 2: MetaMask connect + chain check
    setWallet((w) => ({ ...w, connecting: true, error: null }));
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new BrowserProvider(window.ethereum);
      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      setWallet({
        address: accounts[0],
        chainId,
        provider,
        isCorrectChain: chainId === CHAIN_ID,
        connecting: false,
        error: null,
      });
    } catch (e: unknown) {
      setWallet((w) => ({
        ...w,
        connecting: false,
        error: e instanceof Error ? e.message : "Connection failed",
      }));
    }
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_PARAMS.chainId }],
      });
    } catch (switchError: unknown) {
      // Chain not added yet — add it
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [SEPOLIA_CHAIN_PARAMS],
        });
      }
    }
    // After switching, chainChanged fires which reloads the page automatically.
    // If no reload happens (some wallets), re-read the chain from provider.
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      setWallet((w) => ({
        ...w,
        chainId,
        provider,
        isCorrectChain: chainId === CHAIN_ID,
      }));
    }
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setWallet((w) => ({ ...w, address: accounts[0] ?? null }));
    };
    const handleChainChanged = () => window.location.reload();
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { wallet, connect, switchToSepolia };
}

// Extend Window type for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
