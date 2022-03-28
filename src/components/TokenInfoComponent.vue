<template>
  <div v-if="tokenInfo">
    <h2 class="font-black text-2xl">
      {{ tokenInfo.name }} ({{ tokenInfo.symbol }})
    </h2>
    <p class="my-4">
      Address:
      <a
        class="font-black underline text-center text-lg"
        :href="etherscanAddress + '/address/' + tokenInfo.address"
        target="_blank"
      >
        {{ tokenInfo.address && formatAddress(tokenInfo.address) }}
      </a>
    </p>
    <div
      class="mt-12"
      id="coin-data"
      v-if="tokenStatus === 'SUCCESS'"
    >
      <div class="flex justify-between flex-wrap">
        <div>
          <h3 class="text-l mr-3">
            <span
              class="font-black"
            >${{ currency(tokenPrice.toString()) }}</span>
            per token
          </h3>
        </div>
        <div>
          <h3 class="text-l mr-3">
            <span class="font-black">{{
              currency(tokenCap, { separator: "," })
            }}</span>
            in circulation
          </h3>
        </div>
        <div>
          <h3 class="text-l">
            <strong
              class="font-black"
            >${{ currency(usdLockedInContract) }}
            </strong>
            USD Locked in {{ tokenInfo.symbol }}
            <strong
              class="font-black"
            >({{ ethers.utils.formatEther(tokenEthBalance) }} ETH)</strong>
          </h3>
        </div>
      </div>
      <div class="mt-8 flex flex-col">
        <div class="flex flex-col">
          <span
            v-if="isAuthenticated"
          >Your Current {{ tokenInfo.symbol }} Balance:
            <strong class="font-black">{{
              currency(userTokenBalance)
            }}</strong></span>
          <span v-else>Sign in to see your balance</span>
          <div class="mt-2 mx-auto">
            <button
              @click="toggleBuyModal"
              class="btn bg-purple-100 my-8 md:w-42 mr-4"
            >
              Buy {{ tokenInfo.symbol }}
            </button>
            <button
              @click="toggleSellModal"
              class="btn bg-purple-100"
            >
              Sell {{ tokenInfo.symbol }}
            </button>
          </div>
        </div>
        <Modal
          :modal-is-open="modalIsOpen"
          :body-class="['bg-white', 'border', 'max-w-2xl']"
          @toggle="toggleBuyModal"
        >
          <div class="border-black md:p-10">
            <div v-if="modalType == 'buy'">
              <div class="mx-auto md:flex justify-center w-100 md:mb-0">
                <p class="text-center mb-4 md:mb-0">
                  Ether to Stake:
                </p>
                <div class="flex md:ml-6">
                  <button @click="ethToCheck -= 0.0001">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <input
                    v-model="ethToCheck"
                    @input="ethDebouncedListener"
                    step=".0001"
                    type="number"
                    class="bg-transparent border-b-2 border-black w-24"
                  >
                  <button @click="ethToCheck += 0.0001">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-center">
                <button
                  @click="checkEth"
                  class="btn bg-purple-100 my-8 w-42 mx-auto"
                >
                  Calculate Price for {{ tokenInfo.symbol }}
                </button>
                <div>
                  Amount of {{ tokenInfo.symbol }} to be received for
                  {{ ethToCheck }} ETH<br><strong>{{
                    amountToBeReceivedFromStakingEth
                  }}</strong>
                  {{ amountToBeReceivedFromStakingEth && tokenInfo.symbol }}
                </div>
                <div class="flex justify-center my-4">
                  <button
                    @click="
                      sendBuyTransactionToCreatorToken(
                        tokenInfo.address,
                        ethToCheck
                      )
                    "
                    class="
                      btn
                      mx-4
                      disabled:bg-gray-200
                      disabled:text-gray-400
                      disabled:border-gray-400
                    "
                    :disabled="ethToCheck === 0"
                  >
                    Buy Now
                  </button>
                </div>
                <transition
                  name="fade"
                  mode="out-in"
                >
                  <div v-if="metamaskStatus === 'INIT'" />
                  <div v-else-if="metamaskStatus === 'REQUESTED'">
                    please enable metamask or a web3 provider
                  </div>
                  <div v-else-if="metamaskStatus === 'TIMEOUT'">
                    timeout
                  </div>
                  <div v-else-if="metamaskStatus === 'SUCCESSFULLY_ENABLED'">
                    enabled
                  </div>
                  <div v-else-if="metamaskStatus === 'UNAVAILABLE'">
                    To buy tokens, please enable a web3 provider such as
                    <a
                      href="https://metamask.io/"
                      class="font-black underline"
                    >Metamask</a>
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_REQUESTED'">
                    Please confirm details in a web3 provider like Metamask
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_SUCCESS'">
                    You just bought {{ amountToBeReceivedFromStakingEth }}
                    {{ tokenInfo.symbol }}<br>
                    See the transaction here:
                    <a
                      class="font-black underline text-center text-lg"
                      :href="etherscanAddress + '/tx/' + buyTxHash"
                      target="_blank"
                    >
                      {{ formatAddress(buyTxHash) }} </a><br>
                    <router-link
                      v-if="!isAuthenticated"
                      class="my-3 font-black underline text-center text-lg"
                      :to="
                        '/login?redirectUri=' +
                          routeForRedirect +
                          '&registerAddress=' +
                          buyingAddress
                      "
                    >
                      Link your new tokens to valorize
                    </router-link>
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_REJECTED'">
                    Please verify the details and try again.
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_ERROR'">
                    There was an error processing the request to buy
                    {{ tokenInfo.symbol }}.
                  </div>
                </transition>
              </div>
            </div>
            <div v-if="modalType == 'sell'">
              <div class="flex justify-between w-100">
                Amount of Coins To Sell:
                <button @click="tokenToCheck -= 0.01">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <input
                  v-model="tokenToCheck"
                  @input="tokenDebouncedListener"
                  step=".0001"
                  type="number"
                  class="bg-transparent border-b-2 border-black"
                >
                <button @click="tokenToCheck += 0.01">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
              <div class="text-center">
                <button
                  @click="checkToken"
                  class="btn bg-purple-100 my-8 w-42 mx-auto"
                >
                  Calculate Sale Price for {{ tokenInfo.symbol }}
                </button>
                <div>
                  Amount of ETH to be received for
                  {{ tokenToCheck }} {{ tokenInfo.symbol }} <br><strong>{{
                    amountToBeReceivedForSellingToken
                  }}</strong>
                  {{ amountToBeReceivedForSellingToken && "ETH" }}
                </div>
                <div class="flex justify-center my-4">
                  <button
                    @click="
                      sendSellTransactionToCreatorToken(
                        tokenInfo.address,
                        tokenToCheck.toString()
                      )
                    "
                    class="
                      btn
                      mx-4
                      disabled:bg-gray-200
                      disabled:text-gray-400
                      disabled:border-gray-400
                    "
                    :disabled="tokenToCheck === 0"
                  >
                    Sell {{ tokenInfo.symbol }}
                  </button>
                </div>
                <transition
                  name="fade"
                  mode="out-in"
                >
                  <div v-if="metamaskStatus === 'INIT'" />
                  <div v-else-if="metamaskStatus === 'REQUESTED'">
                    please enable metamask or a web3 provider
                  </div>
                  <div v-else-if="metamaskStatus === 'TIMEOUT'">
                    timeout
                  </div>
                  <div v-else-if="metamaskStatus === 'SUCCESSFULLY_ENABLED'">
                    enabled
                  </div>
                  <div v-else-if="metamaskStatus === 'UNAVAILABLE'">
                    To buy tokens, please enable a web3 provider such as
                    <a
                      href="https://metamask.io/"
                      class="font-black underline"
                    >Metamask</a>
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_REQUESTED'">
                    Please confirm details in a web3 provider like Metamask
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_SUCCESS'">
                    You just sold {{ tokenToCheck }}
                    {{ tokenInfo.symbol }} for {{ amountToBeReceivedForSellingToken }} ETH<br>
                    See the transaction here:
                    <a
                      class="font-black underline text-center text-lg"
                      :href="etherscanAddress + '/tx/' + sellTxHash"
                      target="_blank"
                    >
                      {{ formatAddress(sellTxHash) }} </a><br>
                    <router-link
                      v-if="!isAuthenticated"
                      class="my-3 font-black underline text-center text-lg"
                      :to="
                        '/login?redirectUri=' +
                          routeForRedirect +
                          '&registerAddress=' +
                          buyingAddress
                      "
                    >
                      Link your account to valorize
                    </router-link>
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_REJECTED'">
                    Please verify the details and try again.
                  </div>
                  <div v-else-if="metamaskStatus === 'TX_ERROR'">
                    There was an error processing the request to sell
                    {{ tokenInfo.symbol }}.
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    <div v-else-if="tokenStatus === 'FAIL'">
      <h3 class="text-xl font-black">
        Token is not deployed yet. If you just deployed it, check the address on
        EtherScan
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue"
import composeTokenInfo from "../composed/tokenInfo"
import composeUserInfo from "../composed/userInfo"
import composeDebounced from "../composed/useDebounced"
import creatorTokenInterface from "../composed/creatorTokenInterface"
import { formatAddress } from "../services/formatAddress"
import Modal from "./Modal.vue"
import { ethers } from "ethers"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import currency from "currency.js"

