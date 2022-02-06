<template>
  <div v-if="status == 'LOADED'">
    <h1 class="font-black text-4xl px-16 pt-4">Manage Token</h1>
    <div class="max-w-2xl mx-auto mt-24">
      <div class="flex justify-between flex-wrap items-center">
        <h2 class="font-black text-3xl">
          {{ tokenData.name }} ({{ tokenData.symbol }})
        </h2>
        <a :href="blockExplorerUrl" class="btn flex" target="_blank"
          >See on Blockexplorer
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
      <div class="font-black text-2xl flex flex-col mt-8">
        <div class="row">
          <span class="text-2xl"> Current Supply: </span>
          <span>{{ c(tokenData.totalSupply) }}</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Max Supply: </span>
          <span v-if="maxSupplySet">{{ c(formatEther(tokenData.maxSupply)) }}</span>
          <span v-else>Unlimited</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Next Minting Allowance: </span>
          <span>{{ c(formatEther(tokenData.nextMintAllowance)) }}</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Next Mint Time: </span>
          <span>{{ tokenData.nextAllowedMint }}</span>
        </div>
        <div
          class="row items-center"
          v-if="tokenData.tokenType == 'timed_mint'"
        >
          <span class="text-2xl">Minter</span>
          <span v-if="hasSetMinter">{{ formatAddress(tokenData.minter) }}</span>
          <span v-else class="font-normal">None Set</span>
        </div>
        <div
          class="my-6 flex flex-col justify-center text-center"
          v-if="tokenData.tokenType == 'timed_mint'"
        >
          <div>
            <button v-if="hasSetMinter" class="btn mx-auto" 
              :class="canMintNow ? '' : 'invalid'"  
              @click="mintToken"
            >
              Mint Now
            </button>
            <button
              v-if="!hasSetMinter && !settingMinter"
              class="btn mx-auto"
              @click="settingMinter = true"
            >
              Set Minter
            </button>
          </div>
          <div v-if="settingMinter">
            <div class="row">
              <label
                class="pl-8 text-sm font-normal"
                for="minter-address-to-set"
                >Minter Address</label
              ><br />
              <input
                class="bg-transparent text-sm font-normal w-[32em]"
                type="text"
                id="minter-address-to-set"
                v-model="minterAddressToSet"
              />
            </div>
            <div>
              <button class="btn mt-4" @click="setMinter">Set Minter</button>
            </div>
          </div>
          <div
            class="
              my-6
              text-base
              font-medium
              justify-centerflex justify-center
              text-center
            "
            v-if="mintingError.length"
          >
            {{ mintingError }}
          </div>
        </div>
      </div>
      <div class="border-b-2 border-black pb-2 mt-8">
        <div class="flex justify-between">
          <span class="text-2xl font-black">Administrators</span>
          <!-- <button class="btn">Add New Administrators</button> -->
        </div>
        <div class="mt-4">
          <div class="text-xl" v-for="admin in tokenAdmins">
            {{ admin.address }}
          </div>
        </div>
      </div>
    </div>
          <div class="mx-auto flex-col mt-24 max-w-2xl">
        <div class="flex flex-wrap justify-between">
          <span>Deployed To:</span>
          <span>{{ networkName }}</span>
        </div>
        <div class="flex flex-wrap justify-between">
          <span>Contract Version:</span>
          <span>{{ tokenData.contractVersion }}</span>
        </div>
      </div>
  </div>
  <div class="mx-auto my-48 text-center" v-else>Loading Data</div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  toRefs,
  defineComponent,
  onMounted,
  Ref,
  reactive,
} from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import { networkInfo } from "../services/network";
import currency from "currency.js";
import { ethers, BigNumber } from "ethers";
import { formatAddress } from "../services/formatAddress";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory";
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory";

