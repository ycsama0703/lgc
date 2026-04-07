import { useState, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { getWriteContract } from "../lib/contract";
import { parseToken } from "../lib/format";
import { saveBlockedTx, type BlockedTx } from "../lib/blockedTxStore";

export type TxStatus = "idle" | "pending" | "success" | "error";

export interface TxState {
  status: TxStatus;
  message: string;
}

// Extracts a short human-readable reason from a contract revert
function extractReason(e: unknown): string {
  if (e instanceof Error) {
    // ethers v6 puts the revert reason in e.reason or e.info.error.message
    const err = e as Error & { reason?: string; info?: { error?: { message?: string } } };
    if (err.reason) return err.reason;
    if (err.info?.error?.message) return err.info.error.message;
    // Fallback: first 120 chars of the message
    return e.message.slice(0, 120);
  }
  return "Unknown error";
}

// TODO Phase 3/4: all write actions are wired here
export function useLGCWrite(
  provider: BrowserProvider | null,
  address: string | null,
  decimals: number,
  onSuccess: () => void,
  onBlocked: (tx: BlockedTx) => void
) {
  const [tx, setTx] = useState<TxState>({ status: "idle", message: "" });

  const reset = useCallback(() => setTx({ status: "idle", message: "" }), []);

  // Generic wrapper: runs a contract write, handles status + blocked tx logging
  const run = useCallback(
    async (
      action: string,
      to: string,
      amount: string,
      fn: () => Promise<unknown>
    ) => {
      if (!provider || !address) return;
      setTx({ status: "pending", message: "Waiting for confirmation…" });
      try {
        const result = fn();
        // result is a transaction — wait for it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const receipt = await (result as any).then((tx: any) => tx.wait());
        void receipt;
        setTx({ status: "success", message: "Transaction confirmed!" });
        onSuccess();
      } catch (e: unknown) {
        const reason = extractReason(e);
        setTx({ status: "error", message: reason });
        // Log as blocked tx for demo visibility
        const blocked: BlockedTx = {
          time: new Date().toISOString(),
          action,
          from: address,
          to,
          amount,
          reason,
        };
        const updated = saveBlockedTx(blocked);
        onBlocked(updated[0]);
      }
    },
    [provider, address, onSuccess, onBlocked]
  );

  // Admin actions (ABI: addToWhitelist, removeFromWhitelist, mint, burn)
  const addToWhitelist = useCallback(
    (user: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("addToWhitelist", user, "0", async () => {
        const contract = getWriteContract(await signer);
        return contract.addToWhitelist(user);
      });
    },
    [provider, run]
  );

  const removeFromWhitelist = useCallback(
    (user: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("removeFromWhitelist", user, "0", async () => {
        const contract = getWriteContract(await signer);
        return contract.removeFromWhitelist(user);
      });
    },
    [provider, run]
  );

  const mint = useCallback(
    (to: string, amount: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("mint", to, amount, async () => {
        const contract = getWriteContract(await signer);
        return contract.mint(to, parseToken(amount, decimals));
      });
    },
    [provider, run, decimals]
  );

  // ABI: burn(address from, uint256 amount)
  const burn = useCallback(
    (from: string, amount: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("burn", from, amount, async () => {
        const contract = getWriteContract(await signer);
        return contract.burn(from, parseToken(amount, decimals));
      });
    },
    [provider, run, decimals]
  );

  // User actions (ABI: transfer, approve, transferFrom)
  const transfer = useCallback(
    (to: string, amount: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("transfer", to, amount, async () => {
        const contract = getWriteContract(await signer);
        return contract.transfer(to, parseToken(amount, decimals));
      });
    },
    [provider, run, decimals]
  );

  const approve = useCallback(
    (spender: string, amount: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("approve", spender, amount, async () => {
        const contract = getWriteContract(await signer);
        return contract.approve(spender, parseToken(amount, decimals));
      });
    },
    [provider, run, decimals]
  );

  const transferFrom = useCallback(
    (from: string, to: string, amount: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("transferFrom", to, amount, async () => {
        const contract = getWriteContract(await signer);
        return contract.transferFrom(from, to, parseToken(amount, decimals));
      });
    },
    [provider, run, decimals]
  );

  // Owner-only actions (ABI: addAdmin, removeAdmin, transferOwnership)
  const addAdmin = useCallback(
    (user: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("addAdmin", user, "0", async () => {
        const contract = getWriteContract(await signer);
        return contract.addAdmin(user);
      });
    },
    [provider, run]
  );

  const removeAdmin = useCallback(
    (user: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("removeAdmin", user, "0", async () => {
        const contract = getWriteContract(await signer);
        return contract.removeAdmin(user);
      });
    },
    [provider, run]
  );

  const transferOwnership = useCallback(
    (newOwner: string) => {
      if (!provider) return;
      const signer = provider.getSigner();
      return run("transferOwnership", newOwner, "0", async () => {
        const contract = getWriteContract(await signer);
        return contract.transferOwnership(newOwner);
      });
    },
    [provider, run]
  );

  return {
    tx,
    reset,
    addToWhitelist,
    removeFromWhitelist,
    mint,
    burn,
    transfer,
    approve,
    transferFrom,
    addAdmin,
    removeAdmin,
    transferOwnership,
  };
}
