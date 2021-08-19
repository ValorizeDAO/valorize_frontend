
<template>
  <div v-if="tokenInfo">
    <h2 class="font-black text-2xl">
      {{tokenInfo.name}} ({{tokenInfo.symbol}})
    </h2>
    <p class="my-4">
      Address: {{tokenInfo.address}}
    </p>
    <div id="token-info-actions" class="mx-auto flex justify-center h-56 items-center">

      <transition name="fade" mode="out-in">
        <ImageContainer v-if="showImage">
          <img class="rounded border-2 border-black h-52 w-52 p-6 bg-purple-100 mb-6 text-center md:text-left" :src="'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl='+tokenInfo.address+'&choe=UTF-8'" alt="">
        </ImageContainer>
        <button v-else @click.prevent="showImage=true" class="btn bg-burple-100 mb-4 w-48">Show QR Code</button>
      </transition>
    </div>
    <div id="coin-data" v-if="tokenStatus === 'SUCCESS'">
      <div class="flex justify-between flex-wrap">
        <div><h3 class="text-xl font-black">Price Per Coin: {{ tokenPrice }} </h3></div>
        <div><h3 class="text-xl font-black">Total Supply: {{ tokenCap }} </h3></div>
        <div><h3 class="text-xl font-black">USD locked in <strong>{{tokenInfo.symbol}}</strong>: $ {{ tokenEthBalance * ethPrice }}</h3></div>
      </div>
      <div class="mt-8 flex flex-col">
        <div class="flex justify-between w-100">
         Ether to Stake:
          <button @click="ethToCheck -= .00001">-</button>
          <input v-model="ethToCheck" @input="debounceListener" step=".00001" type="number" class="bg-transparent border-b-2 border-black">
          <button @click="ethToCheck += .00001">+</button>
        </div>
        <button @click="checkEth(ethToCheck)" class="btn bg-purple-100 my-8">Calculate {{ tokenInfo.symbol }} Price</button>
        <div>
          Amount of {{ tokenInfo.symbol }} to be received for {{ debouncedValue }} Eth
          <br><strong>{{ amountToBeReceivedFromStakingEth }}</strong> {{ amountToBeReceivedFromStakingEth === '' ? '' : tokenInfo.symbol }}
        </div>
      </div>
    </div>
      <div v-else-if="tokenStatus === 'FAIL'">
        <h3 class="text-xl font-black">Token is not deployed yet. If you just deployed it, check the address on
          EtherScan</h3>
      </div>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, Ref} from "vue";
import composeTokenInfo from "../composed/tokenInfo"
import composeUserInfo from "../composed/userInfo"
import composeDebounced from "../composed/useDebounced"
import ImageContainer from "./ImageContainer.vue";
export default defineComponent({
  name: "TokenInfoComponent",
  props: ["username"],
  components: { ImageContainer },
  setup: (props) => {
    const amountToBeReceivedFromStakingEth = ref<string>("")
    async function checkEth(ethToCheck: Ref<string>) {
      const formdata = new FormData();
      formdata.append("etherToCheck", (parseFloat(ethToCheck.value) * Math.pow(10, 18)).toString());

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      } as RequestInit

      const request = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/v0/users/" + props.username + "/token/stakingrewards", requestOptions)
      const response = await request.json() as { toBuyer: string, toOwner: string }
      amountToBeReceivedFromStakingEth.value = response.toBuyer
    }
    return {
      amountToBeReceivedFromStakingEth,
      checkEth,
      ...composeTokenInfo(props.username),
      ...composeUserInfo(props.username),
      ...composeDebounced(300, checkEth)
    }
  },
});
</script>

<style scoped>
</style>
