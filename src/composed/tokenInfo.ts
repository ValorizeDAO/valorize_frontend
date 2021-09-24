import { computed, onMounted, ref } from "vue"
import { BigNumber, ethers } from "ethers"

export default function composeTokenInfo(username: string) {
  const tokenStatuses = ["INIT", "LOADING", "SUCCESS", "FAIL"]
  const tokenStatus = ref<string>(tokenStatuses[0])
  const tokenCap = ref<string>("")
  const tokenEthBalance = ref<BigNumber>(ethers.BigNumber.from("0"))
  const ethPrice = ref<string>("0")
  const tokenPrice = computed(() => {
    if (usdLockedInContract.value === "0") return 0
    return (parseFloat(usdLockedInContract.value) / parseFloat(tokenCap.value))
  })
  const usdLockedInContract = computed(() => {
    if (ethPrice.value === "0") return "0"
    const ethPriceDollar = Math.round(parseFloat(ethPrice.value)).toString()
    const ethPriceDollarBigNum = ethers.BigNumber.from(ethPriceDollar)
    return ethers.utils.formatEther(tokenEthBalance.value.mul(ethPriceDollarBigNum))
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
      .then(({ price_data: priceData }) => {
        tokenEthBalance.value = ethers.BigNumber.from(priceData.ether_staked)
        tokenCap.value = ethers.utils.formatUnits(priceData.total_minted, "ether")
      })
      .catch((error) => console.log("JAVIER", error))
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
