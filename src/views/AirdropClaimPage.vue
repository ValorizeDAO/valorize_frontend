<template>
  <div class="flex justify-center items-middle">
    <transition name="fade" mode="out-in">
      <div v-if="['INIT', 'CLAIM_UNAVAILABLE', 'CHECKING_VALIDITY'].includes(claimStatus)">
        <input
          type="text"
          v-model="address"
          id="address-input"
        >
        <button
          class="btn"
          @click="getAirdropClaimAmount"
          id="submit-button"
        >
          search
        </button>
        <div
          v-if="claimStatus === 'CLAIM_UNAVAILABLE'"
          id="search-error"
        >
          This address is not avaliable for an airdrop
        </div>
      </div>
      <div v-else-if="['CLAIM_AVAILABLE', 'TX_PENDING', 'TX_SUCCESS', 'ERROR'].includes(claimStatus)" id="claim-section">
        You have {{ claimAmount }} tokens available!
        <button class="btn" id="send-claim" @click="sendClaim">Claim Tokens</button>
        <transition name="fade">
          <div id="transaction-executing" v-if="claimStatus==='TX_PENDING'">Confirming Transaction</div>
          <div id="transaction-error" v-else-if="claimStatus==='ERROR'">{{ errorMessage }}</div>
          <div id="transaction-success" v-else-if="claimStatus==='TX_SUCCESS'">SUCCESS!</div>
        </transition>
      </div>
    </transition>
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
import { BigNumber } from "ethers"

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
      "TX_SUCCESS",
      "ERROR"
    ]
    const claimStatus = ref(statuses[0])
    const claimAmount = ref("")
    const tokenData = ref(emptyToken)
    const merkleProof: Ref<string[]> = ref([])
    const errorMessage = ref("")
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
        claimStatus.value = statuses[2]
        const airdropData = await airdropRequest.json()
        claimAmount.value = airdropData.claim
        merkleProof.value = airdropData.merkleProof
      }
    }
    onMounted(async () => {
      if (tokenId.value) {
        tokenData.value = await api.getTokenData(parseInt(tokenId.value))
      }
      else {
        claimStatus.value = statuses.at(-1) as string
      }
    })
    async function sendClaim() {
      claimStatus.value = statuses[4] // METAMASK_REQUESTED
      const { signer, error } = await getProviderAndSigner()
      if (error) {
        claimStatus.value = statuses[5] // METAMASK_UNAVAILABLE
        return
      }
      const token = new SimpleTokenFactory(signer as Signer)
        .attach(tokenData.value.address)
      try {
        claimStatus.value = statuses[6] // TX_PENDING
        await token.claimTokens(BigNumber.from(claimAmount.value), merkleProof.value)
        claimStatus.value = statuses[7] // TX_SUCCESS
      } catch (err: any) {
        claimStatus.value = statuses.at(-1) as string // ERROR
        console.log(err)
      }
    }
    return {
      address,
      claimStatus,
      claimAmount,
      merkleProof,
      errorMessage,
      getAirdropClaimAmount,
      sendClaim
    }
  },
})
</script>
