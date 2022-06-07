export interface networks {
  [id: string]: network;
}
export interface network {
  name: string;
  blockExplorer: string;
  rpcUrl: string;
  currency: string;
}
export const networkInfo: networks = {
  1: {
    name: "Ethereum",
    blockExplorer: "https://etherscan.io/",
    rpcUrl: "https://mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_KEY,
    currency: "ETH",
  },
  3: {
    name: "Ropsten Testnet",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: "https://ropsten.infura.io/v3/" + import.meta.env.VITE_INFURA_KEY,
    currency: "rETH",
  },
  137: {
    name: "Polygon",
    blockExplorer: "https://polygonscan.com/",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    currency: "MATIC",
  },
  421611: {
    name: "Arbitrum Rinkeby",
    blockExplorer: "https://testnet.arbiscan.io/",
    rpcUrl: "https://rinkeby.arbitrum.io/rpc",
    currency: "ETH",
  },
  42161: {
    name: "Arbitrum",
    blockExplorer: "https://arbiscan.io/",
    rpcUrl: "https://rpc.arbiscan.io",
    currency: "ETH",
  },
}
