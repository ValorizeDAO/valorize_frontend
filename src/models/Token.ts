export interface Token {
  id: number,
  name: string,
  address: string,
  owner_address: string,
  symbol: string,
  network: string,
  contract_version: string,
  tx_hash: string,
  user_id: number,
  created_at: string,
  updated_at: string | null,
  deleted_at: string | null
}
