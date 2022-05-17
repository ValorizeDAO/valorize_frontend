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