export default defineComponent({
  name: "TokenInfoComponent",
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  components: { Modal },
  setup: (props) => {
    const router = useRouter()
    const store = useStore()
    const amountToBeReceivedFromStakingEth = ref<string>("")
    const amountToBeReceivedForSellingToken = ref<string>("")
    const ethToCheck = ref<number>(0)
    const tokenToCheck = ref<number>(0)
    const modalIsOpen = ref<boolean>(false)
    const etherscanAddress = import.meta.env.VITE_ETHERSCAN_ADDRESS_MAINNET
    const routeForRedirect = encodeURI(router.currentRoute.value.fullPath)
    const isAuthenticated = store.getters["authUser/authenticated"]
    const modalType = ref<string>("")
    async function checkEth() {
      console.log("checking eth")

      const formdata = new FormData()
      formdata.append(
        "etherToCheck",
        ethers.utils.parseUnits(String(ethToCheck.value), 18).toString(),
      )

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      } as RequestInit
      const request = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          "/api/v0/users/" +
          props.username +
          "/token/stakingrewards",
        requestOptions,
      )
      const response = (await request.json()) as {
        toBuyer: string;
        toOwner: string;
      }
      amountToBeReceivedFromStakingEth.value = ethers.utils
        .formatEther(response.toBuyer)
        .toString()
    }
    async function checkToken() {
      const formdata = new FormData()
      formdata.append(
        "tokenToCheck",
        ethers.utils.parseUnits(String(tokenToCheck.value), 18).toString(),
      )

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      } as RequestInit

      const request = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          "/api/v0/users/" +
          props.username +
          "/token/sellingrewards",
        requestOptions,
      )
      const { total_eth } = (await request.json()) as {
        total_eth: string;
      }

      amountToBeReceivedForSellingToken.value = ethers.utils
        .formatEther(ethers.BigNumber.from(total_eth))
        .toString()
    }
    function toggleBuyModal() {
      modalIsOpen.value = !modalIsOpen.value
      modalType.value = "buy"
    }
    const {
      debouncedValue: ethDebouncedValue,
      displayValue: ethDisplayValue,
      debounceListener: ethDebouncedListener,
    } = { ...composeDebounced(300, checkEth) }
    function toggleSellModal() {
      modalIsOpen.value = !modalIsOpen.value
      modalType.value = "sell"
    }
    const {
      debouncedValue: tokensDebouncedValue,
      displayValue: tokenDisplayValue,
      debounceListener: tokenDebouncedListener,
    } = { ...composeDebounced(300, checkToken) }
    return {
      amountToBeReceivedFromStakingEth,
      amountToBeReceivedForSellingToken,
      checkEth,
      checkToken,
      ethToCheck,
      tokenToCheck,
      toggleBuyModal,
      modalIsOpen,
      ethers,
      currency,
      formatAddress,
      etherscanAddress,
      routeForRedirect,
      isAuthenticated,
      toggleSellModal,
      modalType,
      tokensDebouncedValue,
      tokenDisplayValue,
      tokenDebouncedListener,
      ethDebouncedValue,
      ethDisplayValue,
      ethDebouncedListener,
      ...composeUserInfo(props.username),
      ...composeTokenInfo(props.username),
      ...creatorTokenInterface(),

    }
  },
})
</script>

<style scoped>
</style>
