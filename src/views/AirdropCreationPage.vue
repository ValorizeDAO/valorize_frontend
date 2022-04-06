<template>
  <div>
    <div
      v-if="
        airdropStatus === 'COMPLETE' ||
          (tokenData.airdrop.airdropIndex !== -1 && !tokenData.airdrop.isComplete)
      "
    >
      <h2
        v-if="airdropStatus === 'COMPLETE'"
        class="font-black text-2xl text-center mt-8"
      >
        You have successfully created an airdrop for {{ tokenData.name }}!
      </h2>
      <h2
        v-else
        class="font-black text-2xl text-center mt-8"
      >
        {{ tokenData.name }} has an active airdrop
      </h2>
      <div class="font-black text-center mt-4">
        <p v-if="isSweepingAllowed">
          Time period for this airdrop is over. Mark the airdrop as complete to
          create another one or sweep the unclaimed funds.
        </p>
        <p v-else>
          Administrators will be able to sweep the unclaimed funds for this
          airdrop on:
        </p>
        <p />
        <div
          class="mt-2 text-xl"
          v-if="!isSweepingAllowed"
        >
          {{
            dateFormat(
              new Date(tokenData.airdrop.claimPeriodEnds * 1000),
              "mmm d, yyyy h:MM TT"
            )
          }}<br>
          <p class="font-normal text-base">
            (Shown in local time)
          </p>
        </div>
        <div
          class="mt-2 text-xl"
          v-else
        >
          <button
            @click="completeAirdrop"
            class="btn"
          >
            Mark Airdrop as Complete
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="px-16 pt-8 font-black">
        {{ c(formatEther(tokenData.airdropSupply)) }} ({{ tokenData.symbol }})
        Available for Airdrop
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="
            airdropStatus === 'INIT' ||
              airdropStatus === 'UPLOADED_CSV_ERROR' ||
              airdropStatus === 'ERROR'
          "
          id="drop-airdrop-csv"
          class="md:px-16 mt-4"
        >
          <transition name="fade">
            <div
              v-if="airdropStatus === 'UPLOADED_CSV_ERROR'"
              class="my-4 text-red-900 font-black text-center"
            >
              <p class="text-lg">
                We found duplicate addresses in the CSV!
              </p>
              <p class="text-black">
                This will cause an error, please check your CSV file and upload
                again.
              </p>
            </div>
            <div
              v-else-if="airdropStatus === 'ERROR'"
              class="my-4 text-red-900 font-black text-center"
            >
              There was an error with the request, please try again.
            </div>
          </transition>
          <div
            class="border-black border-4 border-dashed bg-purple-100 mx-auto"
          >
            <div class="h-[20rem] flex flex-col justify-center items-center">
              Add a CSV File
              <button
                @click="triggerUploadForm"
                class="btn my-4"
              >
                Upload
              </button>
              <input
                accept=".csv"
                type="file"
                ref="uploadButton"
                class="sr-only"
              >
            </div>
          </div>
        </div>
        <div
          v-else-if="
            [
              'UPLOADED_CSV',
              'VERIFIED_CSV',
              'CONFIRMING_BACKEND',
              'CONFIRMING_BACKEND_ERROR',
              'METAMASK_NETWORK_ERROR',
              'SENDING_TX',
              'SENDING_TX_ERROR',
            ].includes(airdropStatus)
          "
          class="md:mx-16 mt-4 w-100"
        >
          <h2 class="text-3xl font-black">
            Please Verify Airdrop Ammounts
          </h2>
          <h3 class="font-black my-3 text-red-900">
            <transition name="fade">
              <div v-if="airdropStatus === 'CONFIRMING_BACKEND_ERROR'">
                There was an internal error verifying your data, please try
                again or contact customer service
              </div>
              <div v-else-if="airdropStatus === 'SENDING_TX_ERROR'">
                {{ metamaskError }}
              </div>
            </transition>
          </h3>
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
                <p class="mr-6">
                  {{ data[0] }}
                </p>
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
              <label
                class="my-4 font-black"
                for="airdrop-duration"
              >Airdrop Duration</label>
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
                >
                <span class="font-black">Days</span>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button
              class="btn bg-purple-200 my-4"
              @click="saveAirdropInfo"
            >
              Confirm Data
            </button><br>
            (Once confirmed, this cannot be changed)
          </div>
          <div class="text-center my-8">
            Or, <br>
            <button
              @click="() => (airdropStatus = 'INIT')"
              class="btn mt-4"
            >
              Upload another CSV
            </button>
          </div>
        </div>
        <div
          v-else-if="
            airdropStatus === 'CONFIRMING_BACKEND' ||
              airdropStatus === 'SENDING_TX'
          "
        >
          Confirming your airdrop information
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory"
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory"
import type { SimpleToken } from "../contracts/SimpleToken"
import type { TimedMintToken } from "../contracts/TimedMintToken"
import currency from "currency.js"
import { ethers, BigNumber } from "ethers"
import { useRoute } from "vue-router"
import authentication from "../services/authentication"
import { networkInfo } from "../services/network"
import { formatAddress } from "../services/formatAddress"
import dateFormat from "dateformat"
import { getProviderAndSigner } from "../services/getMetamaskInfo"
import { ref, computed } from "vue"

