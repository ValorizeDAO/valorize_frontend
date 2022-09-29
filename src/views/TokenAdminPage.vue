<template>
  <h1 class="font-black text-4xl px-16 pt-4">
    Manage Token
  </h1>
  <div class="max-w-2xl mx-auto mt-24">
    <div class="flex justify-between flex-wrap items-center">
      <h2 class="font-black text-3xl">
        {{ tokenData.name }} ({{ tokenData.symbol }})
      </h2>
      <a
        :href="blockExplorerUrl"
        class="btn flex"
        target="_blank"
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
        <span>{{ c(formatEther(tokenData.totalSupply)) }}</span>
      </div>
      <div
        class="row"
        v-if="tokenData.tokenType === 'timed_mint'"
      >
        <span class="text-2xl">Max Supply: </span>
        <span v-if="!maxSupplySet">{{
          c(formatEther(tokenData.maxSupply))
        }}</span>
        <span v-else>Unlimited</span>
      </div>
      <div
        class="row"
        v-if="tokenData.tokenType === 'timed_mint'"
      >
        <span class="text-2xl">Next Minting Allowance: </span>
        <span>{{ c(formatEther(tokenData.nextMintAllowance)) }}</span>
      </div>
      <div
        class="row"
        v-if="tokenData.tokenType === 'timed_mint'"
      >
        <span class="text-2xl">Next Mint Time: </span>
        <span>{{ mintTimeDisplay }}</span>
      </div>
      <div
        class="row items-center"
        v-if="tokenData.tokenType === 'timed_mint'"
      >
        <span class="text-2xl">Minter:</span>
        <span v-if="hasSetMinter">{{ formatAddress(tokenData.minter) }}</span>
        <span
          v-else
          class="font-normal"
        >None Set</span>
      </div>
      <div
        class="my-6 flex flex-col justify-center text-center"
        v-if="tokenData.tokenType === 'timed_mint'"
      >
        <div>
          <button
            v-if="hasSetMinter"
            class="btn mx-auto"
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
          <transition name="">
            <div v-if="!waitingForMinterSet">
              <div class="flex justify-between items-center">
                <label
                  class="pl-8 text-sm font-normal"
                  for="minter-address-to-set"
                >Set Minter Address:</label><br>
                <input
                  class="
                    bg-transparent
                    text-sm
                    font-normal
                    w-[32em]
                    border-b-2 border-black
                    mr-8
                  "
                  type="text"
                  id="minter-address-to-set"
                  v-model="minterAddressToSet"
                >
              </div>
              <div>
                <button
                  class="btn mt-4"
                  @click="setMinter"
                >
                  Set Minter
                </button>
              </div>
            </div>
            <div v-else>
              <div class="flex justify-center items-center flex-col">
                <div class="spinner mr-4" />
                <span>Setting Minter...</span>
                <svg-loader class="mt-4 h-16 fill-purple-900" />
              </div>
            </div>
          </transition>
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
      <AdminList :admins="tokenAdmins">
        <template #title>
          <span class="text-2xl font-black">Administrators</span>
        </template>
      </AdminList>
    </div>
  </div>
  <div class="mx-auto flex-col mt-24 max-w-2xl">
    <div class="flex flex-wrap justify-between">
      <span>Deployed To:</span>
      <span>{{ networkName }}</span>
    </div>
    <div class="flex flex-wrap justify-between">
      <span>Contract Version:</span>
      <span>{{ tokenData.tokenType }} {{ tokenData.contractVersion }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { networkInfo } from "../services/network"
import currency from "currency.js"
import { ethers, BigNumber } from "ethers"
import { formatAddress } from "../services/formatAddress"
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory"
import AdminList from "../components/AdminList.vue"
import { computed, ref } from "vue"
const props = defineProps<{
  state: any;
}>()
const tokenData = computed(() => props.state.tokenData)
const tokenAdmins = computed(() => props.state.tokenAdmins)
const { formatEther } = ethers.utils
const mintingError = ref("")
const settingMinter = ref(false)
const canMintNow = computed(() => {
  const nextAllowedMintDateObject = new Date(
    parseInt(tokenData.value.nextAllowedMint) * 1000,
  )
  return nextAllowedMintDateObject < new Date()
})
const minterAddressToSet = ref("0x0000000000000000000000000000000000000000")
const waitingForMinterSet = ref(false)
const mintTimeDisplay = computed(() => {
  if (!tokenData.value?.nextAllowedMint) return
  const nextAllowedMintDateObject = new Date(
    parseInt(tokenData.value.nextAllowedMint) * 1000,
  )
  const now = new Date()
  let nextAllowedMintTimeDisplay
  if (nextAllowedMintDateObject.toDateString() === now.toDateString()) {
    nextAllowedMintTimeDisplay =
      "Today at " + nextAllowedMintDateObject.toLocaleTimeString()
  } else {
    if (nextAllowedMintDateObject < now) {
      nextAllowedMintTimeDisplay = "Can Mint Now"
    } else {
      nextAllowedMintTimeDisplay = nextAllowedMintDateObject.toDateString()
    }
  }
  return nextAllowedMintTimeDisplay
})
const blockExplorerUrl = computed(() => {
  return (
    networkInfo[tokenData.value.chainId].blockExplorer +
    "address/" +
    tokenData.value.address
  )
})
const networkName = computed(() => {
  return networkInfo[tokenData.value.chainId].name
})
const hasSetMinter = computed(() => {
  return tokenData.value.minter !== "0x0000000000000000000000000000000000000000"
})
const adminRole =
  "0x0000000000000000000000000000000000000000000000000000000000000000"
// If token is set to not have a max supply cap, the maxsupply returns to this constant (2**256 - 1)
const maxSupplyConstant =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const maxSupplySet = computed(() => {
  return tokenData.value.maxSupply === maxSupplyConstant
})

async function mintToken() {
  const token = await getTMToken()
  if (!token) return
  try {
    const mintTx = await token.mint(BigNumber.from(tokenData.value.nextMintAllowance))
    await mintTx.wait(1)
    tokenData.value.totalSupply = await token.totalSupply().toString()
  } catch (err: any) {
    if (err.error?.message) {
      mintingError.value = "Error: " + err.error.message
    } else {
      mintingError.value = err
    }
  }
}
async function getTMToken() {
  const ethereum: any = (window as any).ethereum
  if (!ethereum) { return }
  await ethereum.request({
    method: "eth_requestAccounts",
  })
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const tokenContract = new TimedMintTokenFactory(signer)
  return tokenContract.attach(tokenData.value.address)
}
async function setMinter() {
  const token = await getTMToken()
  if (!token) return
  try {
    waitingForMinterSet.value = true
    await token.setMinter(minterAddressToSet.value)
    tokenData.value.minter = minterAddressToSet.value
    mintingError.value = ""
  } catch (err: any) {
    if (err.error?.message.includes(adminRole)) {
      mintingError.value = "Only admin address can set minter"
    } else {
      mintingError.value = err.error.message || err.message
    }
  } finally {
    waitingForMinterSet.value = true
    settingMinter.value = false
  }
}

function c(value: string) {
  return currency(Number(value), {
    separator: ",",
    precision: 0,
    symbol: "",
  }).format()
}
</script>

<style scoped lang="postcss">
.row {
  @apply flex flex-wrap justify-between border-b-2 border-black mt-4;
}
</style>
