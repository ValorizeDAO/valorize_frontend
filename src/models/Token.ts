export interface Token {
  id: number,
  token_type: string
  name: string,
  address: string,
  owner_address: string,
  symbol: string,
  chain_id: string,
  contract_version: string,
  tx_hash: string,
  user_id: number,
  created_at: string,
  updated_at: string | null,
  deleted_at: string | null
}

export const emptyToken: Token = {
  id: 0,
  token_type: "",
  name: "",
  address: "",
  owner_address: "",
  symbol: "",
  chain_id: "",
  contract_version: "",
  tx_hash: "",
  user_id: 0,
  created_at: "",
  updated_at: null,
  deleted_at: null,
}

export type TokenParams = {
  tokenName: string,
  tokenSymbol: string,
  initialSupply: string,
  vaultAddress: string,
  airdropSupply: string,
  adminAddresses: string,
  minting: string,
  supplyCap: string,
  maxSupply: string,
  timeDelay: number,
  mintCap: string,
}

export const emptyTokenParams = {
  tokenName: "",
  tokenSymbol: "",
  initialSupply: "",
  vaultAddress: "",
  airdropSupply: "",
  adminAddresses: "",
  minting: "",
  supplyCap: "",
  maxSupply: "",
  timeDelay: 0,
  mintCap: "",
}

export function isTokenParams(obj: any): obj is TokenParams {
  return (
    typeof obj === "object" &&
      obj !== null &&
      "tokenName" in obj &&
      "tokenSymbol" in obj &&
      "initialSupply" in obj &&
      "vaultAddress" in obj &&
      "airdropSupply" in obj &&
      "adminAddresses" in obj &&
      "minting" in obj &&
      "supplyCap" in obj &&
      "maxSupply" in obj &&
      "timeDelay" in obj &&
      "mintCap" in obj
  )
}
