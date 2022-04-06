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
      <div v-else-if="claimStatus === 'CLAIM_AVAILABLE'" id="claim-section">
        You have {{ claimAmount }} tokens available!
        <button class="btn" id="send-claim" @click="sendClaim">Claim Tokens</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { emptyToken } from "../models/Token"
import api from "../services/api"
import { getProviderAndSigner } from "../services/getMetamaskInfo"
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
      "ERROR"
    ]
    const claimStatus = ref(statuses[0])
    const claimAmount = ref("")
    const tokenData = ref(emptyToken)
    const merkleProof: Ref<string[]> = ref([])
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
      console.log({ airdropRequest })
      if (airdropRequest.status === 404) {
        claimStatus.value = statuses[3]
      } else {
        claimStatus.value = statuses[2]
        const airdropData = await airdropRequest.json()
        claimAmount.value = airdropData.claim
        merkleProof.value = airdropData.merkleProof
        console.log({ airdropData })
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
        token.claimTokens(BigNumber.from(claimAmount.value), merkleProof.value)
      } catch (err: any) {
        claimStatus.value = statuses[6] // ERROR
        console.log(err)
      }
    }
    return {
      address,
      claimStatus,
      claimAmount,
      merkleProof,
      getAirdropClaimAmount,
      sendClaim
    }
  },
})
</script>
