<template>
  <div>
    <form @change="saveTokenParams">
      <h2 class="text-3xl font-black">
        Launch A Token
      </h2>
      <div class="flex justify-between mt-20">
        <div class="flex flex-col">
          <label
            class="text-l font-black"
            for="token-name"
          >Name</label>
          <input
            v-model="v$.tokenName.$model"
            name="tokenName"
            id="token-name"
            placeholder="Token"
            class="
              w-full
              border-b-2 border-black
              bg-transparent
              mt-4
              placeholder:font-bold
            "
            type="text"
          >
        </div>
        <div class="mx-4" />
        <div class="flex flex-col">
          <label
            class="text-l font-black flex flex-col"
            for=""
          >Symbol</label>
          <input
            v-model="v$.tokenSymbol.$model"
            name="tokenSymbol"
            placeholder="TKN"
            class="
              w-full
              border-b-2 border-black
              bg-transparent
              mt-4
              placeholder:font-bold
            "
            type="text"
          >
        </div>
      </div>
      <div class="mt-8">
        <div class="flex">
          <label
            class="text-l font-black"
            for="initial-supply"
          >Supply For Vault</label>
          <InfoTooltip class="ml-4">
            The amount of tokens that will be delivered to the "Vault Address". A standard amount is 10,000,000.
            Put the total amount without decimals.
          </InfoTooltip>
        </div>
        <input
          v-model="v$.initialSupply.$model"
          name="initialSupply"
          placeholder="5,000,000"
          id="initial-supply"
          class="
              w-full
              border-b-2 border-black
              bg-transparent
              placeholder:font-bold
            "
          type="text"
        >
      </div>
      <div class="mt-8">
        <div class="flex">
          <label class="text-l font-black">
            Vault Address</label>
          <InfoTooltip class="ml-4">
            The ETH address that will receive the initial supply for vault.
            This could be a multisig, or an externally owned account (EOA) that you have access to.
          </InfoTooltip>
        </div>
        <input
          v-model="v$.vaultAddress.$model"
          name="vaultAddress"
          placeholder="0x..."
          class="
              w-full
              border-b-2 border-black
              bg-transparent
              placeholder:font-bold
            "
          type="text"
        >
        <span
          v-if="v$.vaultAddress.$dirty && v$.vaultAddress.$invalid"
          id="vaultAddress-error"
        >Please enter a valid Ethereum address</span>
      </div>
      <div class="mt-8">
        <div class="flex">
          <label
            class="text-l font-black"
            for="airdrop-supply"
          >Supply for Airdrop
          </label>
          <InfoTooltip class="ml-4">
            This supply will be held by the contract and exists in addition to the innitial supply.
            Once you launch your token, you can distribute all or part of the supply for airdrop. <br>
            If you don't want to create an airdrop just yet, you can either set apart the supply now, or
            type '0' and send tokens to the token contract address when you are ready.
          </InfoTooltip>
        </div>
        <input
          v-model="v$.airdropSupply.$model"
          name="airdropSupply"
          placeholder="5,000,000"
          class="
              w-full
              border-b-2 border-black
              bg-transparent
              placeholder:font-bold
            "
          id="airdrop-supply"
          type="text"
        >
      </div>
      <div class="mt-8">
        <div class="flex">
          <label
            class="text-l font-black"
            for="admin-addresses"
          >Administrators' Addresses</label>
          <InfoTooltip class="ml-4">
            These Ethereum addresses will have the ability to create and finish airdrops as well as set up
            an address that will have a 'minter' role (with the ability to mint more tokens) if applicable.
          </InfoTooltip>
        </div>
        <p class="mb-4 text-s">
          Insert list separated by commas
        </p>
        <input
          v-model="v$.adminAddresses.$model"
          id="admin-addresses"
          name="adminAddresses"
          class="
            w-full
            border-b-2 border-black
            bg-transparent
            placeholder:font-bold
          "
          type="text"
        >
        <span
          v-if="v$.adminAddresses.$dirty && v$.adminAddresses.$invalid"
          id="admin-addresses-error"
        >Please enter a valid Ethereum addresses separated by commas</span>
      </div>
      <div class="mt-8 flex justify-between">
        <div class="flex">
          <p
            class="text-l font-black"
            for=""
          >
            Minting Allowed
          </p>
          <InfoTooltip class="ml-4">
            Minting is the process of increasing the total circulating supply of a token. Currently, you have set
            {{ c(totalSupply) }} tokens to exist, and minting would allow you to increase that number.
          </InfoTooltip>
        </div>
        <div>
          <input
            type="radio"
            id="minting-no"
            name="minting"
            v-model="v$.minting.$model"
            :checked="tokenParams.minting === 'false'"
            value="false"
          ><label
            for="minting-no"
            class="mr-4"
          >No</label>
          <input
            type="radio"
            id="minting-yes"
            name="minting"
            v-model="v$.minting.$model"
            :checked="tokenParams.minting === 'true'"
            value="true"
          ><label for="minting-yes">Yes</label>
        </div>
      </div>
      <div
        class="mt-8"
        v-if="tokenParams.minting === 'false'"
      >
        Current total max supply: {{ c(totalSupply) }}
      </div>
      <transition name="fade">
        <div v-if="tokenParams.minting === 'true'">
          <div>
            <div class="mt-8 flex justify-between">
              <div class="flex">
                <label
                  class="text-l font-black"
                  for="supplyCap"
                >Total Supply Cap</label>
                <InfoTooltip class="ml-4">
                  The total supply cap is to guarantee that there will be a maximum number of tokens ever minted.
                </InfoTooltip>
              </div>
              <div>
                <input
                  type="radio"
                  id="mint-cap-no"
                  name="supplyCap"
                  v-model="v$.supplyCap.$model"
                  :checked="tokenParams.supplyCap === 'false'"
                  value="false"
                ><label
                  for="mint-cap-no"
                  class="mr-4"
                >No</label>
                <input
                  type="radio"
                  id="mint-cap-yes"
                  name="supplyCap"
                  v-model="v$.supplyCap.$model"
                  :checked="tokenParams.supplyCap === 'true'"
                  value="true"
                ><label for="mint-cap-yes">Yes</label>
              </div>
            </div>
            <transition name="fade">
              <div
                v-if="tokenParams.supplyCap === 'true'"
                class="mt-8"
              >
                <label
                  class="text-l font-black"
                  for="maxSupply"
                >Max Supply
                </label>
                <input
                  v-model="v$.maxSupply.$model"
                  id="maxSupply"
                  name="maxSupply"
                  class="w-full border-b-2 border-black bg-transparent"
                  type="text"
                >
              </div>
            </transition>
            <transition name="fade">
              <p
                v-if="!isMaxSupplyValid"
                class="mt-4 text-red-900 font-semibold"
              >
                Should be greater than innitial supply + airdrop supply
              </p>
            </transition>
          </div>
          <div class="mt-8">
            <div class="flex">
              <label
                class="text-l font-black"
                for="time-delay"
              >Mint Period Length</label>
              <InfoTooltip class="ml-4">
                How many days must pass before you can call the minting function again.
              </InfoTooltip>
            </div>
            <div class="flex justify-between">
              <input
                v-model="v$.timeDelay.$model"
                id="time-delay"
                name="timeDelay"
                class="w-[80%] border-b-2 border-black bg-transparent"
                type="number"
              >
              <span class="font-black">Days</span>
            </div>
          </div>
          <div class="mt-8">
            <div class="flex">
              <label
                class="text-l font-black"
                for="mint-cap"
              >Max Amount of Tokens to Mint Per Mint Period</label>
              <InfoTooltip class="ml-4">
                Each mint period will be able to mint up to but not more than this amount.
              </InfoTooltip>
            </div>
            <input
              v-model="v$.mintCap.$model"
              id="mint-cap"
              name="mintCap"
              class="w-full border-b-2 border-black bg-transparent"
              type="string"
            >
            <p v-if="v$.mintCap.$dirty && v$.mintCap.$invalid">
              Please enter a valid amount of tokens to to mint each
              {{ tokenParams.timeDelay }} days
            </p>
          </div>
        </div>
      </transition>
      <div class="flex flex-col items-center mt-8">
        <div class="flex items-center flex-col-reverse md:flex-row md:self-end justify-self-end">
          <button
            @click.prevent="clearForm"
            class="btn md:mr-8"
          >
            clear form
          </button>
          <input
            type="submit"
            class="btn w-48 my-4 bg-purple-50 disabled:cursor-not-allowed"
            :class="{
              'bg-gray-300 text-slate-600 border-slate-600': v$.$invalid,
            }"
            :disabled="v$.$invalid"
            @click.prevent="() => toggleSimpleTokenModal()"
            value="Preview Token"
          >
        </div>
        <div
          v-if="v$.$anyDirty && v$.$invalid"
          class="my-4"
        >
          <span>All Fields Required</span> <div
            v-if="!isMaxSupplyValid"
            class="font-bold"
          >
            Invalid Max Supply
          </div>
        </div>
      </div>
    </form>
    <Modal
      :body-class="['bg-white xl:w-7/12 sm:mt-0 md:mt-12']"
      :modal-is-open="simpleTokenModalDisplayed"
      @toggle="() => toggleSimpleTokenModal()"
    >
      <div
        class="flex items-center justify-between pb-4 border-black border-b-2"
      >
        <h2 class="text-xl font-black">
          Token Summary
        </h2>
      </div>
      <div class="mt-4">
        <h1 class="text-3xl font-black mb-8">
          {{ tokenParams.tokenName }} ({{ tokenParams.tokenSymbol }})
        </h1>
        <div class="flex justify-between">
          <h2 class="font-black text-xl">
            Initial Supply
          </h2>
          <span class="text-xl font-black">{{ c(totalSupply) }}</span>
        </div>
        Breakdown:
        <div class="flex justify-between items-center">
          <span
            class="text-sm ml-8"
          >To be sent to: "{{ tokenParams.vaultAddress }}"</span>
          <span class="text-l font-black text-gray-700">{{
            c(initialSupply)
          }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm ml-8">Reserved for Airdrops</span>
          <span class="text-l font-black text-gray-700">{{
            c(airdropSupply)
          }}</span>
        </div>
        <div
          class="flex justify-between items-center border-b-2 border-black pb-2"
        >
          <span class="text-sm ml-8 font-black">Total</span>
          <span class="text-l font-black border-t-2 border-black">{{
            c(totalSupply)
          }}</span>
        </div>
        <div v-if="tokenParams.minting === 'true'">
          <div class="flex justify-between border-b-2 border-black py-2">
            <h2 class="text-xl font-black">
              Max Supply
            </h2>
            <span
              class="text-xl font-black"
              v-if="tokenParams.supplyCap === 'true'"
            >{{ c(maxSupply) }}</span>
            <span
              class="text-xl font-black"
              v-if="tokenParams.supplyCap === 'false'"
            >Unlimited</span>
          </div>
          <div
            v-if="tokenParams.minting === 'true'"
            class="flex justify-between border-b-2 border-black py-2"
          >
            <h2 class="text-xl font-black">
              Time Between Minting Periods
            </h2>
            <span
              class="text-xl font-black"
            >{{ tokenParams.timeDelay }} Days</span>
          </div>
          <div
            v-if="tokenParams.minting === 'true'"
            class="flex justify-between border-b-2 border-black py-2"
          >
            <h2 class="text-xl font-black">
              Tokens to Mint Per Minting Periods
            </h2>
            <span class="text-xl font-black">{{ c(mintCap) }}</span>
          </div>
        </div>
        <div class="justify-between border-b-2 border-black py-2">
          <h2 class="text-xl font-black">
            Administrators
          </h2>
          <ul class="flex flex-col">
            <div
              v-for="(address, i) in parsedAddresses.slice(0, 3)"
              :key="i"
            >
              <li class="w-100">
                {{ address }}
              </li>
            </div>
            <div v-if="parsedAddresses.length > 3">
              <transition name="fade">
                <div v-if="showExpandedList">
                  <li
                    class="w-100"
                    v-for="(address, i) in parsedAddresses.slice(3)"
                    :key="i"
                  >
                    {{ address }}
                  </li>
                </div>
              </transition>
              <button @click="expandAddressList">
                <span v-if="!showExpandedList">
                  +{{ parsedAddresses.length - 3 }} More... See All
                </span>
                <span v-else> See Less </span>
              </button>
            </div>
          </ul>
        </div>
      </div>
      <div class="flex justify-center my-4">
        <transition
          name="fade"
          mode="out-in"
        >
          <div v-if="currentStatus == states.init">
            Checking your Web3 Provider
          </div>
          <div v-else-if="currentStatus === states.fetchingTokenData">
            Getting contract info
          </div>
          <div v-else-if="currentStatus === states.fetchingDataFailed">
            Error getting token data, please refresh the page and try again
          </div>
          <div v-else-if="currentStatus === states.transactionAwaitingSignature">
            Please Use Your Wallet to Confirm Transaction
          </div>
          <div
            v-else-if="
              currentStatus === states.signerEnabled ||
                currentStatus === states.transactionSignatureRejectedByUser ||
                currentStatus === states.signedTransactionError
            "
            class="text-center"
          >
            <div
              class="text-center"
              v-if="currentStatus === states.signedTransactionError"
            >
              <p>{{ errorText }}</p>
              <p class="mb-2">
                Try Again?
              </p>
            </div>
            <div
              v-else-if="currentStatus === states.transactionSignatureRejectedByUser"
              class="text-center"
            >
              <p>Transaction Rejected By Your Wallet</p>
              <p class="mb-2">
                Try Again?
              </p>
            </div>

            <div
              v-if="networkName !== 'Unsupported'"
            >
              <button
                class="btn text-center"
                @click="deployToken"
              >
                <span class="px-8">Deploy to {{ networkName }}</span>
              </button>
              <div>
                <span>Price: </span>
                <span>{{ contractPrice }} {{ currencyActive }}</span>
              </div>
            </div>
            <div v-else>
              Please change networks on your wallet to a supported network
            </div>
          </div>
          <div v-else-if="currentStatus === states.signerNotAvailable">
            To launch a token, you need a web3 provider such as
            <a
              href="https://metamask.io/"
              class="font-black underline"
            >Metamask</a>
            or use
            <a
              href="https://brave.com/"
              class="font-black underline"
            >Brave Browser's built in wallet</a>
          </div>
          <div
            v-else-if="currentStatus === states.signedTransactionSent"
            class="text-center"
          >
            Contract launching, <br>
            <a
              v-if="isKnownNetwork"
              :href="blockExplorer + 'tx/' + tokenTxHash"
              target="_blank"
              class="font-black border-black border-b-2 pt-2"
            >See transaction: {{ formatAddress(tokenTxHash) }}
            </a>
            <span v-else>Tx hash: {{ tokenTxHash }}</span>
            <SvgLoader
              class="text-center mx-auto h-12 pt-4"
              fill="#"
            />
          </div>
          <div
            v-else-if="currentStatus === states.transactionMined"
            class="text-center"
          >
            Success! <br>
            <a
              v-if="isKnownNetwork"
              :href="blockExplorer + 'address/' + deployedTokenAddress"
              target="_blank"
              class="font-black border-black border-b-2"
            >See your token: {{ formatAddress(deployedTokenAddress) }}
            </a>
            <span
              v-else
            >Your token is now live in address:
              {{ deployedTokenAddress }}</span>
          </div>
        </transition>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed, onMounted, SetupContext } from "vue"
