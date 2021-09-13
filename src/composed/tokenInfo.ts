import { computed, onMounted, ref } from "vue"
import { ethers } from "ethers"

export default function composeTokenInfo(username: string) {
  const tokenStatuses = ["INIT", "LOADING", "SUCCESS", "FAIL"]
  const tokenStatus = ref<string>(tokenStatuses[0])
  const tokenCap = ref<string>("")
  const tokenEthBalance = ref<number>(0)
  const ethPrice = ref<number>(0.0)
  const tokenPrice = computed(() => {
    return (ethPrice.value * tokenEthBalance.value) / (tokenCap.value === "" ? 1 : parseFloat(tokenCap.value))
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
        tokenEthBalance.value = parseInt(result.ether_staked)
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
        ethPrice.value = parseFloat(result.USD)
      })
      .catch((error) => console.log(error))
  })
  return {
    tokenPrice,
    tokenCap,
    tokenEthBalance,
    ethPrice,
    tokenStatus,
  }
}
