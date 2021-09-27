
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
      id="token-info-actions"
      class="mx-auto flex justify-center h-56 items-center"
    >
      <transition name="fade" mode="out-in">
        <ImageContainer v-if="showImage">
          <img
            class="
              rounded
              border-2 border-black
              h-52
              w-52
              p-6
              bg-purple-100
              mb-6
              text-center
              md:text-left
            "
            :src="
              'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=' +
              tokenInfo.address +
              '&choe=UTF-8'
            "
            alt=""
          />
        </ImageContainer>
        <button
          v-else
          @click.prevent="showImage = true"
          class="btn bg-burple-100 mb-4 w-48"
        >
          Show QR Code
        </button>
      </transition>
    </div>
    <div id="coin-data" v-if="tokenStatus === 'SUCCESS'">
      <div class="flex justify-between flex-wrap">
        <div>
          <h3 class="text-l mr-3">
            <span class="font-black"
              >${{ currency(tokenPrice.toString()) }}</span
            >
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
            <strong class="font-black"
              >${{ currency(usdLockedInContract) }}
            </strong>
            USD Locked in {{ tokenInfo.symbol }}
            <strong class="font-black"
              >({{ ethers.utils.formatEther(tokenEthBalance) }} ETH)</strong
            >
          </h3>
        </div>
      </div>
      <div class="mt-8 flex flex-col">

        <div class="flex flex-col">
          <span v-if="isAuthenticated">Your Current {{tokenInfo.symbol }} Balance: <strong class="font-black">{{ currency(userTokenBalance) }}</strong></span>
          <span v-else>Sign in to see your balance</span>
          <div class="mt-2 mx-auto">
            <button
              @click="toggleBuyModal"
              class="btn bg-purple-100 my-8 w-42 mr-4"
            >
              Buy {{ tokenInfo.symbol }}
            </button>
            <button @click="toggleSellModal" class="btn bg-purple-100">Sell {{ tokenInfo.symbol }}</button>
          </div>
        </div>
        <Modal
          :modal-is-open="modalIsOpen"
          :body-class="['bg-white', 'border', 'max-w-2xl']"
          @toggle="toggleBuyModal"
        >
          <div class="border-black p-10">
            <div class="flex justify-between w-100" v-if="modalType == 'buy'">
              Ether to Stake:
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
                @input="debounceListener"
                step=".0001"
                type="number"
                class="bg-transparent border-b-2 border-black"
              />
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
            <div class="flex justify-between w-100" v-if="modalType == 'sell'">
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
                @input="debounceListener"
                step=".0001"
                type="number"
                class="bg-transparent border-b-2 border-black"
              />
              <button @click="tokenToSell += 0.01">
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
                Calculate Price for {{ tokenInfo.symbol }}
              </button>
              <div>
                Amount of ETH to be received for
                {{ tokenToCheck }} {{ tokenInfo.symbol }} <br /><strong>{{
                  amountToBeReceivedFromSellingToken
                }}</strong>
                {{ amountToBeReceivedFromSellingToken && 'ETH' }}
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
              <transition name="fade" mode="out-in">
                <div v-if="metamaskStatus === 'INIT'"></div>
                <div v-else-if="metamaskStatus === 'REQUESTED'">
                  please enable metamask or a web3 provider
                </div>
                <div v-else-if="metamaskStatus === 'TIMEOUT'">timeout</div>
                <div v-else-if="metamaskStatus === 'SUCCESSFULLY_ENABLED'">
                  enabled
                </div>
                <div v-else-if="metamaskStatus === 'UNAVAILABLE'">
                  To buy tokens, please enable a web3 provider such as
                  <a href="https://metamask.io/" class="font-black underline"
                    >Metamask</a
                  >
                </div>
                <div v-else-if="metamaskStatus === 'TX_REQUESTED'">
                  Please confirm details in a web3 provider like Metamask
                </div>
                <div v-else-if="metamaskStatus === 'TX_SUCCESS'">
                  You just bought {{ amountToBeReceivedFromStakingEth }}
                  {{ tokenInfo.symbol }}<br />
                  See the transaction here:
                  <a
                    class="font-black underline text-center text-lg"
                    :href="etherscanAddress + '/tx/' + buyTxHash"
                    target="_blank"
                  >
                    {{ formatAddress(buyTxHash) }}
                  </a><br>
                  <router-link v-if="!isAuthenticated" class="my-3 font-black underline text-center text-lg" :to="'/login?redirectUri='+ routeForRedirect + '&registerAddress=' + buyingAddress">Link your new tokens to valorize</router-link>
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
import { ref, defineComponent, onMounted } from "vue";
import composeTokenInfo from "../composed/tokenInfo";
import composeUserInfo from "../composed/userInfo";
import composeDebounced from "../composed/useDebounced";
import creatorTokenInterface from "../composed/creatorTokenInterface";
import { formatAddress } from "../services/formatAddress";
import ImageContainer from "./ImageContainer.vue";
import Modal from "./Modal.vue";
import { ethers } from "ethers";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import currency from "currency.js";

export default defineComponent({
  name: "TokenInfoComponent",
  props: ["username"],
  components: { ImageContainer, Modal },
  setup: (props) => {
    const router = useRouter();
    const store = useStore();
    const amountToBeReceivedFromStakingEth = ref<string>("");
    const ethToCheck = ref<number>(0);
    const tokenToCheck = ref<number>(0);
    const modalIsOpen = ref<boolean>(false);
    const etherscanAddress = import.meta.env.VITE_ETHERSCAN_ADDRESS_MAINNET;
    const routeForRedirect = encodeURI(router.currentRoute.value.fullPath)
    const isAuthenticated = store.getters["authUser/authenticated"]
    const modalType = ref<string>("");
    async function checkEth() {
      const formdata = new FormData();
      formdata.append(
        "etherToCheck",
        String(Math.floor(ethToCheck.value * Math.pow(10, 18)))
      );

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      } as RequestInit;

      const request = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          "/api/v0/users/" +
          props.username +
          "/token/stakingrewards",
        requestOptions
      );
      const response = (await request.json()) as {
        toBuyer: string;
        toOwner: string;
      };
      amountToBeReceivedFromStakingEth.value = ethers.utils
        .formatEther(response.toBuyer)
        .toString();
    }
    async function checkToken() {
      const formdata = new FormData();
      formdata.append(
        "etherToCheck",
        String(Math.floor(ethToCheck.value * Math.pow(10, 18)))
      );

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      } as RequestInit;

      const request = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          "/api/v0/users/" +
          props.username +
          "/token/sellingrewards",
        requestOptions
      );
      const response = (await request.json()) as {
        return: string;
      };
      amountToBeReceivedFromStakingEth.value = ethers.utils
        .formatEther(response.toBuyer)
        .toString();
    }
    function toggleBuyModal() {
      modalIsOpen.value = !modalIsOpen.value;
      modalType.value = "buy";
    }
    function toggleSellModal() {
      modalIsOpen.value = !modalIsOpen.value;
      modalType.value = "sell";
    }
    return {
      amountToBeReceivedFromStakingEth,
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
      ...composeUserInfo(props.username),
      ...composeTokenInfo(props.username),
      ...creatorTokenInterface(),
      ...composeDebounced(300, checkEth),
    };
  },
});

</script>

<style scoped>
</style>