const props = defineProps<{
  state: any;
}>()

const uploadButton = ref<HTMLInputElement | null>(null)
const route = useRoute()
const tokenData = computed(() => {
  return props.state.tokenData
})
const ethereum: any = (window as any).ethereum
const { formatEther, parseUnits } = ethers.utils
const csvDump = ref("")
const merkleRoot = ref("")
const airdropDuration = ref(180)
const airdropStatuses = [
  "INIT",
  "UPLOADED_CSV",
  "UPLOADED_CSV_ERROR",
  "VERIFIED_CSV",
  "CONFIRMING_BACKEND",
  "CONFIRMING_BACKEND_ERROR",
  "CONFIRMED_BACKEND",
  "CHECKING_NETWORK",
  "METAMASK_NETWORK_ERROR",
  "SENDING_TX",
  "SENDING_TX_ERROR",
  "COMPLETE",
  "ERROR",
]
const airdropStatus = ref(airdropStatuses[0])
function checkForDuplicateAddresses() {
  const airdropSet = new Set(airdropData.value.map((item) => item[0]))
  if (airdropSet.size !== airdropData.value.length) {
    transitionState(false)
  } else {
    transitionState()
  }
}

const isSweepingAllowed = computed(() => {
  return new Date() > new Date(tokenData.value.airdrop.claimPeriodEnds * 1000)
})
async function completeAirdrop() {
  const { signer } = await getProviderAndSigner()
  let tokenInstance: SimpleToken
  if (signer) {
    tokenInstance = new SimpleTokenFactory(signer).attach(tokenData.value.address)
    try {
      await tokenInstance.completeAirdrop()
    } catch (error: any) {
      console.error(error)
    }
  }
}
function transitionState(success: boolean = true) {
  if (success) {
    switch (airdropStatus.value) {
    case "INIT":
      airdropStatus.value = "UPLOADED_CSV"
      checkForDuplicateAddresses()
      break
    case "UPLOADED_CSV" || "UPLOADED_CSV_ERROR":
      airdropStatus.value = "VERIFIED_CSV"
      break
    case "VERIFIED_CSV":
      airdropStatus.value = "CONFIRMING_BACKEND"
      break
    case "CONFIRMING_BACKEND":
      airdropStatus.value = "CONFIRMED_BACKEND"
      break
    case "CONFIRMED_BACKEND":
      airdropStatus.value = "CHECKING_NETWORK"
      break
    case "CHECKING_NETWORK" || "METAMASK_NETWORK_ERROR":
      airdropStatus.value = "SENDING_TX"
      break
    case "SENDING_TX":
      airdropStatus.value = "COMPLETE"
      break
    default:
      airdropStatus.value = "INIT"
      break
    }
  } else {
    switch (airdropStatus.value) {
    case "INIT":
      airdropStatus.value = "UPLOADED_CSV_ERROR"
      break
    case "UPLOADED_CSV":
      airdropStatus.value = "UPLOADED_CSV_ERROR"
      break
    case "CONFIRMING_BACKEND":
      airdropStatus.value = "CONFIRMING_BACKEND_ERROR"
      break
    case "CONFIRMED_BACKEND":
      airdropStatus.value = "METAMASK_NETWORK_ERROR"
      break
    case "SENDING_TX":
      airdropStatus.value = "SENDING_TX_ERROR"
      break
    default:
      airdropStatus.value = "ERROR"
      break
    }
  }
}
const airdropData = computed(() => {
  const csvSplit = csvDump.value.split("\r\n")
  const airdropTuple = csvSplit.map((item) => {
    if (!item) return ["", ""]
    const tuple = item.split(",")
    // We're expecting that user passes decimals
    const amount = tuple[1] ? parseUnits(tuple[1], 18) : "0"
    return [tuple[0] || "", amount.toString()]
  })
  return airdropTuple
})

