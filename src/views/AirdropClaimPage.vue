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
        <button class="btn" id="send-claim">Claim Tokens</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import api from "../services/api"

export default defineComponent({
  name: "AirdropClaimPage",
  setup() {
    const route = useRoute()
    const address = ref("")
    const statuses = ["INIT", "CHECKING_VALIDITY", "CLAIM_AVAILABLE", "CLAIM_UNAVAILABLE"]
    const claimStatus = ref(statuses[0])
    const claimAmount = ref("")
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
        if (airdropRequest.status === 404) {
          claimStatus.value = statuses[3]
        } else {
          claimStatus.value = statuses[2]
          const airdropData = await airdropRequest.json()
          claimAmount.value = airdropData.claim
          merkleProof.value = airdropData.merkleProof
        }
      }
    return {
      address,
      claimStatus,
      claimAmount,
      merkleProof,
      getAirdropClaimAmount
    }
  },
})
</script>
