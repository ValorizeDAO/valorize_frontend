<template>
  <div>
    {{ claimStatus }}
    <div class="mx-auto w-[28rem]">
      <div class="h-40 mt-12 flex flex-col justify-between">
        <div class="opacity-0"></div>
        <transition name="fade" mode="out-in">
          <div v-if="['INIT', 'CHECKING_VALIDITY'].includes(claimStatus)">
            <label for="address-input">
              <h2
                class="font-black text-2xl max-w-md"
              >Check if your address is available for claiming this airdrop</h2>
            </label>
            <div :class="claimStatus === 'CHECKING_VALIDITY' || 'opacity-0'" class=" font-black transition duration-100">Checking . . .</div>
          </div>
          <div v-else-if="claimStatus === 'CLAIM_AVAILABLE'" class="text-center">
            <span class="font-bold">{{ formatAddress(address) }}</span>
            has {{ c(toDecimals(claimAmount)) }} {{ tokenData.symbol }} tokens available to claim!
            <div class="text-center">
              <button class="btn mt-4" id="send-claim" @click="sendClaim">Claim Now</button>
            </div>
          </div>

        <div v-else-if="claimStatus === 'METAMASK_REQUESTED'" class="h-20 w-[28rem] mx-auto mt-8 text-center">
          <h2
            class="font-black text-xl max-w-md"
            v-if="claimStatus === 'METAMASK_REQUESTED'"
          >Please confirm your transaction on a web3 provider like Metamask</h2>
        </div>
          <div
            v-else-if="claimStatus === 'ADDRESS_MISMATCH'"
            id="transaction-addressMismatch"
            class="mx-auto"
          >
            Address mismatch! you are currently connected to
            <span
              class="font-black"
            >{{ formatAddress(userAddress) }}</span>,
            <br />and cannot claim tokens allocated to
            <br />
            <span class="font-black">{{ address }}</span>.<br>
            <br>
            <h2 class="text-xl font-black">
              Search a different address?
            </h2>
          </div>
        </transition>
        <div
          class="mt-8 flex flex-wrap justify-between"
          :class="!['INIT', 'ADDRESS_MISMATCH', 'CLAIM_UNAVAILABLE'].includes(claimStatus) ? 'opacity-50' : ''"
        >
          <input
            class="bg-purple-100 border-b-2 border-black px-2 flex-grow"
            type="text"
            v-model="address"
            id="address-input"
          />
          <button class="btn" @click="getAirdropClaimAmount" id="submit-button">search</button>
        </div>
        <div
          v-if="claimStatus === 'CLAIM_UNAVAILABLE'"
          id="search-error"
          class="mx-auto mt-4 text-red-900 text-center font-black"
        >
        * Address is not avaliable for this airdrop
        </div>
      </div>
      <div
        v-if="['METAMASK_REQUESTED', 'TX_PENDING', 'TX_SUCCESS', 'ERROR'].includes(claimStatus)"
        id="claim-section"
      >
        <transition name="fade">
          <div id="transaction-executing" v-if="claimStatus === 'TX_PENDING'">Confirming Transaction</div>
          <div id="transaction-error" v-else-if="claimStatus === 'ERROR'">{{ errorMessage }}</div>
          <div id="transaction-success" v-else-if="claimStatus === 'TX_SUCCESS'">
            SUCCESS!
            <router-link
              :to="{ path: '/register', query: { registerAddress: userAddress, redirectUri: currentRoute } }"
            >Register this address to your Valorize Profile and get notified of new airdrops!</router-link>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { emptyToken } from "../models/Token"
import api from "../services/api"
import { getProviderAndSigner } from "../services/getProviderInfo"
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory"
import { Signer } from "ethers/lib/ethers"
import { BigNumber, utils } from "ethers"
import currency from "currency.js"
import { formatAddress } from "../services/formatAddress"

export default defineComponent({
  name: "AirdropClaimPage",
  setup() {
    const route = useRoute()
    const address = ref("")
    const statuses = [
      "INIT",
      "CHECKING_VALIDITY",
      "CLAIM_AVAILABLE",
      "CLAIM_UNAVAILABLE",
      "METAMASK_REQUESTED",
      "METAMASK_UNAVAILABLE",
      "TX_PENDING",
      "TX_SENT",
      "TX_SUCCESS",
      "ADDRESS_MISMATCH",
      "ERROR"
    ]
    const claimStatus = ref(statuses[0])
    const claimAmount = ref("")
    const tokenData = ref(emptyToken)
    const merkleProof: Ref<string[]> = ref([])
    const errorMessage = ref("")
    const userAddress = ref("")
    const currentRoute = ref("")
    const addressMismatch = ref(false)
    const tokenId = computed(() => {
      if (route.params.tokenId) {
        return typeof route.params.tokenId === "object"
          ? route.params.tokenId[0]
          : route.params.tokenId
      }
    })
    async function getAirdropClaimAmount() {
      claimStatus.value = statuses[1]
      if (!tokenId.value) return
      const airdropRequest = await api.getAirdropClaim(tokenId.value, address.value)
      if (airdropRequest.status === 404) {
        claimStatus.value = statuses[3]
      } else {
        const airdropData = await airdropRequest.json()
        claimAmount.value = airdropData.claim
        merkleProof.value = airdropData.merkleProof
        claimStatus.value = statuses[2]
      }
    }
    onMounted(async () => {
      if (tokenId.value) {
        tokenData.value = await api.getTokenData(parseInt(tokenId.value))
      }
      else {
        claimStatus.value = statuses.at(-1) as string
      }
      currentRoute.value = route.fullPath
    })
    async function sendClaim() {
      claimStatus.value = statuses[4] // METAMASK_REQUESTED
      const { signer, accounts, error } = await getProviderAndSigner()
      userAddress.value = await signer?.getAddress() as string
      if (error) {
        claimStatus.value = statuses[5] // METAMASK_UNAVAILABLE
        return
      }
      if (userAddress.value !== address.value) {
        claimStatus.value = statuses[9] as string // ADDRESS_MISMATCH
        addressMismatch.value = true
        addEventListenerToAddressInput()
        return
      }
      const token = new SimpleTokenFactory(signer as Signer)
        .attach(tokenData.value.address)
      try {
        claimStatus.value = statuses[6] // TX_PENDING
        const tx = await token.claimTokens(BigNumber.from(claimAmount.value), merkleProof.value)
        claimStatus.value = statuses[7] // TX_SENT
        const receipt = await tx.wait()
        claimStatus.value = statuses[8] // TX_SUCCESS
      } catch (err: any) {
        claimStatus.value = statuses.at(-1) as string // ERROR
        console.error(err)
        errorMessage.value = "There was an error claiming your tokens. Please try again later."
      }
    }
    function addEventListenerToAddressInput() {
      (window as any).ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (claimStatus.value === 'ADDRESS_MISMATCH' && accounts.length > 0) {
            return accounts[0] === address.value && sendClaim()
          }
      })
    }
    return {
      address,
      claimStatus,
      claimAmount,
      merkleProof,
      errorMessage,
      userAddress,
      currentRoute,
      tokenData,
      getAirdropClaimAmount,
      sendClaim,
      formatAddress,
      toDecimals: (value: string) => utils.formatEther(value).toString(),
      c: (value: string | number) =>
        currency(Number(value), {
          separator: ",",
          symbol: "",
          precision: 2,
        }).format(),
    }
  },
})
</script>