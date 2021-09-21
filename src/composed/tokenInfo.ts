import { computed, onMounted, ref } from "vue"
import { BigNumber, ethers } from "ethers"

export default function composeTokenInfo(username: string) {
  const tokenStatuses = ["INIT", "LOADING", "SUCCESS", "FAIL"]
  const tokenStatus = ref<string>(tokenStatuses[0])
  const tokenCap = ref<string>("")
  const tokenEthBalance = ref<BigNumber>(BigNumber.from("0"))
  const ethPrice = ref<string>("")
  const tokenPrice = computed(() => {
    if (usdLockedInContract.value === "0") return 0
    return (parseFloat(usdLockedInContract.value) / parseFloat(tokenCap.value))
  })
  const usdLockedInContract = computed(() => {
    const dollarAmountOfEther = Math.round(parseFloat(ethPrice.value)).toString()
    return ethers.utils.formatEther(
      tokenEthBalance.value.mul(BigNumber.from(dollarAmountOfEther))
    )
  })
  onMounted(async () => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/users/" + username + "/token")
      .then((response) => {
        if (response.status !== 200) {
          tokenStatus.value = tokenStatuses[3]
          return
        }
        tokenStatus.value = tokenStatuses[2]
        return response.json()
      })
      .then((result) => {
        tokenEthBalance.value = BigNumber.from(result.ether_staked)
        tokenCap.value = ethers.utils.formatUnits(result.total_minted, "ether")
      })
      .catch((error) => console.log(error))
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/utils/price")
      .then((response) => {
        if (response.status !== 200) {
          tokenStatus.value = tokenStatuses[3]
          return
        }
        return response.json()
      })
      .then((result) => {
        ethPrice.value = result.USD
      })
      .catch((error) => console.log(error))
  })
  return {
    tokenPrice,
    tokenCap,
    tokenEthBalance,
    ethPrice,
    tokenStatus,
    usdLockedInContract,
  }
}
