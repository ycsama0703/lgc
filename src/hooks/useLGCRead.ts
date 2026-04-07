import { useState, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { getReadContract } from "../lib/contract";
import { type Role } from "../lib/config";
import { formatToken } from "../lib/format";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string; // human-readable
  owner: string;
}

export interface WalletInfo {
  balance: string; // human-readable
  isAdmin: boolean;
  isWhitelisted: boolean;
  role: Role;
}

// TODO Phase 2: call real contract; for now returns null until connected
export function useLGCRead() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (provider: BrowserProvider, address: string) => {
      setLoading(true);
      setError(null);
      try {
        const contract = getReadContract(provider);

        // Read token metadata
        // ABI functions: name(), symbol(), decimals(), totalSupply(), owner()
        const [name, symbol, decimals, totalSupplyRaw, owner] = await Promise.all([
          contract.name() as Promise<string>,
          contract.symbol() as Promise<string>,
          contract.decimals() as Promise<bigint>,
          contract.totalSupply() as Promise<bigint>,
          contract.owner() as Promise<string>,
        ]);
        const dec = Number(decimals);

        setTokenInfo({
          name,
          symbol,
          decimals: dec,
          totalSupply: formatToken(totalSupplyRaw, dec),
          owner,
        });

        // Read per-wallet state
        // ABI functions: balanceOf(address), isAdmin(address), isWhitelisted(address)
        const [balanceRaw, adminStatus, whitelistStatus] = await Promise.all([
          contract.balanceOf(address) as Promise<bigint>,
          contract.isAdmin(address) as Promise<boolean>,
          contract.isWhitelisted(address) as Promise<boolean>,
        ]);

        const isOwner = address.toLowerCase() === owner.toLowerCase();
        const role: Role = isOwner
          ? "Owner"
          : adminStatus
          ? "Admin"
          : whitelistStatus
          ? "Whitelisted"
          : "None";

        setWalletInfo({
          balance: formatToken(balanceRaw, dec),
          isAdmin: adminStatus,
          isWhitelisted: whitelistStatus,
          role,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Read failed");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { tokenInfo, walletInfo, loading, error, refresh };
}
