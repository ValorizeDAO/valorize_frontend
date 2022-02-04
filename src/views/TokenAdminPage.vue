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
import { ethers } from "ethers";

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
        nextAllowedMint: ''
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
        nextAllowedMint
      } = await api.getTokenData(route.params.id)
      state.tokenData.name = name
      state.tokenData.symbol = symbol
      state.tokenData.totalSupply = formatEther(totalSupply)
      state.tokenData.maxSupply = formatEther(maxSupply)
      state.tokenData.chainId = chainId
      state.tokenData.tokenType = tokenType
      state.tokenData.nextMintAllowance = nextMintAllowance
      state.tokenData.nextAllowedMint = new Date(parseInt(nextAllowedMint)*1000).toDateString();
      const response = await api.getTokenAdmins(route.params.id)
      state.tokenAdmins = [...response.administrators]
    })
    return {
      ...toRefs(state),
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
