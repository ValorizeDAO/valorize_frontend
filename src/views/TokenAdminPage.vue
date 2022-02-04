<template>
  <h1 class="font-black text-4xl px-16 pt-4">Manage Token</h1>
  <div class="max-w-2xl mx-auto mt-24">
    <h2 class="font-black text-3xl">{{ tokenData.name }} ({{ tokenData.symbol }})</h2>
    <div class="font-black text-2xl flex flex-col">
      <div class="row">
        <span class="text-2xl">
          Current Supply: 
        </span>
        <span>{{ c(tokenData.totalSupply) }}</span>
      </div>
      <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
        <span class="text-2xl">Max Supply: </span>
        <span>{{ c(tokenData.maxSupply) }}</span>
      </div>
      <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
        <span class="text-2xl">Next Minting Allowance: </span>
        <span>{{ c(tokenData.nextMintAllowance) }}</span>
      </div>
      <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
        <span class="text-2xl">Next Mint Time: </span>
        <span>{{ tokenData.nextAllowedMint }}</span>
      </div>
      <div class="my-6 flex justify-center text-center" v-if="tokenData.tokenType == 'timed_mint'">
        <button class="btn" @click="mintToken">Mint Now</button>
      </div>
    </div>
    <div class="border-b-2 border-black pb-2 mt-8">
      <div class="flex justify-between">
        <span class="text-2xl font-black">Administrators</span>
        <!-- <button class="btn">Add New Administrators</button> -->
      </div>
      <div class="mt-4">
        <div class="text-xl" v-for="admin in tokenAdmins">{{ admin.address }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, toRefs, defineComponent, onMounted, Ref, reactive } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api"
import currency from "currency.js";
import { ethers, BigNumber } from "ethers";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory"
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory"

export default defineComponent({
  name: "Token Admin",
  setup: () => {
    const route = useRoute();
    const state = reactive({
      tokenData: {
        name: '',
        symbol: '',
        totalSupply: '',
        maxSupply: '',
        chainId: '',
        tokenType: '',
        nextMintAllowance: '',
        nextAllowedMint: '',
        address: ''
      },
      tokenAdmins: [] as string[]
    })
    const { formatEther } = ethers.utils
    onMounted(async () => {
      const { 
        name,
        symbol,
        totalSupply,
        maxSupply,
        chainId,
        tokenType,
        nextMintAllowance,
        nextAllowedMint,
        address
      } = await api.getTokenData(route.params.id)
      state.tokenData.name = name
      state.tokenData.symbol = symbol
      state.tokenData.totalSupply = formatEther(totalSupply)
      state.tokenData.maxSupply = formatEther(maxSupply)
      state.tokenData.chainId = chainId
      state.tokenData.tokenType = tokenType
      state.tokenData.nextMintAllowance = nextMintAllowance
      state.tokenData.nextAllowedMint = new Date(parseInt(nextAllowedMint)*1000).toDateString();
      state.tokenData.address = address
      const response = await api.getTokenAdmins(route.params.id)
      state.tokenAdmins = [...response.administrators]
    })
    function mintToken() {
      const ethereum: any = (window as any).ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new TimedMintTokenFactory(signer);
      const token = tokenContract.attach(state.tokenData.address);
      token.mint(BigNumber.from(state.tokenData.nextMintAllowance).mul(BigNumber.from("1000000000000000000")))
    }
    return {
      ...toRefs(state),
      mintToken,
      c: (value: string) => currency(Number(value), { separator: ",", precision: 0, symbol: "" }).format()
    };
  },
});
</script>

<style scoped lang="postcss">
.row {
  @apply flex justify-between border-b-2 border-black mt-4
}
</style>
