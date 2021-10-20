import { onMounted, ref } from "vue"
import { useStore } from "vuex"
import { User, emptyUser } from "../models/User"
import {Token} from "../models/Token";
import { Link } from "../models/Link";
import { BigNumber, ethers } from "ethers";

interface TokenBalanceResponse {
  total_balance: string;
  wallets: Array<{
    address: string;
    balance: number }>
}
export default function composeUserInfo(username: string) {
  const store = useStore()
  const userStatuses = ["INIT", "LOADING", "SUCCESS", "FAIL"]
  const userStatus = ref<string>(userStatuses[0])
  const userInfo = ref<User>(emptyUser)
  const tokenInfo = ref<Token>(<Token>{})
  const showImage = ref<boolean>(false)
  const userTokenBalance = ref<string>("")
  const links = ref<Array<Link>>([])
  store.dispatch("authUser/checkAuth")

  async function getUserTokenBalance(tokenId: number) {
    const formdata = new FormData();
    formdata.append("username", store.getters["authUser/username"])
    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
      credentials: 'include',
    } as RequestInit

    const request = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/tokens/" + tokenId + "/balance", requestOptions);
    if (request.status === 200) {
      const response = (await request.json()) as TokenBalanceResponse    
      userTokenBalance.value = ethers.utils.formatEther(response.total_balance)
    }
  }
  onMounted(async () => {
    const userResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/users/" + username)
    if (userResponse.status !== 200) {
      userStatus.value = userStatuses[3]
      return
    }
    const userResult = await userResponse.json()
    userInfo.value = userResult
    userInfo.value.avatar = userResult.avatar ? userResult.avatar : "/default-avatar.jpg"
    tokenInfo.value = userResult.token
    if (store.getters["authUser/authenticated"]) {
      getUserTokenBalance(userResult.token.id)
    }
    const linkResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/users/" + username + "/links")
    if (linkResponse.status === 200) {
      const linkResult = await linkResponse.json() as  { links: Array<Link> }
      links.value = [...linkResult.links]
    }
  })
  return {
    username,
    userInfo,
    tokenInfo,
    userTokenBalance,
    showImage,
    links
  }
}
