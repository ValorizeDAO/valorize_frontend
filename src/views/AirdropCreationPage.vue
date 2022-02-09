<template>
  <div>
    <div class="px-16 pt-8 font-black">
      {{ c(contractTokenBalance) }} ({{ tokenData.symbol }}) Available for
      Airdrop
    </div>
    <div
      v-if="airdropData.length <= 1"
      id="drop-airdrop-csv"
      class="md:px-16 mt-4"
    >
      <div class="border-black border-4 border-dashed bg-purple-100 mx-auto">
        <div class="h-[20rem] flex flex-col justify-center items-center">
          Add a CSV File
          <button @click="triggerUploadForm" class="btn my-4">Upload</button>
          <input accept=".csv" type="file" ref="uploadButton" class="sr-only" />
        </div>
      </div>
    </div>
    <div v-else class="md:mx-16 mt-4 w-100">
      <div class="max-w-2xl mx-auto mb-8 bg-paper-lighter">
        <div
          class="
            text-2xl
            bg-paper-default
            border-b-2 border-x-paper-dark
            font-black
            px-4
            py-2
            flex
            justify-between
          "
        >
          <h2>address</h2>
          <h2>airdrop amount</h2>
        </div>
        <div class="max-h-[60vh] overflow-y-auto bg-paper-light">
          <div
            v-for="(data, index) in airdropData"
            :key="index"
            class="py-2 px-4 flex justify-between border-b-2 border-paper-dark"
          >
            <p class="mr-6">{{ data[0] }}</p>
            <p>{{ c(data[1]) }}</p>
          </div>
        </div>
        <div
          class="
            text-2xl
            bg-paper-default
            border-b-2 border-x-paper-dark
            font-black
            px-4
            py-2
            flex
            justify-between
          "
        >
          <h2>Total to Airdrop</h2>
          <h2>
            {{ c(totalAirdropAmount) }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
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

const uploadButton = ref<HTMLInputElement | null>(null);
const { state } = props;
const { tokenData, tokenAdmins } = state;
const contractTokenBalance = ref("");
const token = ref<SimpleToken | null>(null);
const ethereum: any = (window as any).ethereum;
const { formatEther } = ethers.utils;
const csvDump = ref("");
const airdropData = computed(() => {
  const csvSplit = csvDump.value.split("\r\n");
  const airdropTuple = csvSplit.map((item) => {
    return item.split(",");
  });
  return airdropTuple;
});
const totalAirdropAmount = computed(() => {
  const csvSplit = csvDump.value.split("\r\n");
  const amountsOnly = csvSplit.map((item, index) => {
    return item.split(",")[1];
  });
  return amountsOnly.reduce((partialSum, a) => partialSum + parseInt(a), 0);
});
onMounted(async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  token.value = new SimpleTokenFactory(signer).attach(tokenData.address);
  const balance = await token.value.balanceOf(tokenData.address);
  contractTokenBalance.value = formatEther(balance.toString());
});
function triggerUploadForm() {
  if (uploadButton.value) {
    uploadButton.value.click();
    uploadButton.value.addEventListener("change", (e) => {
      var fr = new FileReader();
      fr.onload = function () {
        csvDump.value = fr.result;
      };
      fr.readAsText(e.target?.files[0]);
    });
  }
}
function upload(e: Event) {
  console.log(e);
  const inputElement = e.target as HTMLInputElement;
  const files = inputElement.files;

  const fileReader = new FileReader();
  fileReader.addEventListener("load", (e) => {
    console.log(e.target.files);
  });
}

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
