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

async function switchChainIfNeeded(): Promise<void> {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_PARAMS.chainId }],
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    if (err.code === 4902) {
      // Chain not in MetaMask yet — add it
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SEPOLIA_CHAIN_PARAMS],
      });
    } else {
      throw switchError;
    }
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);

  const connect = useCallback(async () => {
    setWallet((w) => ({ ...w, connecting: true, error: null }));
    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask not found. Please install it from metamask.io/download"
        );
      }

      const provider = new BrowserProvider(window.ethereum);

      // Request account access
      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // Check current chain
      let network = await provider.getNetwork();
      let chainId = Number(network.chainId);

      // If wrong chain, switch automatically — no second click needed
      if (chainId !== CHAIN_ID) {
        setWallet((w) => ({ ...w, connecting: true, error: null }));
        await switchChainIfNeeded();
        // Re-read chain after switch
        network = await provider.getNetwork();
        chainId = Number(network.chainId);
      }

      setWallet({
        address,
        chainId,
        provider: new BrowserProvider(window.ethereum), // fresh provider on correct chain
        isCorrectChain: chainId === CHAIN_ID,
        connecting: false,
        error: null,
      });
    } catch (e: unknown) {
      // User rejected or other error
      const msg =
        e instanceof Error ? e.message : "Connection failed";
      setWallet((w) => ({ ...w, connecting: false, error: msg }));
    }
  }, []);

  // switchToSepolia is kept for the manual button, calls connect after switching
  const switchToSepolia = useCallback(async () => {
    await switchChainIfNeeded().catch(() => null);
    await connect();
  }, [connect]);

  // Listen for account/chain changes — re-connect silently instead of full reload
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        // User disconnected wallet
        setWallet(initialState);
      } else {
        setWallet((w) => ({ ...w, address: accounts[0] }));
      }
    };

    const handleChainChanged = () => {
      // Re-connect silently so state refreshes without a full page reload
      void connect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect]);

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
