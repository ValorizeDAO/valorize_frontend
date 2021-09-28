import { ref } from "vue";
import Ethereum from "../types/Ethereum";
import { ethers, utils } from "ethers";
import { CreatorTokenFactory } from "../types/CreatorTokenFactory";
import Auth from "../services/authentication";

export default function metamaskLogin() {
  const count = ref(0);
  const metamaskAuthStatuses = [
    "INIT", //0
    "REQUESTED", //1
    "TIMEOUT", //2
    "SUCCESSFULLY_ENABLED", //3
    "UNAVAILABLE", //4
    "TX_REQUESTED", //5
    "TX_SUCCESS", //6
    "TX_REJECTED", //7
    "TX_ERROR", //8
  ];
  const metamaskStatus = ref(metamaskAuthStatuses[0]);
  const buyTxHash = ref("");
  const sellTxHash = ref("");
  const buyingAddress = ref("");
  function loadTokenData(address: string) {
    const ethereum: any = (window as any).ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new CreatorTokenFactory(signer);
    const token = tokenContract.attach(address);
    return token;
  }
  async function sendBuyTransactionToCreatorToken(
    address: string,
    ethToBuy: number
  ): Promise<void> {
    metamaskStatus.value = metamaskAuthStatuses[0];
    const ethereum: Ethereum = (window as any).ethereum;
    if (!ethereum) {
      metamaskStatus.value = metamaskAuthStatuses[5];
    } else {
      metamaskStatus.value = metamaskAuthStatuses[1];
      setTimeout(() => {
        if (metamaskStatus.value == metamaskAuthStatuses[1]) {
          metamaskStatus.value = metamaskAuthStatuses[2];
        }
      }, 10000);
      const account = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      metamaskStatus.value = metamaskAuthStatuses[3];
      console.log({ account });
      buyingAddress.value = account[0];
      Auth.addExternalWalletToAccount(account[0]);

      const token = loadTokenData(address);
      token
        .buyNewTokens({ value: utils.parseEther(ethToBuy.toString()) })
        .then((tx) => {
          console.log({ tx });
          buyTxHash.value = tx.hash;
          metamaskStatus.value = metamaskAuthStatuses[6];
        })
        .catch((err) => {
          console.log({ err });
          if (err.code === 4001) {
            metamaskStatus.value = metamaskAuthStatuses[7];
          } else {
            metamaskStatus.value = metamaskAuthStatuses[8];
          }
        });
      metamaskStatus.value = metamaskAuthStatuses[5];
    }
  }
  async function sendSellTransactionToCreatorToken(
    address: string,
    tokenToSell: string
  ): Promise<void> {
    metamaskStatus.value = metamaskAuthStatuses[0];
    const ethereum: Ethereum = (window as any).ethereum;
    if (!ethereum) {
      metamaskStatus.value = metamaskAuthStatuses[5];
    } else {
      metamaskStatus.value = metamaskAuthStatuses[1];
      setTimeout(() => {
        if (metamaskStatus.value == metamaskAuthStatuses[1]) {
          metamaskStatus.value = metamaskAuthStatuses[2];
        }
      }, 10000);
      const account = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      metamaskStatus.value = metamaskAuthStatuses[3];
      console.log({ account });
      buyingAddress.value = account[0];
      Auth.addExternalWalletToAccount(account[0]);

      const token = loadTokenData(address);
      token
        .sellTokensForEth(utils.parseUnits(tokenToSell, 18))
        .then((tx) => {
          console.log({ tx });
          sellTxHash.value = tx.hash;
          metamaskStatus.value = metamaskAuthStatuses[6];
        })
        .catch((err) => {
          console.log({ err });
          if (err.code === 4001) {
            metamaskStatus.value = metamaskAuthStatuses[7];
          } else {
            metamaskStatus.value = metamaskAuthStatuses[8];
          }
        });
      metamaskStatus.value = metamaskAuthStatuses[5];
    }
  }
  return {
    count,
    metamaskStatus,
    buyTxHash,
    sellTxHash,
    buyingAddress,
    sendBuyTransactionToCreatorToken,
    sendSellTransactionToCreatorToken,
  };
}
