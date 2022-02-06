<template>
  <div v-if="status=='LOADED'">
    <h1 class="font-black text-4xl px-16 pt-4">Manage Token</h1>
    <div class="max-w-2xl mx-auto mt-24">
      <h2 class="font-black text-3xl">{{ tokenData.name }} ({{ tokenData.symbol }})</h2>
      <div class="font-black text-2xl flex flex-col">
        <div class="row">
          <span class="text-2xl">
            Current Supply: 
          </span>
          <span>{{ c(tokenData.totalSupply) }}</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Max Supply: </span>
          <span>{{ c(tokenData.maxSupply) }}</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Next Minting Allowance: </span>
          <span>{{ c(tokenData.nextMintAllowance) }}</span>
        </div>
        <div class="row" v-if="tokenData.tokenType == 'timed_mint'">
          <span class="text-2xl">Next Mint Time: </span>
          <span>{{ tokenData.nextAllowedMint }}</span>
        </div>
        <div class="row items-center" v-if="tokenData.tokenType == 'timed_mint'">
            <span class="text-2xl">Minter</span>
            <span v-if="hasSetMinter">{{ formatAddress(tokenData.minter) }}</span>
            <span v-else class="font-normal">None Set</span>
        </div>
        <div class="my-6 flex flex-col justify-center text-center" v-if="tokenData.tokenType == 'timed_mint'">
          <div>
            <button v-if="hasSetMinter" class="btn mx-auto" @click="mintToken">Mint Now</button>
            <button v-if="!hasSetMinter && !settingMinter" class="btn mx-auto" @click="settingMinter = true">Set Minter</button>
          </div>
          <div v-if="settingMinter">
            <div class="row">
              <label class="pl-8 text-sm font-normal" for="minter-address-to-set">Minter Address</label><br>
              <input class="bg-transparent text-sm font-normal w-[32em]" type="text" id="minter-address-to-set" v-model="minterAddressToSet">
            </div>
            <div>
              <button class="btn mt-4" @click="setMinter">Set Minter</button>
            </div>
          </div>
          <div class="my-6 text-base font-medium justify-centerflex justify-center text-center" v-if="mintingError.length">
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
          <div class="text-xl" v-for="admin in tokenAdmins">{{ admin.address }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="mx-auto my-48 text-center" v-else>Loading Data</div>
</template>

<script lang="ts">
import { ref, computed, toRefs, defineComponent, onMounted, Ref, reactive } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api"
import currency from "currency.js";
import { ethers, BigNumber } from "ethers";
import { formatAddress } from "../services/formatAddress";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory"
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory"

export default defineComponent({
  name: "Token Admin",
  setup: () => {
    const route = useRoute();
    const state = reactive({
      tokenData: {
        name: '',
        symbol: '',
        totalSupply: '',
        maxSupply: '',
        chainId: '',
        tokenType: '',
        nextMintAllowance: '',
        nextAllowedMint: '',
        minter: '',
        address: ''
      },
      tokenAdmins: [] as string[]
    })
    const statuses = ["INIT", "LOADING", "LOADED", "ERROR"]
    const status = ref(statuses[0])
    const mintingError = ref('')
    const settingMinter = ref(false)
    const minterAddressToSet = ref("0x0000000000000000000000000000000000000000")
    const hasSetMinter = computed(() => {
      console.log(state.tokenData.minter)
      return state.tokenData.minter != "0x0000000000000000000000000000000000000000"
    })
    const adminRole = "0x0000000000000000000000000000000000000000000000000000000000000000"
    const { formatEther } = ethers.utils
    onMounted(async () => {
      status.value = statuses[1]
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
        minter
      } = await api.getTokenData(route.params.id)
      state.tokenData.name = name
      state.tokenData.symbol = symbol
      state.tokenData.totalSupply = formatEther(totalSupply)
      state.tokenData.maxSupply = formatEther(maxSupply)
      state.tokenData.chainId = chainId
      state.tokenData.tokenType = tokenType
      state.tokenData.nextMintAllowance = nextMintAllowance
      state.tokenData.nextAllowedMint = new Date(parseInt(nextAllowedMint)*1000).toDateString();
      state.tokenData.address = address
      state.tokenData.minter = minter
      const response = await api.getTokenAdmins(route.params.id)
      state.tokenAdmins = [...response.administrators]
      status.value = statuses[2]
    })

    async function mintToken() {
      const token = getToken()
      try {
        await token.mint(
          BigNumber.from(state.tokenData.nextMintAllowance).mul(BigNumber.from("1000000000000000000"))
        )
        state.tokenData.totalSupply = await token.totalSupply().toString()
      }
      catch(err: any) {
        mintingError.value = "Error: " + err.error.message
      }
    }
    function getToken() {
      const ethereum: any = (window as any).ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new TimedMintTokenFactory(signer);
      return tokenContract.attach(state.tokenData.address);
    }
    async function setMinter() {
      const token = getToken()
      try {
        await token.setMinter(minterAddressToSet.value)
        state.tokenData.minter = await token.minter()
        mintingError.value = ''
      }
      catch(err: any) {
        if (err.error?.message.includes(adminRole)) {
          mintingError.value = "Only admin address can set minter"
        } else {
          mintingError.value = err.error.message
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
      formatAddress,
      c: (value: string) => currency(Number(value), { separator: ",", precision: 0, symbol: "" }).format()
    };
  },
});
</script>

<style scoped lang="postcss">
.row {
  @apply flex flex-wrap justify-between border-b-2 border-black mt-4
}
</style>
