import { BrowserProvider, Contract, ContractRunner } from "ethers";
import LGC_ABI from "../abi/lgc.json";
import { CONTRACT_ADDRESS } from "./config";

/**
 * Returns a read-only contract instance using the current provider.
 * Use this for view calls that don't require a signer.
 */
export function getReadContract(provider: BrowserProvider): Contract {
  return new Contract(CONTRACT_ADDRESS, LGC_ABI, provider);
}

/**
 * Returns a writable contract instance connected to a signer.
 * Use this for state-changing transactions.
 */
export function getWriteContract(runner: ContractRunner): Contract {
  return new Contract(CONTRACT_ADDRESS, LGC_ABI, runner);
}
