
<template>
  <div v-if="tokenInfo">
    <h2 class="font-black text-2xl">
      {{ tokenInfo.name }} ({{ tokenInfo.symbol }})
    </h2>
    <p class="my-4">
      Address:
      <a
              class="font-black underline text-center text-lg"
              :href="
                'https://ropsten.etherscan.io/address/' + tokenInfo.address
              "
              target="_blank"
            >
              {{ tokenInfo.address &&
                  tokenInfo.address.substr(0, 5) 
                  + "..." + 
                  tokenInfo.address.substr(tokenInfo.address.length - 2, tokenInfo.address.length - 1) }} </a
            >
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
        <!-- <div><h3 class="text-l"><span class="font-black">${{ tokenPrice }}</span> per token</h3></div> -->
        <div>
          <h3 class="text-l">
            <span class="font-black">{{ tokenCap }}</span> in circulation
          </h3>
        </div>
        <div>
          <h3 class="text-l">
            <span class="font-black">${{ tokenEthBalance * ethPrice }}</span>
            USD Locked in {{ tokenInfo.symbol }}
          </h3>
        </div>
      </div>
      <div class="mt-8 flex flex-col">
        <button
          @click="toggleBuyModal"
          class="btn bg-purple-100 my-8 w-42 mx-auto"
        >
          Buy {{ tokenInfo.symbol }}
        </button>
        <Modal
          :modal-is-open="modalIsOpen"
          :body-class="['bg-white', 'border',  'max-w-2xl']"
          @toggle="toggleBuyModal"
        >
          <div class="border-black p-10">
            <div class="flex justify-between w-100">
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
            <div class="text-center">
            <button
              @click="checkEth"
              class="btn bg-purple-100 my-8 w-42 mx-auto"
            >
              Calculate Price for {{ tokenInfo.symbol }}
            </button>
            <div>
              Amount of {{ tokenInfo.symbol }} to be received for
              {{ ethToCheck }} Eth <br /><strong>{{
                  amountToBeReceivedFromStakingEth
              }}</strong>
              {{
                amountToBeReceivedFromStakingEth && tokenInfo.symbol
              }}
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
import { ref, defineComponent } from "vue";
import composeTokenInfo from "../composed/tokenInfo";
import composeUserInfo from "../composed/userInfo";
import composeDebounced from "../composed/useDebounced";
import ImageContainer from "./ImageContainer.vue";
import Modal from "./Modal.vue";
import { BigNumber, ethers } from "ethers";
export default defineComponent({
  name: "TokenInfoComponent",
  props: ["username"],
  components: { ImageContainer, Modal },
  setup: (props) => {
    const amountToBeReceivedFromStakingEth = ref<string>("");
    const ethToCheck = ref<number>(0);
    const modalIsOpen = ref<boolean>(false);
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
      amountToBeReceivedFromStakingEth.value = ethers.utils.formatEther(response.toBuyer).toString();
    }
    function toggleBuyModal() {
      modalIsOpen.value = !modalIsOpen.value;
    }
    return {
      amountToBeReceivedFromStakingEth,
      checkEth,
      ethToCheck,
      toggleBuyModal,
      modalIsOpen,
      ethers,
      ...composeTokenInfo(props.username),
      ...composeUserInfo(props.username),
      ...composeDebounced(300, checkEth),
    };
  },
});
</script>

<style scoped>
</style>
