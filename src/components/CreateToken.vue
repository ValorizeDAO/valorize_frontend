<template>
  <div>
    <form>
      <h2 class="text-3xl font-black">Launch A Token</h2>
      <div class="flex justify-between mt-20">
        <label class="text-l font-black flex flex-col" for=""
          >Name
          <input
            v-model="v$.tokenName.$model"
            name="tokenName"
            placeholder="Token"
            class="
              w-full
              border-b-2 border-black
              bg-transparent
              mt-4
              placeholder:font-bold
            "
            type="text"
          />
        </label>
        <div class="mx-4"></div>
        <label class="text-l font-black flex flex-col" for=""
          >Symbol
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
          />
        </label>
      </div>
      <div class="mt-8">
        <label class="text-l font-black"
          >Supply For Vault<input
            v-model="v$.initialSupply.$model"
            name="initialSupply"
            placeholder="5,000,000"
            class="
              w-full
              border-b-2 border-black
              bg-transparent
              placeholder:font-bold
            "
            type="text"
        /></label>
      </div>
      <div class="mt-8">
        <label class="text-l font-black">
          Vault Address
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
        /></label>
        <span v-if="v$.vaultAddress.$dirty && v$.vaultAddress.$invalid"
          >Please enter a valid Ethereum address</span
        >
      </div>
      <div class="mt-8">
        <label class="text-l font-black"
          >Supply for Airdrop<input
            v-model="v$.airdropSupply.$model"
            name="airdropSupply"
            placeholder="5,000,000"
            class="
              w-full
              border-b-2 border-black
              bg-transparent
              placeholder:font-bold
            "
            type="text"
        /></label>
      </div>
      <div class="mt-8">
        <label class="text-l font-black" for="admin-addresses"
          >Administrators' Addresses</label
        >
        <p class="mb-4 text-s">Insert list separated by commas</p>
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
        />
        <span v-if="v$.adminAddresses.$dirty && v$.adminAddresses.$invalid"
          >Please enter a valid Ethereum addresses separated by commas</span
        >
      </div>
      <div class="mt-8 flex justify-between">
        <p class="text-l font-black" for="">Minting Allowed</p>
        <div>
          <input
            type="radio"
            id="minting-no"
            name="minting"
            v-model="v$.minting.$model"
            :checked="v$.minting.$model === 'false'"
            value="false"
          /><label for="minting-no" class="mr-4">No</label>
          <input
            type="radio"
            id="minting-yes"
            name="minting"
            v-model="v$.minting.$model"
            :checked="v$.minting.$model === 'true'"
            value="true"
          /><label for="minting-yes">Yes</label>
        </div>
      </div>
      <transition name="fade">
        <div v-if="v$.minting.$model === 'true'">
          <div>
            <div class="mt-8 flex justify-between">
              <label class="text-l font-black" for="supplyCap"
                >Total Supply Cap</label
              >
              <div>
                <input
                  type="radio"
                  id="mint-cap-no"
                  name="supplyCap"
                  v-model="v$.supplyCap.$model"
                  :checked="v$.supplyCap.$model === 'false'"
                  value="false"
                /><label for="mint-cap-no" class="mr-4">No</label>
                <input
                  type="radio"
                  id="mint-cap-yes"
                  name="supplyCap"
                  v-model="v$.supplyCap.$model"
                  :checked="v$.supplyCap.$model === 'true'"
                  value="true"
                /><label for="mint-cap-yes">Yes</label>
              </div>
            </div>
            <transition name="fade">
              <div v-if="v$.supplyCap.$model === 'true'" class="mt-8">
                <label class="text-l font-black"
                  >Max Supply
                  <input
                    v-model="v$.maxSupply.$model"
                    id="maxSupply"
                    name="maxSupply"
                    class="w-full border-b-2 border-black bg-transparent"
                    type="text"
                  />
                </label>
              </div>
            </transition>
            <transition name="fade">
              <p v-if="isMaxSupplyValid" class="mt-4">
                Should be greater than innitial supply + airdrop supply
              </p>
            </transition>
          </div>
          <div class="mt-8">
            <label class="text-l font-black"
              >Days Between Mints
              <input
                v-model="v$.timeDelay.$model"
                id="time-delay"
                name="timeDelay"
                class="w-full border-b-2 border-black bg-transparent"
                type="number"
              />
            </label>
          </div>
          <div class="mt-8">
            <label class="text-l font-black"
              >Tokens to Mint Per Mint Period
              <input
                v-model="v$.mintCap.$model"
                id="mint-cap"
                name="mintCap"
                class="w-full border-b-2 border-black bg-transparent"
                type="number"
              />
            </label>
          </div>
        </div>
      </transition>
      <div class="flex flex-col items-center mt-8">
        <input
          type="submit"
          class="btn w-48 mt-4 mb-24 bg-purple-50 disabled:cursor-not-allowed"
          :class="{
            'bg-gray-300 text-slate-600 border-slate-600': v$.$invalid,
          }"
          :disabled="v$.$invalid"
          @click.prevent="submitToken"
        />
        <span v-if="v$.$anyDirty && v$.$invalid" class="my-4"
          >All Fields Required</span
        >
      </div>
    </form>
    <Modal
      :body-class="['bg-white xl:w-7/12 sm:mt-0']"
      :modal-is-open="simpleTokenModalDisplayed"
      @toggle="() => toggleSimpleTokenModal()"
    >
      <div
        class="flex items-center justify-between pb-4 border-black border-b-2"
      >
        <h2 class="text-xl font-black">Token Summary</h2>
      </div>
      <div class="mt-4">
        <h1 class="text-3xl font-black mb-8">
          {{ tokenParams.tokenName }} ({{ tokenParams.tokenSymbol }})
        </h1>
        <div class="flex justify-between">
          <h2 class="font-black text-xl">Initial Supply</h2>
          <span class="text-xl font-black">{{ c(totalSupply) }}</span>
        </div>
        Breakdown:
        <div class="flex justify-between items-center">
          <span class="text-sm ml-8"
            >To be sent to: "{{ tokenParams.vaultAddress }}"</span
          >
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
            <h2 class="text-xl font-black">Max Supply</h2>
            <span
              class="text-xl font-black"
              v-if="tokenParams.supplyCap === 'true'"
              >{{ c(tokenParams.maxSupply) }}</span
            >
            <span
              class="text-xl font-black"
              v-if="tokenParams.supplyCap === 'false'"
              >Unlimited</span
            >
          </div>
          <div
            v-if="tokenParams.minting === 'true'"
            class="flex justify-between border-b-2 border-black py-2"
          >
            <h2 class="text-xl font-black">Time Between Minting Periods</h2>
            <span class="text-xl font-black"
              >{{ tokenParams.timeDelay }} Days</span
            >
          </div>
          <div
            v-if="tokenParams.minting === 'true'"
            class="flex justify-between border-b-2 border-black py-2"
          >
            <h2 class="text-xl font-black">
              Tokens to Mint Per Minting Periods
            </h2>
            <span class="text-xl font-black">{{ c(tokenParams.mintCap) }}</span>
          </div>
        </div>
        <div class="justify-between border-b-2 border-black py-2">
          <h2 class="text-xl font-black">Administrators</h2>
          <ul class="flex flex-col">
            <div v-for="address in parsedAddresses.slice(0, 3)" :key="address">
              <li class="w-100">{{ address }}</li>
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
        <div v-if="metamaskStatus === 'TX_REJECTED'">
          Please verify the details and try again.
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="metamaskStatus === 'INIT'">
            Checking your Web3 Provider
          </div>
          <div v-else-if="metamaskStatus === 'REQUESTED'">
            please enable metamask or a web3 provider
          </div>
          <div
            v-else-if="
              metamaskStatus === 'SUCCESSFULLY_ENABLED' ||
              metamaskStatus === 'TX_REJECTED' ||
              metamaskStatus === 'TX_ERROR'
            "
          >
            <div class="text-center" v-if="metamaskStatus === 'TX_ERROR'">
              There was an error creating your token <br />
              <p>{{ errorText }}</p>
              <p>Try Again?</p>
            </div>
            <button class="btn text-center" @click="deployToken">
              <span class="px-8">Deploy to {{ networkName }}</span>
            </button>
          </div>
          <div v-else-if="metamaskStatus === 'UNAVAILABLE'">
            To launch a token, you need a web3 provider such as
            <a href="https://metamask.io/" class="font-black underline"
              >Metamask</a
            >
            or use
            <a href="https://brave.com/" class="font-black underline"
              >Brave Browser's built in wallet</a
            >
          </div>
          <div
            class="text-center"
            v-else-if="metamaskStatus === 'TX_REQUESTED'"
          >
            Contract launching, <br />
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
            ></SvgLoader>
          </div>
          <div class="text-center" v-else-if="metamaskStatus === 'TX_SUCCESS'">
            Success! <br />
            <a
              v-if="isKnownNetwork"
              :href="blockExplorer + 'address/' + deployedTokenAddress"
              target="_blank"
              class="font-black border-black border-b-2"
              >See your token: {{ formatAddress(deployedTokenAddress) }}
            </a>
            <span v-else
              >Your token is now live in address:
              {{ deployedTokenAddress }}</span
            >
          </div>
        </transition>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import { ethers, BigNumber, Signer, providers } from "ethers";
