export interface networks {
    [id: string]: network;
}
export interface network {
    name: string;
    blockExplorer: string;
}
export const networkInfo: networks = {
  1: {
    name: "Ethereum",
    blockExplorer: "https://etherscan.io/",
  },
  3: {
    name: "Ropsten Testnet",
    blockExplorer: "https://ropsten.etherscan.io/",
  },
  137: {
    name: "Polygon",
    blockExplorer: "https://polygonscan.com/",
  },
  10: {
    name: "Optimism",
    blockExplorer: "https://optimistic.etherscan.io/",
  },
  421611: {
    name: "Arbitrum Testnet",
    blockExplorer: "https://testnet.arbiscan.io/",
  },
  42161: {
    name: "Arbitrum",
    blockExplorer: "https://arbiscan.io/",
  },
}
