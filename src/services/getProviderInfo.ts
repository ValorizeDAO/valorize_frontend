import { ethers } from 'ethers';

async function getProviderAndSigner() {
  let ethereum = (window as any).ethereum
  if (ethereum) {
    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts",
    })
    const provider = new ethers.providers.Web3Provider(
      ethereum,
    ) as ethers.providers.Web3Provider
    const signer = provider.getSigner() as ethers.providers.JsonRpcSigner
    return { provider, signer, accounts, error: false }
  } else {
    return { provider: null, signer: null, accounts: null, error: true }
  }
}

export { getProviderAndSigner }