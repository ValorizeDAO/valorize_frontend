export interface networks {
  [id: string]: network;
}
export interface network {
  name: string;
  blockExplorer: string;
  rpcUrl: string;
}
export const networkInfo: networks = {
  1: {
    name: "Ethereum",
    blockExplorer: "https://etherscan.io/",
    rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  3: {
    name: "Ropsten Testnet",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  137: {
    name: "Polygon",
    blockExplorer: "https://polygonscan.com/",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
  },
  10: {
    name: "Optimism",
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: "https://mainnet.optimism.io",
  },
  421611: {
    name: "Arbitrum Rinkeby",
    blockExplorer: "https://testnet.arbiscan.io/",
    rpcUrl: "https://rinkeby.arbitrum.io/rpc",
  },
  42161: {
    name: "Arbitrum",
    blockExplorer: "https://arbiscan.io/",
    rpcUrl: "https://rpc.arbiscan.io",
  },
};
