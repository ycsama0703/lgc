// Contract is deployed on Sepolia — do not change these
export const CONTRACT_ADDRESS = "0x320e2800731653835d9499080e38078F2E85EC1B";
export const CHAIN_ID = 11155111;
export const CHAIN_NAME = "Sepolia";

// Human-readable role labels
export type Role = "Owner" | "Admin" | "Whitelisted" | "None";

// Sepolia params for MetaMask wallet_switchEthereumChain / wallet_addEthereumChain
export const SEPOLIA_CHAIN_PARAMS = {
  chainId: "0xaa36a7", // 11155111 in hex
  chainName: "Sepolia",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};