export default defineComponent({
  name: "Token Admin",
  setup: () => {
    const route = useRoute();
    const state = reactive({
      tokenData: {
        name: "",
        symbol: "",
        totalSupply: "",
        maxSupply: "",
        chainId: "",
        tokenType: "",
        nextMintAllowance: "",
        nextAllowedMint: "",
        minter: "",
        address: "",
        contractVersion: ""
      },
      tokenAdmins: [] as string[],
    });
    const statuses = ["INIT", "LOADING", "LOADED", "ERROR"];
    const status = ref(statuses[0]);
    const mintingError = ref("");
    const settingMinter = ref(false);
    const canMintNow = ref(false)
    const minterAddressToSet = ref(
      "0x0000000000000000000000000000000000000000"
    );
    const blockExplorerUrl = ref("");
    const networkName = computed(() => {
      return networkInfo[state.tokenData.chainId].name
    })
    const hasSetMinter = computed(() => {
      return (
        state.tokenData.minter != "0x0000000000000000000000000000000000000000"
      );
    });
    const adminRole =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    // If token is set to not have a max supply cap, the maxsupply returns to this constant (2**256 - 1)
    const maxSupplyConstant = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    const maxSupplySet = computed(() => {
      return state.tokenData.maxSupply === formatEther(maxSupplyConstant)
    })
    const { formatEther } = ethers.utils;
    onMounted(async () => {
      status.value = statuses[1];
      const {
        name,
        symbol,
        totalSupply,
        maxSupply,
        chainId,
        tokenType,
        nextMintAllowance,
        nextAllowedMint,
        address,
        minter,
        contractVersion
      } = await api.getTokenData(route.params.id);
      const nextAllowedMintDateObject = new Date(
        parseInt(nextAllowedMint) * 1000
      );
      const now = new Date()
      let nextAllowedMintTimeDisplay;
      if (
        nextAllowedMintDateObject.toDateString() == now.toDateString()
      ){
        nextAllowedMintTimeDisplay =  "Today at " + nextAllowedMintDateObject.toLocaleTimeString();
        if (nextAllowedMintDateObject < now) {
          canMintNow.value = true
        }
      } else {
        if (nextAllowedMintDateObject < now) {
          nextAllowedMintTimeDisplay = "Can Mint Now"
        } else {
          nextAllowedMintTimeDisplay = nextAllowedMintDateObject.toDateString()
        }
      } 
      state.tokenData.name = name;
      state.tokenData.symbol = symbol;
      state.tokenData.totalSupply = formatEther(totalSupply);
      state.tokenData.maxSupply = maxSupply;
      state.tokenData.chainId = chainId;
      state.tokenData.tokenType = tokenType;
      state.tokenData.nextMintAllowance = nextMintAllowance;
      state.tokenData.nextAllowedMint = nextAllowedMintTimeDisplay;
      state.tokenData.address = address;
      state.tokenData.minter = minter;
      state.tokenData.contractVersion = contractVersion;
      const response = await api.getTokenAdmins(route.params.id);
      state.tokenAdmins = [...response.administrators];
      status.value = statuses[2];
      blockExplorerUrl.value =
        networkInfo[chainId].blockExplorer + "address/" + address;
    });

    async function mintToken() {
      const token = getTMToken();
      try {
        await token.mint(
          BigNumber.from(state.tokenData.nextMintAllowance)
        );
        state.tokenData.totalSupply = await token.totalSupply().toString();
      } catch (err: any) {
        if(err.error?.message) {
          mintingError.value = "Error: " + err.error.message;
        } else {
          mintingError.value = err
        }
      }
    }
    function getTMToken() {
      const ethereum: any = (window as any).ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new TimedMintTokenFactory(signer);
      return tokenContract.attach(state.tokenData.address);
    }
    async function setMinter() {
      const token = getToken();
      try {
        await token.setMinter(minterAddressToSet.value);
        state.tokenData.minter = await token.minter();
        mintingError.value = "";
      } catch (err: any) {
        if (err.error?.message.includes(adminRole)) {
          mintingError.value = "Only admin address can set minter";
        } else {
          mintingError.value = err.error.message;
        }
      }
    }
    return {
      ...toRefs(state),
      mintToken,
      setMinter,
      status,
      mintingError,
      hasSetMinter,
      minterAddressToSet,
      settingMinter,
      blockExplorerUrl,
      canMintNow,
      networkName,
      maxSupplySet,
      formatAddress,
      formatEther,
      c: (value: string) =>
        currency(Number(value), {
          separator: ",",
          precision: 0,
          symbol: "",
        }).format(),
    };
  },
});
</script>

<style scoped lang="postcss">
.row {
  @apply flex flex-wrap justify-between border-b-2 border-black mt-4;
}
</style>
