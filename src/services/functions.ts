class Functions {
  async getMerkleRoot(leaves: string[]) {
    return fetch(
      import.meta.env.VITE_SERVERLESS_URL + "/.netlify/functions/merkletree",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaves,
        }),
      }
    );
  }
}

const functions = new Functions();
export default functions;

export interface SimpleTokenParams {
  tokenType: string;
  contractVersion: string;
  freeSupply: string;
  airdropSupply: string;
  vaultAddress: string;
  tokenName: string;
  tokenSymbol: string;
  adminAddresses: string;
  chainId: string;
  txHash: string;
  contractAddress: string;
}

export interface TokenResponse {
  address: string;
  contract_version: string;
  name: string;
  network: string;
  symbol: string;
  tx: string;
  user_id: string;
}
