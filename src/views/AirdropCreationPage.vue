<template>
  <div>
    {{ airdropStatus }}
    <div
      v-if="
        tokenData.airdrop.airdropIndex != -1 && !tokenData.airdrop.isComplete
      "
    >
      <h2 class="font-black text-2xl text-center mt-8">
        {{ tokenData.name }} has an active airdrop
      </h2>
      <div class="font-black text-center mt-4">
        <p>
          Administrators will be able to sweep the unclaimed funds for this
          airdrop on:
        </p>
        <p />
        <div class="mt-2 text-xl">
          {{ new Date(tokenData.airdrop.claimPeriodEnds * 1000).toUTCString() }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="px-16 pt-8 font-black">
        {{ c(formatEther(tokenData.airdropSupply)) }} ({{ tokenData.symbol }})
        Available for Airdrop
      </div>
      <transition name="fade" mode="out-in">
        <div
          v-if="
            airdropStatus == 'INIT' || airdropStatus == 'UPLOADED_CSV_ERROR'
          "
          id="drop-airdrop-csv"
          class="md:px-16 mt-4"
        >
          <transition name="fade">
            <div
              v-if="airdropStatus == 'UPLOADED_CSV_ERROR'"
              class="my-4 text-red-900 font-black text-center"
            >
              <p class="text-lg">We found duplicate addresses in the CSV!</p>
              <p class="text-black">
                This will cause an error, please check your CSV file and upload
                again.
              </p>
            </div>
          </transition>
          <div
            class="border-black border-4 border-dashed bg-purple-100 mx-auto"
          >
            <div class="h-[20rem] flex flex-col justify-center items-center">
              Add a CSV File
              <button @click="triggerUploadForm" class="btn my-4">
                Upload
              </button>
              <input
                accept=".csv"
                type="file"
                ref="uploadButton"
                class="sr-only"
              />
            </div>
          </div>
        </div>
        <div
          v-else-if="
            airdropStatus == 'UPLOADED_CSV' || airdropStatus == 'VERIFIED_CSV'
          "
          class="md:mx-16 mt-4 w-100"
        >
          <h2 class="text-3xl font-black">Please Verify Airdrop Ammounts</h2>
          <div class="max-w-2xl mt-4 mx-auto mb-8 bg-paper-lighter">
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
              <h3>Address</h3>
              <h3>Airdrop amount</h3>
            </div>
            <div class="max-h-[40vh] overflow-y-auto bg-paper-light">
              <div
                v-for="(data, index) in airdropData"
                :key="index"
                class="
                  py-2
                  px-4
                  flex
                  justify-between
                  border-b-2 border-paper-dark
                "
              >
                <p class="mr-6">{{ data[0] }}</p>
                <p>{{ c(formatEther(data[1])) }}</p>
              </div>
            </div>
            <div
              class="
                text-2xl
                bg-paper-default
                border-b-2 border-b-paper-dark
                font-black
                px-4
                py-2
                flex
                justify-between
                border-t-4 border-t-black
              "
            >
              <h2>Total to Airdrop</h2>
              <h2>{{ c(totalAirdropAmount) }} ({{ tokenData.symbol }})</h2>
            </div>
            <div class="flex justify-between px-4 items-center">
              <label class="my-4 font-black" for="airdrop-duration"
                >Airdrop Duration</label
              >
              <div>
                <input
                  type="number"
                  v-model="airdropDuration"
                  class="
                    border-black border-b-2
                    mr-2
                    max-w-[4rem]
                    bg-transparent
                    text-center
                    font-black
                  "
                  id="airdrop-duration"
                />
                <span class="font-black">Days</span>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button class="btn bg-purple-200 my-4" @click="saveAirdropInfo">
              Confirm Data</button
            ><br />
            (Once confirmed, this cannot be changed)
          </div>
          <div class="text-center mt-8">
            Or, <br />
            <button @click="() => (airdropStatus = 'INIT')" class="btn">
              Upload another CSV
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
export default defineComponent({
  name: "Create Airdrop",
});
</script>

<script setup lang="ts">
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory";
import detectEthereumProvider from "@metamask/detect-provider";
import currency from "currency.js";
import { ethers, BigNumber } from "ethers";
import type { SimpleToken } from "../contracts/SimpleToken";
import { MerkleTree } from "merkletreejs";
import { keccak_256 } from "js-sha3";
import api from "../services/api";
import { useRoute } from "vue-router";
import authentication from "../services/authentication";

const props = defineProps<{
  state: any;
}>();

const uploadButton = ref<HTMLInputElement | null>(null);
const route = useRoute();
const { state } = props;
const { tokenData, tokenAdmins } = state;
const contractTokenBalance = ref("");
const token = ref<SimpleToken | null>(null);
const ethereum: any = (window as any).ethereum;
const { formatEther, parseUnits } = ethers.utils;
const csvDump = ref("");
const merkleRoot = ref("");
const airdropDuration = ref(180);
const airdropStatuses = [
  "INIT",
  "UPLOADED_CSV",
  "UPLOADED_CSV_ERROR",
  "VERIFIED_CSV",
  "CONFIRMING_BACKEND",
  "CONFIRMING_BACKEND_ERROR",
  "SENDING_TX",
  "SENDING_TX_ERROR",
  "COMPLETE",
  "ERROR",
];
const airdropStatus = ref(airdropStatuses[0]);
function checkForDuplicateAddresses() {
  const airdropSet = new Set(airdropData.value.map((item) => item[0]));
  if (airdropSet.size !== airdropData.value.length) {
    transitionState(false);
  } else {
    transitionState();
  }
}
function transitionState(success: boolean = true) {
  const from = airdropStatus.value;
  if (success) {
    switch (airdropStatus.value) {
      case "INIT":
        airdropStatus.value = "UPLOADED_CSV";
        checkForDuplicateAddresses();
        break;
      case "UPLOADED_CSV" || "UPLOADED_CSV_ERROR":
        airdropStatus.value = "VERIFIED_CSV";
        break;
      case "VERIFIED_CSV":
        airdropStatus.value = "CONFIRMING_BACKEND";
        break;
      case "CONFIRMING_BACKEND":
        airdropStatus.value = "SENDING_TX";
        break;
      case "SENDING_TX":
        airdropStatus.value = "COMPLETE";
        break;
      default:
        airdropStatus.value = "INIT";
        break;
    }
  } else {
    switch (airdropStatus.value) {
      case "INIT":
        airdropStatus.value = "UPLOADED_CSV_ERROR";
        break;
      case "UPLOADED_CSV":
        airdropStatus.value = "UPLOADED_CSV_ERROR";
        break;
      case "CONFIRMNG_BACKEND":
        airdropStatus.value = "CONFIRMING_BACKEND_ERROR";
        break;
      case "SENDING_TX":
        airdropStatus.value = "SENDING_TX_ERROR";
        break;
      default:
        airdropStatus.value = "ERROR";
        break;
    }
  }
  console.log(
    `FROM: ${from} direction: ${success ? "success" : "error"} TO: ${
      airdropStatus.value
    }`
  );
  return state;
}
const airdropData = computed(() => {
  const csvSplit = csvDump.value.split("\r\n");
  const airdropTuple = csvSplit.map((item) => {
    if (!item) return ["", ""];
    const tuple = item.split(",");
    //We're expecting that user passes decimals
    const amount = tuple[1] ? parseUnits(tuple[1], 18) : "0";
    return [tuple[0] || "", amount.toString()];
  });
  return airdropTuple;
});
const merkleLeaves = computed(() => {
  const leaves = airdropData.value.map((baseNode: string[]) => {
    return ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [baseNode[0], BigNumber.from(baseNode[1])]
    );
  });
  return leaves;
});
function getMerkleRootFromLeaves() {
  const merkleTree = new MerkleTree(merkleLeaves.value, keccak_256, {
    sort: true,
  });
  merkleRoot.value = merkleTree.getHexRoot();
}
const totalAirdropAmount = computed(() => {
  const csvSplit = csvDump.value.split("\r\n");
  const amountsOnly = csvSplit.map((item) => {
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
async function saveAirdropInfo() {
  getMerkleRootFromLeaves();
  const { id } = route.params;
  if (typeof id == "string") {
    const request = await authentication.saveAirdropInfo(id, {
      payload: airdropData.value,
      merkleRoot: merkleRoot.value,
    });
    if (request.status == 200) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenInstance = new SimpleTokenFactory(signer).attach(
        tokenData.address
      );
      try {
        await tokenInstance.newAirdrop(
          merkleRoot.value,
          BigNumber.from(airdropDuration.value).mul(24 * 60)
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Error saving airdrop info");
    }
    console.log({ request });
  }
}
function triggerUploadForm() {
  if (uploadButton.value) {
    uploadButton.value.click();
    uploadButton.value.addEventListener("change", (e: Event) => {
      var fr = new FileReader();
      fr.onload = function () {
        csvDump.value = fr.result as string;
        transitionState();
      };
      try {
        fr.readAsText(e.target?.files[0]);
      } catch (err) {
        console.log(err);
        transitionState(false);
      }
    });
  }
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
