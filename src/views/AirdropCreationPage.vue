<template>
  <div class="px-16 pt-8 font-black">
    {{ c(contractTokenBalance) }} ({{ tokenData.symbol }}) Available for Airdrop
    <div class="text-center my-8"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "Token Success",
});
</script>

<script setup lang="ts">
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory";
import currency from "currency.js";
import { ethers } from "ethers";
import type { SimpleToken } from "../contracts/SimpleToken";
const props = defineProps<{
  state: any;
}>();

const { state } = props;
const { tokenData, tokenAdmins } = state;
const contractTokenBalance = ref("");
const token = ref<SimpleToken | null>(null);
const ethereum: any = (window as any).ethereum;
const { formatEther } = ethers.utils;

onMounted(async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  token.value = new SimpleTokenFactory(signer).attach(tokenData.address);
  const balance = await token.value.balanceOf(tokenData.address);
  contractTokenBalance.value = formatEther(balance.toString());
});

function c(value: string) {
  return currency(Number(value), {
    separator: ",",
    precision: 0,
    symbol: "",
  }).format();
}
</script>

<style scoped>
</style>