import { useRouter } from "vue-router"
import { ethers, BigNumber, providers, Contract } from "ethers"
import { networkInfo, network } from "../services/network"
import detectEthereumProvider from "@metamask/detect-provider"
import { TokenParams } from "../models/Token"
import currency from "currency.js"
import auth from "../services/authentication"
import useVuelidate from "@vuelidate/core"
import { required, minLength } from "@vuelidate/validators"
import Modal from "../components/Modal.vue"
import SvgLoader from "../components/SvgLoader.vue"
import InfoTooltip from "../components/InfoTooltip.vue"
import { formatAddress } from "../services/formatAddress"
import { Deployer } from "../contracts/Deployer"
import { DeployerFactory } from "../contracts/DeployerFactory"
import api from "../services/api"

enum tokenTypes {
  simple,
  timedMint,
  creator
}

export default defineComponent({
  name: "CreateToken",
  components: {
    Modal,
    SvgLoader,
    InfoTooltip,
  },
  emits: ["tokenUpdated"],
  setup(props, ctx) {
    return {
      ...composeDeployGovToken(ctx),
      formatAddress,
      c: (value: string | number) =>
        currency(Number(value), {
          separator: ",",
          symbol: "",
          precision: 0,
        }).format(),
    }
  },
})
enum states {
  init,
  fetchingTokenData,
  fetchingDataFailed,
  signerRequested,
  signerNotAvailable,
  signerEnabled,
  transactionAwaitingSignature,
  transactionSignatureRejectedByUser,
  signedTransactionSent,
  signedTransactionError,
  transactionMined,
}
function composeDeployGovToken(ctx: SetupContext<"tokenUpdated"[]>) {
  const router = useRouter()
  const showExpandedList = ref(false)
  const tokenStatuses = ["INIT", "DEPLOYING_TEST", "DEPLOYED_TEST"]
  const tokenStatus = ref(tokenStatuses[0])

  const metamaskAuthStatuses = [
    "INIT", // 0
    "REQUESTED", // 1
    "TIMEOUT", // 2
    "SUCCESSFULLY_ENABLED", // 3
    "UNAVAILABLE", // 4
    "TX_REQUESTED", // 5
    "TX_APPROVED", // 6
    "TX_SUCCESS", // 7
    "TX_REJECTED", // 8
    "TX_ERROR", // 9
  ]
  const errorText = ref("")
  const currentStatus = ref(states.init)
  const simpleTokenModalDisplayed = ref(false)
  const network = ref("")
  const tokenTxHash = ref("")
  const deployedTokenAddress = ref("")
  const emptyTokenParams = {
    tokenName: "",
    tokenSymbol: "",
    initialSupply: "",
    vaultAddress: "",
    airdropSupply: "",
    adminAddresses: "",
    minting: "false",
    supplyCap: "false",
    maxSupply: "0",
    timeDelay: 0,
    mintCap: "",
  }
  const tokenParams = reactive({ ...emptyTokenParams })
  const contractPrice = ref("")
  const networks = { ...networkInfo }
  const networkName = computed((): string => {
    return networks[network.value]?.name || "Unsupported"
  })
  const isKnownNetwork = computed((): network => {
    return networks[network.value]
  })
  const blockExplorer = computed((): string => {
    return networks[network.value]?.blockExplorer
  })
  const initialSupply = computed(() => {
    return getNumbersFromString(tokenParams.initialSupply)
  })
  const airdropSupply = computed(() => {
    return getNumbersFromString(tokenParams.airdropSupply)
  })
  const mintCap = computed(() => {
    return getNumbersFromString(tokenParams.mintCap)
  })
  const maxSupply = computed(() => {
    return getNumbersFromString(tokenParams.maxSupply)
  })
  const totalSupply = computed(() => {
    return Number(initialSupply.value) + Number(airdropSupply.value)
  })
  const currencyActive = computed(() => {
    return networks[network.value]?.currency
  })
  const parsedAddresses = computed(() => {
    const { adminAddresses } = tokenParams
    const addresses = adminAddresses.split(",")
    if (addresses.length > 1) return addresses.map((val) => val.trim())
    return [adminAddresses]
  })
  let ethereum: any = {}
  let provider: providers.Provider
  const decimalsMultiplyer = BigNumber.from("1000000000000000000")
  const contractKeys: string[] = []
  onMounted(async () => {
    const res = await api.getContractKeys()
    if (res.ok) {
      const { smartContractKeys } = await res.json()
      contractKeys.push(...smartContractKeys)
    }
    const tokenRawData = localStorage.getItem("tokenData") || ""
    if (tokenRawData) {
      const storedParams = JSON.parse(tokenRawData) as TokenParams
      ctx.emit("tokenUpdated", storedParams)
      Object.assign(tokenParams, storedParams)
      if (!isValidMaxSupply(tokenParams.maxSupply)) {
        setTimeout(() => {
          v$.value.maxSupply.$touch()
        }, 500)
      }
    }
  })

  function saveTokenParams() {
    localStorage.setItem("tokenData", JSON.stringify(tokenParams))
    ctx.emit("tokenUpdated", tokenParams)
  }

  function clearForm() {
    Object.assign(tokenParams, { ...emptyTokenParams })
    localStorage.removeItem("tokenData")
  }

  function toggleSimpleTokenModal() {
    simpleTokenModalDisplayed.value = !simpleTokenModalDisplayed.value
    checkProvider()
  }
  function expandAddressList() {
    showExpandedList.value = !showExpandedList.value
  }
  async function checkProvider() {
    tokenStatus.value = tokenStatuses[1]
    const hasEthProvider = await detectEthereumProvider()
    if (hasEthProvider) {
      ethereum = (window as any).ethereum
      provider = new ethers.providers.Web3Provider(ethereum, "any")
      await ethereum.request({ method: "eth_requestAccounts" })

      currentStatus.value = states.signerEnabled
      const networkData = await provider.getNetwork()
      network.value = networkData.chainId.toString()

      // @ts-ignore the lies
      const signer = provider.getSigner()
      if (!(await getContractParams(networkData.chainId.toString()))) return
      provider.on("network", async (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          currentStatus.value = states.signerEnabled
          const success = await getContractParams(newNetwork.chainId)
          if (success) {
            currentStatus.value = states.signerEnabled
          }
          network.value = newNetwork.chainId
        }
      })
      if (!networkInfo[network.value]) {
        alert("Unsupported Network, please connect to ethereum, polygon, or arbitrum")
      }
      currentStatus.value = states.signerEnabled
      tokenStatus.value = tokenStatuses[2]
    } else {
      currentStatus.value = states.signerNotAvailable
    }
  }
  async function getContractParams(chainId: string) {
    currentStatus.value = states.fetchingTokenData
    const response = await api.getContractByteCodeHashAndPrice(tokenKeys[tokenParams.minting === "false" ? 0 : 1], chainId)
    if (response.status !== 200) {
      currentStatus.value = states.fetchingDataFailed
      return false
    }
    const result = await response.json()
    console.log({ result })
    contractPrice.value = ethers.utils.formatEther(result.Price.toString())
    return true
  }
  async function deployToken() {
    tokenStatus.value = tokenStatuses[3]
    currentStatus.value = states.signerRequested
    // @ts-ignore the lies
    const signer = provider.getSigner()
    currentStatus.value = states.signerEnabled
    let params = ""
    const encoder = new ethers.utils.AbiCoder()
    let contractNum:tokenTypes = 0
    if (tokenParams.minting === "false") {
      contractNum = 0
      const data = [
        BigNumber.from(initialSupply.value).mul(decimalsMultiplyer),
        BigNumber.from(airdropSupply.value).mul(decimalsMultiplyer),
        ethers.utils.getAddress(tokenParams.vaultAddress),
        tokenParams.tokenName,
        tokenParams.tokenSymbol,
        parsedAddresses.value.map((v) => ethers.utils.getAddress(v)),
      ]
      params = encoder.encode(
        ["uint256", "uint256", "address", "string", "string", "address[]"],
        data)
    } else if (tokenParams.minting === "true") {
      contractNum = 1
      let maxTokenSupply: BigNumber
      if (tokenParams.supplyCap === "false") {
        maxTokenSupply = BigNumber.from(0)
      } else {
        maxTokenSupply = BigNumber.from(maxSupply.value).mul(decimalsMultiplyer)
      }
      params = encoder.encode(
        ["uint", "uint", "uint", "address", "uint", "uint", "string", "string", "address[]"],
        [
          BigNumber.from(initialSupply.value).mul(decimalsMultiplyer), // vault
          BigNumber.from(airdropSupply.value).mul(decimalsMultiplyer), // airdrop
          maxTokenSupply, // supplycap
          ethers.utils.getAddress(tokenParams.vaultAddress), // vault
          BigNumber.from(tokenParams.timeDelay).mul(BigNumber.from(86400)), // timeDelay
          BigNumber.from(mintCap.value).mul(decimalsMultiplyer), // mintCap
          tokenParams.tokenName,
          tokenParams.tokenSymbol,
          parsedAddresses.value.map((v) => ethers.utils.getAddress(v)),
        ])
    } else { return }
    const deployerAddress = import.meta.env.VITE_DEPLOYER_ADDRESS as string
    const deployerContract = new DeployerFactory(signer).attach(deployerAddress)
    const { tx, error } = await deployContract(deployerContract, contractNum, params)
    if (error) {
      if (error.code === 4001) {
        currentStatus.value = states.transactionSignatureRejectedByUser
      } else {
        currentStatus.value = states.signedTransactionError
        let errorMessage = "Error confirming transaction"
        if ((error.message as string).includes("err: insufficient funds") ||
          (error.data.message as string).includes("err: insufficient funds")) {
          errorMessage = `Insufficient funds in your account to deploy a token. Cost is ${contractPrice.value} ${networkInfo[network.value].currency}`
        }
        errorText.value = error.msg || errorMessage
      }
      return
    }
    tokenTxHash.value = (tx as ethers.ContractTransaction).hash
    currentStatus.value = states.signedTransactionSent
    await tx?.wait(1)
    const deployedContractAddress = await retrieveContractAddress(
      deployerContract as Contract, tx as ethers.ContractTransaction,
    )
    deployedTokenAddress.value = deployedContractAddress || ""
    const tokenRequest = await storeTokenData()
    const tokenResponse = await tokenRequest.json()
    currentStatus.value = states.signedTransactionSent
    clearForm()
    await router.push({
      path: "/token-success",
      query: { tokenId: tokenResponse.token.id },
    })
  }
  const tokenKeys = ["simple_token_v0.1.0", "timedMint_token_v0.1.0", "creator_token_v0.1.0"]
  async function deployContract(
    deployer: Deployer,
    type: tokenTypes,
    params: string,
  ): Promise<{
    deployedContractAddress?: string,
    tx?: ethers.ContractTransaction,
    error: any
  }> {
    const req = await api.getContractBytecode(tokenKeys[type])
    if (!req.ok) { return { error: { msg: "Error getting bytecode" } } }

    const { byte_code } = await req.json() as { id: number, key: string, byte_code: string }
    console.groupCollapsed("tokenInfo")
    console.log("Deploying " + tokenKeys[type])
    console.log(deployer.address)
    console.log(ethers.utils.parseEther(contractPrice.value))
    try {
      const tx = await deployer.deployContract(
        tokenKeys[type],
        byte_code,
        params,
        ethers.utils.hexZeroPad("0x0", 32),
        { value: ethers.utils.parseEther(contractPrice.value) },
      )
      return { error: false, tx }
    } catch (err: any) {
      console.error({ error: err })
      return { error: err }
    } finally {
      console.groupEnd()
    }
  }

  async function retrieveContractAddress(
    deployerContract: Contract,
    createTx: ethers.ContractTransaction,
  ): Promise<string> {
    const info = await deployerContract.queryFilter({
      address: deployerContract.address,
      topics: [
        ethers.utils.id("ContractDeployed(address,string,uint256)"),
      ],
    }, createTx.blockHash)
    const event = info.find(e => e.transactionHash === createTx.hash) as ethers.Event
    if (event) {
      return event.args?.contractAddress || ""
    }
    return ""
  }

  async function storeTokenData() {
    return await auth.saveTokenData({
      tokenType: tokenParams.minting === "true" ? "timed_mint" : "simple",
      contractVersion: "v0.1.0",
      freeSupply: initialSupply.value,
      airdropSupply: airdropSupply.value,
      vaultAddress: tokenParams.vaultAddress,
      tokenName: tokenParams.tokenName,
      tokenSymbol: tokenParams.tokenSymbol,
      adminAddresses: tokenParams.adminAddresses,
      chainId: network.value,
      txHash: tokenTxHash.value,
      contractAddress: deployedTokenAddress.value,
    })
  }
  function getNumbersFromString(str: string) {
    return str.replace(/[^0-9]/g, "")
  }
  function isEtherAddress(value: string) {
    const trimmedAddress = value.trim()
    return (
      trimmedAddress.substring(0, 2) === "0x" && trimmedAddress.length === 42
    )
  }
  function isNumberString(value: string) {
    if (value) {
      // @ts-ignore because TS doesn't know the idiosyncrasies (dumb design decisions) of JS
      return parseInt(getNumbersFromString(value)) !== "Nan"
    }
    return true
  }
  const rules = computed(() => {
    const simpleTokenValidationParams = {
      tokenName: {
        required,
        minLength: minLength(2),
      },
      tokenSymbol: {
        required,
        minLength: minLength(2),
      },
      initialSupply: {
        required,
        minLength: minLength(1),
        isNumberString,
      },
      vaultAddress: {
        required,
        isEtherAddress,
      },
      airdropSupply: {
        required,
        minLength: minLength(1),
        isNumberString,
      },
      adminAddresses: {
        required,
        isListOfAdminAddresses: (value: any) => {
          return value.split(",").every(isEtherAddress)
        },
      },
      minting: { },
      supplyCap: { },
      maxSupply: { },
      timeDelay: { },
      mintCap: { },
    }
    const timedMintTokenValidationParams = {
      ...simpleTokenValidationParams,
      minting: {
        required,
      },
      supplyCap: {
        required,
      },
      maxSupply: {
        isValidMaxSupply,
      },
      timeDelay: {
        hasValue: (value: number) => {
          return value > 0
        },
      },
      mintCap: {
        isValidMintAmout: (value: any) => {
          return (
            (isNumberString(value) && parseInt(getNumbersFromString(value)) > 0)
          )
        },
      },
    }
    if (tokenParams.minting === "false") {
      return simpleTokenValidationParams
    } else {
      return timedMintTokenValidationParams
    }
  })
  function isValidMaxSupply(value: any) {
    return (
      value === "0" || (
        parseInt(getNumbersFromString(value)) >
        parseInt(getNumbersFromString(tokenParams.initialSupply)) +
        parseInt(getNumbersFromString(tokenParams.airdropSupply))
      ))
  }
  // @ts-ignore
  const v$ = useVuelidate(rules, tokenParams)
  const isMaxSupplyValid = computed(() => {
    return (
      // @ts-ignore
      (v$.value.maxSupply.$dirty && !v$.value.maxSupply.$invalid) || !v$.value.maxSupply.$dirty
    )
  })
  return {
    tokenParams,
    initialSupply,
    airdropSupply,
    totalSupply,
    mintCap,
    maxSupply,
    parsedAddresses,
    showExpandedList,
    expandAddressList,
    simpleTokenModalDisplayed,
    toggleSimpleTokenModal,
    tokenStatus,
    deployToken,
    network,
    networkName,
    contractPrice,
    v$,
    isMaxSupplyValid,
    currentStatus,
    tokenTxHash,
    deployedTokenAddress,
    blockExplorer,
    isKnownNetwork,
    errorText,
    saveTokenParams,
    clearForm,
    currencyActive,
    states,
  }
}
</script>
