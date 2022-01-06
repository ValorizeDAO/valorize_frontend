import { Token } from "../models/Token"
import { BigNumber } from "ethers"


export default {
  async deployTokenToTestNet({ tokenName, tokenSymbol }: { tokenName: string, tokenSymbol: string }): Promise<any> {
    var formdata = new FormData();
    formdata.append("tokenName", tokenName);
    formdata.append("tokenTicker", tokenSymbol);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
      credentials: 'include',
    } as RequestInit;

    const apiResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/admin/deploy", requestOptions) as Response;

    return apiResponse;
  },
  async deploySimpleTokenToTestNet({ 
    freeSupply,
    airdropSupply,
    vaultAddress,
    tokenName,
    tokenSymbol,
    adminAddresses
  }: SimpleTokenParams): Promise<any> {
    var formdata = new FormData();
    formdata.append("freeSupply", freeSupply);
    formdata.append("airdropSupply", airdropSupply);
    formdata.append("vaultAddress", vaultAddress);
    formdata.append("tokenName", tokenName);
    formdata.append("tokenTicker", tokenSymbol);
    formdata.append("adminAddresses", JSON.stringify(adminAddresses));

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
      credentials: 'include',
    } as RequestInit;

    const apiResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/admin/deploy/simpletoken", requestOptions) as Response;
    return apiResponse;
  }
}

export interface SimpleTokenParams {
    freeSupply: string;
    airdropSupply: string;
    vaultAddress: string;
    tokenName: string;
    tokenSymbol: string;
    adminAddresses: string[];
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
