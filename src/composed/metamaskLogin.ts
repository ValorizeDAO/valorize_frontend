import { ref } from "vue";
import Ethereum from "../types/Ethereum";
import { BigNumber, ethers, utils } from "ethers";
import { CreatorTokenFactory } from "../types/CreatorTokenFactory";
export default function metamaskLogin() {
  const count = ref(0);
  const metamaskAuthStatuses = [
    "INIT",
    "REQUESTED",
    "PROCESSING",
    "TIMEOUT",
    "SUCCESS",
    "ERROR",
    "UNAVAILABLE",
  ];
  const metamaskStatus = ref(metamaskAuthStatuses[0]);
  const errorText = ref("");
  async function sendBuyTransactionToCreatorToken(
    address: string,
    ethToBuy: number
  ): Promise<void> {
    const ethereum: Ethereum = (window as any).ethereum;
    if (ethereum) {
      setTimeout(() => {
        metamaskStatus.value = metamaskAuthStatuses[3];
      }, 10000);
    } else {
      metamaskStatus.value = metamaskAuthStatuses[6];
    }
    await ethereum.enable();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new CreatorTokenFactory(signer);
    const token = tokenContract.attach(address);
    const buyTx = await token.buyNewTokens({ value: utils.parseEther(ethToBuy.toString()) })
    console.log({ buyTx });
  }
  return { count, metamaskStatus, errorText, sendBuyTransactionToCreatorToken };
}