const totalAirdropAmount = computed(() => {
  const csvSplit = csvDump.value.split("\r\n")
  const amountsOnly = csvSplit.map((item) => {
    return item.split(",")[1]
  })
  return amountsOnly.reduce((partialSum, a) => partialSum + parseInt(a), 0)
})

async function saveAirdropInfo() {
  transitionState()
  const { signer } = await getProviderAndSigner()
  if (!signer) {
    transitionState(false)
    return
  }
  const { id } = route.params
  if (typeof id === "string") {
    const request = await authentication.saveAirdropInfo(id, {
      payload: airdropData.value,
    })
    if (request.status === 200) {
      transitionState()
      const data = await request.json()
      merkleRoot.value = data.merkleRoot
      let tokenInstance: SimpleToken | TimedMintToken
      if (tokenData.value.tokenType === "timed_mint") {
        tokenInstance = new TimedMintTokenFactory(signer).attach(
          tokenData.value.address,
        )
      } else if (tokenData.value.tokenType === "simple") {
        tokenInstance = new SimpleTokenFactory(signer).attach(
          tokenData.value.address,
        )
      } else {
        transitionState(false)
        throw new Error("Token type not supported")
      }
      await switchOrAddNetwork(parseInt(tokenData.value.chainId))
      try {
        await tokenInstance.newAirdrop(
          merkleRoot.value,
          BigNumber.from(airdropDuration.value).mul(24 * 60 * 60),
        )
        tokenData.value.airdrop.claimPeriodEnds =
          new Date().getTime() / 1000 +
          BigNumber.from(airdropDuration.value)
            .mul(24 * 60 * 60)
            .toNumber()
        transitionState()
      } catch (err: any) {
        transitionState(false)
        switch (err.code) {
        case 4001:
          metamaskError.value = "You need to approve the transaction"
          break
        case "UNPREDICTABLE_GAS_LIMIT":
          metamaskError.value = `Your account: ${formatAddress(
            await signer.getAddress(),
          )} is not an administrator account, please switch to an account with administrator privileges`
          break
        default:
          console.error(err)
          metamaskError.value = "Something went wrong"
          break
        }
      }
    } else {
      transitionState(false)
    }
  }
}
function triggerUploadForm() {
  if (uploadButton.value) {
    uploadButton.value.click()
    uploadButton.value.addEventListener("change", (e: Event) => {
      const fr = new FileReader()
      const target = e.target as HTMLInputElement
      fr.onload = function () {
        csvDump.value = fr.result as string
        transitionState()
      }
      try {
        if (!target || !target?.files?.length) {
          throw new Error("Error reading files")
        }
        fr.readAsText(target.files[0])
      } catch (err) {
        console.error(err)
        transitionState(false)
      }
    })
  }
}

async function switchOrAddNetwork(chainId: number): Promise<void> {
  const hexIdOfChain = ethers.utils.hexValue(chainId)
  transitionState()
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexIdOfChain }],
    })
  } catch (switchError: any) {
    console.error(switchError)
    transitionState(false)
    if (switchError.code === 4902) {
      metamaskError.value = `You need to add ${networkInfo[chainId].name} to your wallet`
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexIdOfChain,
              chainName: networkInfo[tokenData.value.chainId].name,
              rpcUrls: [networkInfo[tokenData.value.chainId].rpcUrl],
            },
          ],
        })
      } catch (addError: any) {
        transitionState(false)
        console.error(addError)
      } finally {
        transitionState()
      }
    } else {
      metamaskError.value = `There was an error switching your wallet network to ${networkInfo[chainId].name}`
    }
  } finally {
    transitionState()
  }
}

function c(value: string | number) {
  return currency(Number(value), {
    separator: ",",
    precision: 0,
    symbol: "",
  }).format()
}
</script>
