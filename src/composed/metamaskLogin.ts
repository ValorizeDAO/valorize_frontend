import { ref } from "vue";
import Ethereum from "../types/Ethereum"
import { ethers } from "ethers"
import { CreatorTokenFactory } from "../types/CreatorTokenFactory"
export default function metamaskLogin(address: string) { 
    const count = ref(0)
    const metamaskAuthStatuses = ["INIT", "REQUESTED", "PROCESSING", "TIMEOUT", "SUCCESS", "ERROR", "UNAVAILABLE"];
    const metamaskStatus = ref(metamaskAuthStatuses[0]);
    const errorText = ref("");
    async function metamaskAuthenticate(): Promise<void> {
      const ethereum: Ethereum = (window as any).ethereum
      if (ethereum) {
        setTimeout(() => {
          metamaskStatus.value = metamaskAuthStatuses[3];
        }, 10000)
      } else {
        metamaskStatus.value = metamaskAuthStatuses[6];
      }
      console.log({ ethereum });
      const signer = (new ethers.providers.Web3Provider(ethereum)).getSigner()
      console.log({ signer });
      const tokenContract = new CreatorTokenFactory(signer);
      tokenContract.attach(address)
      console.log(tokenContract);
    }
    return { count, metamaskStatus, errorText, metamaskAuthenticate }
}