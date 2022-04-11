
<template>
  <div>
    <div class="px-16 pt-4 flex border-b-4 border-black bg-purple-200">
      <router-link
        class="border-2 border-black border-b-0 mr-1 bg-purple-100"
        :to="{ name: 'Token Admin' }"
      >
        <div class="px-6 py-2">
          Token Admin
        </div>
      </router-link>
      <router-link
        class="border-2 border-black border-b-0 bg-purple-100"
        :to="{ name: 'Create Airdrop' }"
      >
        <div class="px-6 py-2">
          Create Airdrop
        </div>
      </router-link>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition
        :name="route.meta.transition || 'fade'"
        mode="out-in"
      >
        <div v-if="status === 'LOADED'">
          <keep-alive>
            <component
              :is="Component"
              :state="state"
            />
          </keep-alive>
        </div>
        <div v-else>
          Loading
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, onMounted } from "vue"
import { useRoute } from "vue-router"
import api from "../services/api"
export default defineComponent({
  name: "TokenDashboard",
  setup: () => {
    const statuses = ["INIT", "LOADING", "LOADED", "ERROR"]
    const status = ref(statuses[0])
    const route = useRoute()
    const state = reactive({
      tokenData: {
        id: 0,
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
        contractVersion: "",
        airdropSupply: "",
        airdrop: {
          claimPeriodEnds: 0,
          isComplete: false,
          rootHash: "",
          airdropIndex: 0,
        },
      },
      tokenAdmins: [] as Array<{ address: string; user: number }>,
    })
    onMounted(async () => {
      status.value = statuses[1]
      let tokenId
      if (typeof route.params.id === "string") {
        tokenId = parseInt(route.params.id)
      } else {
        tokenId = parseInt(route.params.id[0])
      }
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
        contractVersion,
        airdropSupply,
        airdropInfo,
      } = await api.getTokenData(tokenId)
      state.tokenData = {
        id: tokenId,
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
        contractVersion,
        airdropSupply,
        airdrop: { ...airdropInfo },
      }

      const response = await api.getTokenAdmins(tokenId)
      state.tokenAdmins = [...response.administrators]
      status.value = statuses[2]
    })
    return {
      state,
      status,
    }
  },
})
</script>

<style scoped lang="postcss">
.router-link-exact-active {
  @apply border-b-purple-50 bg-purple-50 border-b font-black pb-1 -mb-1;
}
</style>