import { networkInfo, network } from "../services/network";
import detectEthereumProvider from "@metamask/detect-provider";
import currency from "currency.js";
import api from "../services/api";
import auth from "../services/authentication";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory";
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory";
import { TimedMintToken } from "../contracts/TimedMintToken";
import { SimpleToken } from "../contracts/SimpleToken";
import Modal from "../components/Modal.vue";
import SvgLoader from "../components/SvgLoader.vue";
import { formatAddress } from "../services/formatAddress";

export default defineComponent({
  name: "CreateToken",
  components: {
    Modal,
    SvgLoader,
  },
  setup() {
    return {
      ...composeDeployGovToken(),
      formatAddress,
      c: (value: string | number) =>
        currency(Number(value), {
          separator: ",",
          symbol: "",
          precision: 0,
        }).format(),
    };
  },
});

function composeDeployGovToken() {
  const router = useRouter();
  const showExpandedList = ref(false);
  const tokenStatuses = ["INIT", "DEPLOYING_TEST", "DEPLOYED_TEST"];
  const tokenStatus = ref(tokenStatuses[0]);
  const metamaskAuthStatuses = [
    "INIT", //0
    "REQUESTED", //1
    "TIMEOUT", //2
    "SUCCESSFULLY_ENABLED", //3
    "UNAVAILABLE", //4
    "TX_REQUESTED", //5
    "TX_SUCCESS", //6
    "TX_REJECTED", //7
    "TX_ERROR", //8
  ];
  const errorText = ref("");
  const metamaskStatus = ref(metamaskAuthStatuses[0]);
  const simpleTokenModalDisplayed = ref(false);
  const network = ref("");
  const tokenTxHash = ref("");
  const deployedTokenAddress = ref("");
  const tokenParams = reactive({
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
  });
  const networks = { ...networkInfo };
  const networkName = computed((): string => {
    return networks[network.value].name || "Unsuported";
  });
  const isKnownNetwork = computed((): network => {
    return networks[network.value];
  });
  const blockExplorer = computed((): string => {
    return networks[network.value].blockExplorer;
  });
  const initialSupply = computed(() => {
    return getNumbersFromString(tokenParams.initialSupply);
  });
  const airdropSupply = computed(() => {
    return getNumbersFromString(tokenParams.airdropSupply);
  });
  const totalSupply = computed(() => {
    return Number(initialSupply.value) + Number(airdropSupply.value);
  });
  const parsedAddresses = computed(() => {
    const { adminAddresses } = tokenParams;
    const addresses = adminAddresses.split(",");
    if (addresses.length > 1) return addresses.map((val) => val.trim());
    return [adminAddresses].map((v) => ethers.utils.getAddress(v));
  });
  let ethereum: any = {},
    provider: providers.Provider;
  const decimalsMultiplyer = BigNumber.from("1000000000000000000");
  function toggleSimpleTokenModal() {
    checkProvider();
    simpleTokenModalDisplayed.value = !simpleTokenModalDisplayed.value;
  }
  function expandAddressList() {
    showExpandedList.value = !showExpandedList.value;
  }
  async function checkProvider() {
    tokenStatus.value = tokenStatuses[1];
    const hasEthProvider = await detectEthereumProvider();
    if (hasEthProvider) {
      ethereum = (window as any).ethereum;
      provider = new ethers.providers.Web3Provider(ethereum, "any");
      ethereum.request({ method: "eth_requestAccounts" });
      const networkInfo = await provider.getNetwork();
      network.value = networkInfo.chainId.toString();
      provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          network.value = newNetwork.chainId;
        }
      });
      metamaskStatus.value = metamaskAuthStatuses[3];
      tokenStatus.value = tokenStatuses[2];
    } else {
      metamaskStatus.value = metamaskAuthStatuses[4];
    }
  }
  async function deployToken() {
    tokenStatus.value = tokenStatuses[3];
    //@ts-ignore the lies
    const signer = provider.getSigner();
    let token: SimpleToken | TimedMintToken | undefined;
    if (tokenParams.minting === "false") {
      token = await deploySimpleToken(signer);
    } else if (tokenParams.minting === "true") {
      token = await deployTimedMintToken(signer);
    } else {
      return;
    }
    const tokenRequest = await storeTokenData();
    const tokenResponse = await tokenRequest.json();
    metamaskStatus.value = metamaskAuthStatuses[5];
    if (token) {
      await token.deployed();
      await router.push({
        path: "/token-success",
        query: { tokenId: tokenResponse.token.id },
      });
    }
  }

  async function deploySimpleToken(signer: Signer) {
    console.groupCollapsed("tokenInfo");
    console.log("Deploying Simple Token v0.1.0");
    let simpleToken: SimpleToken;
    try {
      simpleToken = await new SimpleTokenFactory(signer).deploy(
        BigNumber.from(initialSupply.value).mul(decimalsMultiplyer),
        BigNumber.from(airdropSupply.value).mul(decimalsMultiplyer),
        ethers.utils.getAddress(tokenParams.vaultAddress),
        tokenParams.tokenName,
        tokenParams.tokenSymbol,
        parsedAddresses.value.map((v) => ethers.utils.getAddress(v))
      );
      tokenTxHash.value = simpleToken.deployTransaction.hash;
      deployedTokenAddress.value = simpleToken.address;
      console.groupEnd();
      return simpleToken;
    } catch (err: any) {
      console.error(err);
      metamaskStatus.value = metamaskAuthStatuses[8];
      errorText.value = err;
      console.groupEnd();
    }
  }

  async function deployTimedMintToken(signer: Signer) {
    console.groupCollapsed("tokenInfo");
    console.log("Deploying Timed Mint Token v0.1.0");
    let timedMintToken: TimedMintToken;
    let maxSupply: BigNumber;
    if (tokenParams.supplyCap === "false") {
      maxSupply = BigNumber.from(0);
    } else {
      maxSupply = BigNumber.from(tokenParams.maxSupply).mul(decimalsMultiplyer);
    }
    try {
      timedMintToken = await new TimedMintTokenFactory(signer).deploy(
        BigNumber.from(initialSupply.value).mul(decimalsMultiplyer), //vault
        BigNumber.from(airdropSupply.value).mul(decimalsMultiplyer), //airdrop
        maxSupply, //supplycap
        ethers.utils.getAddress(tokenParams.vaultAddress), //vault
        BigNumber.from(tokenParams.timeDelay).mul(BigNumber.from(86400)), //timeDelay
        BigNumber.from(tokenParams.mintCap).mul(decimalsMultiplyer), //mintCap
        tokenParams.tokenName,
        tokenParams.tokenSymbol,
        parsedAddresses.value.map((v) => ethers.utils.getAddress(v))
      );
      tokenTxHash.value = timedMintToken.deployTransaction.hash;
      deployedTokenAddress.value = timedMintToken.address;
      console.groupEnd();
      return timedMintToken;
    } catch (err: any) {
      console.error(err);
      metamaskStatus.value = metamaskAuthStatuses[8];
      errorText.value = err;
      console.groupEnd();
    }
  }

  async function storeTokenData() {
    return await auth.saveTokenData({
      tokenType: tokenParams.minting == "true" ? "timed_mint" : "simple",
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
    });
  }
  function submitToken() {
    toggleSimpleTokenModal();
  }
  function getNumbersFromString(str: string) {
    return str.replace(/[^0-9]/g, "");
  }
  function isEtherAddress(value: string) {
    const trimmedAddress = value.trim();
    return (
      trimmedAddress.substring(0, 2) === "0x" && trimmedAddress.length === 42
    );
  }
  function isNumberString(value: string) {
    if (value) {
      //@ts-ignore because TS doesn't know the idiosyncrasies (dumb design decisions) of JS
      return parseInt(getNumbersFromString(value)) != "Nan";
    }
    return true;
  }
  const rules = computed(() => ({
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
      isListOfAdminAddresses: (value: string) => {
        return value.split(",").every(isEtherAddress);
      },
    },
    minting: {
      required,
    },
    supplyCap: {
      required,
    },
    maxSupply: {
      isValidMaxSupply: (value: string) => {
        return (
          isNumberString(value) &&
          (value == "0" ||
            parseInt(value) >
              parseInt(getNumbersFromString(tokenParams.initialSupply)) +
                parseInt(getNumbersFromString(tokenParams.airdropSupply)))
        );
      },
    },
    timeDelay: {
      isNumberString,
    },
    mintCap: {
      isNumberString,
    },
  }));

  //@ts-ignore
  const v$ = useVuelidate(rules, tokenParams);
  const isMaxSupplyValid = computed(() => {
    return (
      //@ts-ignore
      v$.value.maxSupply.$dirty && v$.value.maxSupply.isValidMaxSupply.$invalid
    );
  });
  return {
    tokenParams,
    initialSupply,
    airdropSupply,
    totalSupply,
    submitToken,
    parsedAddresses,
    showExpandedList,
    expandAddressList,
    simpleTokenModalDisplayed,
    toggleSimpleTokenModal,
    tokenStatus,
    deployToken,
    network,
    networkName,
    v$,
    isMaxSupplyValid,
    metamaskStatus,
    tokenTxHash,
    deployedTokenAddress,
    blockExplorer,
    isKnownNetwork,
    errorText,
  };
}
</script>
