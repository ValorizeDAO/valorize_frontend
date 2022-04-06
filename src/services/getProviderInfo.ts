import { ethers } from 'ethers';

async function getProviderAndSigner() {
  let ethereum = (window as any).ethereum
  if (ethereum) {
    await ethereum.request({
      method: "eth_requestAccounts",
    })
    const provider = new ethers.providers.Web3Provider(
      ethereum,
    ) as ethers.providers.Web3Provider
    const signer = provider.getSigner() as ethers.providers.JsonRpcSigner
    return { provider, signer, error: false }
  } else {
    return { provider: null, signer: null, error: true }
  }
}

export { getProviderAndSigner }