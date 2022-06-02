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
    rpcUrl: "https://mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_KEY,
  },
  3: {
    name: "Ropsten Testnet",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: "https://ropsten.infura.io/v3/" + import.meta.env.VITE_INFURA_KEY,
  },
  137: {
    name: "Polygon",
    blockExplorer: "https://polygonscan.com/",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
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
}
