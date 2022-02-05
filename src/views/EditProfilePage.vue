<template>
  <div
    id="edit-profile-page"
    class="md:grid grid-cols-12 gap-8 min-h-screen px-8 md:p-0"
  >
    <div
      id="left-pane"
      class="col-span-12 md:col-span-7 md:pl-16 xl:pr-16 pt-4 h-full"
    >
      <div class="">
        <div class="sm:flex justify-between flex-wrap">
          <div class="">
            <h1 class="text-3xl font-black sm:mb-6">Your Profile</h1>
            <h2 class="text-2xl font-black mb-4 sm:mb-0">
              {{ user.username }}
            </h2>
          </div>
          <div class="">
            <router-link :to="user.username" class="btn min-h-12 pt-1">
              See Public Profile</router-link
            >
          </div>
        </div>
        <div class="grid lg:grid-cols-9 md:gap-6">
          <div class="col-span-9 md:col-span-4">
            <div class="relative mt-6 -ml-2">
              <ImageContainer>
                <div v-if="pictureStatus === 'INIT'">
                  <img
                    :src="user.avatar"
                    alt="avatar"
                    class="h-52 w-52 object-cover"
                  />
                </div>
                <div v-else>
                  <img
                    :src="
                      profileImage === ''
                        ? '/src/assets/img/default_avatar.png'
                        : profileImage
                    "
                    class="h-52 w-52 object-cover"
                  />
                </div>
              </ImageContainer>
            </div>
            <transition name="fade">
              <div v-if="pictureStatus === 'INIT' || pictureStatus === 'SUCCESS'">
                <button
                  @click="changeProfile"
                  class="btn max-w-48 my-4 bg-purple-100"
                >
                  Change Picture
                </button>
              </div>
              <div
                class="flex justify-around"
                v-else-if="
                  pictureStatus == 'PREVIEW' || pictureStatus == 'ERROR'
                "
              >
                <button
                  @click="sendPhoto"
                  class="btn w-48 my-4 bg-purple-100 mr-4"
                >
                  Save
                </button>
                <button @click="resetPhoto" class="btn w-48 my-4 bg-purple-100">
                  Cancel
                </button>
              </div>
              <div v-else-if="pictureStatus == 'ERROR'">
                <span class="text-red-700 text-sm">
                  There was an error changing your photo. Try again or contact
                  us.
                </span>
              </div>
            </transition>
            <input
              @change="changePic"
              type="file"
              name="picture"
              id="picture-upload"
              class="sr-only"
              ref="pictureFormUpload"
            />
            <!-- <ul class="flex justify-between">
            <li class="font-black mr-3 text-lg col-span-1">Followers</li>
            <li class="font-black text-lg col-span-1">Investors</li>
          </ul> -->
          </div>
          <div class="col-span-5 pt-8 md:pl-8">
            <form @submit.prevent="updateProfile">
              <label>
                <p class="font-black mb-4">Your Name</p>
                <input
                  name="name"
                  type="text"
                  v-model="fullName"
                  placeholder="e.g. John Doe"
                  class="bg-purple-50 border-black border-b-2 w-full"
                />
              </label>
              <label>
                <p class="font-black mt-8">Your Bio</p>
                <textarea
                  name="about"
                  type="textarea"
                  cols="50"
                  rows="10"
                  v-model="about"
                  placeholder="Something about yourself"
                  class="block bg-purple-50 border-black border-b-2 w-full h-36"
                />
              </label>
              <div class="text-center">
                <button :disabled="profileUpdateStatus === 'UPLOADING'" class="btn w-48 mt-24 bg-purple-100 mx-auto disabled:border-gray-600 disabled:text-gray-600">
                  Update Info
                </button>
              </div>
            </form>
          </div>
          <div class="col-span-5 lg:col-span-5 lg:col-start-5 lg:pl-8 lg:mt-16 mt-12 md:mt-0" :class="{'opacity-70': linksDeployStatus === 'DEPLOYING'} ">
            <h3 class="font-black text-xl mb-4">Links:</h3>
            <div v-for="(link, i) in links" :key="link.id" class="flex flex-col">
              <label class="font-black">Label:
                <input 
                  type="text"
                  class="bg-purple-50 border-black border-b-2 w-full mb-4" 
                  :value="link.label"
                  @input="updateLabel"
                  :data-index="i"
                >
              </label>
              <label class="font-black">Address: 
              <input 
                type="text" 
                class="bg-purple-50 border-black border-b-2 w-full" 
                :value="link.url"
                @input="updateUrl"
                :data-index="i"
              >
              </label>
              <div class="text-right my-4">
                <DeleteLink 
                  :index="i"
                  @deleteLink="deleteLink"
                />
              </div>
            </div>
            <div class="text-center">
              <button class="text-center" @click="newLink">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10  mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> 
                Add New Link
              </button>
            </div>
            <transition name="fade">
              <div v-if="links.length" class="text-center mb-24">
                <button @click="saveLinks" class="btn w-48 mt-8 bg-purple-100 mx-auto">Save Links</button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div
      id="right-pane"
      class="
        col-span-12
        md:col-span-5
        pr-4
        md:px-16
        md:pt-4
        md:border-l-2
        border-black
        h-full
        md:bg-paper-light
      "
    >
      <!-- <h2 class="text-3xl font-black mb-6 mt-24 sm:mt-0">Your Token</h2> -->
    <div v-if="isAllowedUser">
      <!-- <div v-else>
        <h3 class="text-2xl font-black">{{ user.username }}'s Token</h3>
        ( not yet deployed )
        <label>
          <p class="font-black mb-4 mt-8">Token Name</p>
          <input
            type="text"
            name="tokenName"
            id="token-name"
            v-model="tokenName"
            class="bg-paper-light border-black border-b-2 w-full"
          />
        </label>
        <label>
          <p class="font-black my-4">Token Symbol</p>
          <input
            type="text"
            name="tokenSymbol"
            id="token-tiker"
            v-model="tokenSymbol"
            placeholder="e.g TKN"
            class="bg-paper-light border-black border-b-2 w-full"
          />
        </label>
        <div class="text-center">
          <p class="my-8">(Get 1000 of this token by deploying the contract)</p>
          <button
            @click="onTestDeployButtonPress"
            class="btn w-48 my-4 bg-paper-darker"
          >
            Test Deploy {{ tokenSymbol }}
          </button>
        </div>
      </div> -->
      <div>
        <form>
          <h2 class="text-3xl font-black">Launch A Token</h2>
          <div class="flex justify-between mt-20">
            <label class="text-l font-black flex flex-col" for="">Name
              <input v-model="v$.name.$model" name="tokenName" placeholder="Token" class="w-full border-b-2 border-black bg-transparent mt-4 placeholder:font-bold" type="text"/>
            </label>
            <div class="mx-4"> </div>
            <label class="text-l font-black flex flex-col" for="">Symbol
              <input v-model="v$.symbol.$model" name="tokenSymbol" placeholder="TKN" class="w-full border-b-2 border-black bg-transparent mt-4 placeholder:font-bold" type="text"/>
            </label>
          </div>
          <div class="mt-8">
            <label class="text-l font-black">Supply For Vault<input v-model="v$.initialSupply.$model" name="initialSupply" placeholder="5,000,000" class="w-full border-b-2 border-black bg-transparent placeholder:font-bold" type="text"/></label>
          </div>
          <div class="mt-8">
            <label class="text-l font-black">
							Vault Address
							<input 
								v-model="v$.vaultAddress.$model" 
								name="vaultAddress" 
								placeholder="0x..." 
								class="w-full border-b-2 border-black bg-transparent placeholder:font-bold" 
								type="text"
							/></label>
              <span v-if="v$.vaultAddress.$dirty && v$.vaultAddress.$invalid">Please enter a valid Ethereum address</span>
          </div>
          <div class="mt-8">
            <label class="text-l font-black">Supply for Airdrop<input v-model="v$.airdropSupply.$model" name="airdropSupply" placeholder="5,000,000" class="w-full border-b-2 border-black bg-transparent placeholder:font-bold" type="text"/></label>
          </div>
          <div class="mt-8">
            <label class="text-l font-black" for="admin-addresses">Administrators' Addresses</label>
            <p class="mb-4 text-s">Insert list separated by commas</p>
            <input v-model="v$.adminAddresses.$model" id="admin-addresses" name="adminAddresses" class="w-full border-b-2 border-black bg-transparent placeholder:font-bold" type="text"/>
            <span v-if="v$.adminAddresses.$dirty && v$.adminAddresses.$invalid">Please enter a valid Ethereum addresses separated by commas</span>
          </div>
          <div class="mt-8 flex justify-between">
            <p class="text-l font-black" for="">Minting Allowed</p>
            <div>
              <input type="radio" id="minting-no" name="minting" v-model="v$.minting.$model" :checked="v$.minting.$model === 'false'" value="false"><label for="minting-no" class="mr-4">No</label>
              <input type="radio" id="minting-yes" name="minting" v-model="v$.minting.$model" :checked="v$.minting.$model ==='true'" value="true"><label for="minting-yes">Yes</label>
            </div>
          </div>
          <transition name="fade">
            <div v-if="v$.minting.$model === 'true'">
              <div class="mt-8">
                <label class="text-l font-black">Max Supply
                  <input 
                    v-model="v$.maxSupply.$model" 
                    id="maxSupply" 
                    name="maxSupply" 
                    class="w-full border-b-2 border-black bg-transparent" 
                    type="text"
								/>
                </label>
              </div>
							<div class="mt-8">
								<label class="text-l font-black">Days Between Mints
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
								<label class="text-l font-black">Tokens to Mint Per Mint Period
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
            <input type="submit" 
									 class="btn w-48 mt-4 bg-purple-50 disabled:cursor-not-allowed" 
									 :class="{'bg-gray-300 text-slate-600 border-slate-600': v$.$invalid}" 
									 :disabled="v$.$invalid"
									 @click.prevent="submitToken">
						<span v-if="v$.$anyDirty && v$.$invalid" class="my-4">All Fields Required</span>
          </div>
        </form>
      </div>
      <Modal body-class="bg-white xl:w-7/12 sm:mt-0" :modal-is-open="simpleTokenModalDisplayed" @toggle="toggleSimpleTokenModal">
        <div class="flex items-center justify-between pb-4 border-black border-b-2">
          <h2 class="text-xl font-black">
            Token Summary
          </h2>
          <transition name="fade" mode="out-in">
            <div v-if="tokenStatus === 'DEPLOYING_TEST'">
              <SvgLoader class="text-center mx-auto h-8" fill="#"></SvgLoader>
            </div>
            <button v-else-if="tokenStatus === 'DEPLOYED_TEST'" class="btn flex">View On Testnet
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </transition>
        </div>
        <div class="mt-4">
          <h1 class="text-3xl font-black mb-8">{{ tokenParams.name }} ({{ tokenParams.symbol }})</h1>
          <div class="flex justify-between">
            <h2 class="font-black text-xl">Initial Supply</h2>
            <span class="text-xl font-black">{{ c(totalSupply) }}</span>
          </div>
          Breakdown:
          <div class="flex justify-between items-center">
            <span class="text-sm ml-8">To be sent to: "{{ tokenParams.vaultAddress }}"</span>
            <span class="text-l font-black text-gray-700">{{ c(tokenParams.initialSupply) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm ml-8">Reserved for Airdrops</span>
            <span class="text-l font-black text-gray-700">{{ c(tokenParams.airdropSupply) }}</span>
          </div>
          <div class="flex justify-between items-center border-b-2 border-black pb-2">
            <span class="text-sm ml-8 font-black">Total</span>
            <span class="text-l font-black border-t-2 border-black ">{{ c(totalSupply) }}</span>
          </div>
          <div v-if="tokenParams.minting === 'true'">
            <div class="flex justify-between border-b-2 border-black py-2">
              <h2 class="text-xl font-black">Max Supply</h2>
              <span class="text-xl font-black">{{ c(tokenParams.maxSupply) }}</span>
            </div>
            <div v-if="tokenParams.minting === 'true'" class="flex justify-between border-b-2 border-black py-2">
              <h2 class="text-xl font-black">Time Between Minting Periods</h2>
              <span class="text-xl font-black">{{ tokenParams.timeDelay }} Days</span>
            </div>
            <div v-if="tokenParams.minting === 'true'" class="flex justify-between border-b-2 border-black py-2">
              <h2 class="text-xl font-black">Tokens to Mint Per Minting Periods</h2>
              <span class="text-xl font-black">{{ c(tokenParams.mintCap) }}</span>
            </div>
          </div>
          <div class="justify-between border-b-2 border-black py-2">
            <h2 class="text-xl font-black">Administrators</h2>
            <ul class="flex flex-col">
              <div v-for="address in parsedAddresses.slice(0, 3)">
                <li class="w-100">{{ address }}</li>
              </div>
              <div v-if="parsedAddresses.length > 3" >
                <transition name="fade">
                  <div v-if="showExpandedList">
                    <li   
                      class="w-100"
                      v-for="address in parsedAddresses.slice(3)"
                    >{{ address }}</li> 
                  </div>
                </transition>
                <button @click="expandAddressList">
                  <span v-if="!showExpandedList">
                    +{{parsedAddresses.length - 3}} More... See All
                  </span>
                  <span v-else>
                    See Less
                  </span>
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
            <div v-else-if="metamaskStatus === 'TX_ERROR'">
              There was an error, please check the parameters and try again <br>
            </div>
            <div v-else-if="metamaskStatus === 'SUCCESSFULLY_ENABLED' || metamaskStatus === 'Tx_REJECTED'">
              <button class="btn text-center" @click="deployToken">
                <span class="px-8">Deploy to {{ networkName }}</span>
              </button>
            </div>
            <div v-else-if="metamaskStatus === 'UNAVAILABLE'">
              To launch a token, you need a web3 provider such as
              <a href="https://metamask.io/" class="font-black underline"
                >Metamask</a
              >
            </div>
            <div class="text-center" v-else-if="metamaskStatus === 'TX_REQUESTED'">
              Contract launching, <br>
              <a 
                v-if="isKnownNetwork"
                :href="blockExplorer + 'tx/' + tokenTxHash" 
                target="_blank"
                class="font-black border-black border-b-2 pt-2"
              >See transaction: {{ formatAddress(tokenTxHash) }}
              </a>
              <span v-else>Tx hash: {{ tokenTxHash }}</span>
              <SvgLoader class="text-center mx-auto h-12 pt-4" fill="#"></SvgLoader>
            </div>
            <div class="text-center" v-else-if="metamaskStatus === 'TX_SUCCESS'">
              Success! <br>
              <a 
                v-if="isKnownNetwork"
                :href="blockExplorer + 'address/' + deployedTokenAddress" 
                target="_blank"
                class="font-black border-black border-b-2"
              >See your token: {{ formatAddress(deployedTokenAddress) }}
              </a>
              <span v-else>Your token is now live in address: {{deployedTokenAddress }}</span>
            </div>
          </transition>
        </div>
      </Modal>
      <Modal :modal-is-open="modalIsOpen" @toggle="toggleModal" :body-class="['bg-paper-light']">
      <transition name="fade" mode="out-in">
        <div class="text-center" v-if="tokenDeployStatus === 'INIT'">
          <h1 class="text-2xl">
            Deploy <span class="font-black mb-12">{{ tokenName }}</span>
          </h1>
          <button @click="deployToTestNet" class="btn w-48 mt-4 bg-purple-50">
            Test Deploy {{ tokenSymbol }}
          </button>
        </div>
        
        <div
          v-else-if="tokenDeployStatus === 'ERROR'"
          class="text-center mb-12"
        >
          <h2 class="font-black text-xl">Error Deploying {{ tokenName }}</h2>
          <p class="mt-6">Try again:</p>
          <button @click="deployToTestNet" class="btn w-48 mt-4 bg-purple-50">
            Test Deploy {{ tokenSymbol }}
          </button>
        </div>
        <div v-else-if="tokenDeployStatus === 'DEPLOYING'">
          <p class="my-4 max-w-sm mx-auto">
            Coin will be on the Ropsten Ethereum test network, you will have a
            chance to confirm details there
          </p>
          <SvgLoader class="text-center mx-auto h-12" fill="#"></SvgLoader>
        </div>
        <div
          v-else-if="tokenDeployStatus === 'SUCCESS'"
          class="text-center my-6"
        >
          <h1 class="text-2xl font-black">
            Woo! You can now review the test version of {{ tokenName }}!
          </h1>
          <p class="my-6">
            Here is the launching transaction:<br />
            <a
              class="font-black underline text-center text-lg"
              :href="'https://ropsten.etherscan.io/tx/' + tokenTestnetTx"
              target="_blank"
            >
              {{ formatAddress(tokenTestnetTx) }}
            </a>
          </p>
          <p>
            And this is the deployed test contract:<br />
            <a
              class="font-black underline text-center text-lg"
              :href="
                'https://ropsten.etherscan.io/address/' + tokenTestnetAddress
              "
              target="_blank"
            >
              {{ formatAddress(tokenTestnetAddress) }} </a
            ><br />(Takes a minute to appear)
          </p>
          <p class="mt-12 lg:w-2/5 mb-4 mx-auto">
            The links above are on the ropsten test network, a playground to
            verify how your tokens will work once they are live on the main
            ethereum network (Mainnet).
          </p>
          <a :href="checkoutLink">
            <div class="btn md:2/3 lg:w-1/3 mx-auto bg-purple-100 mb-12">
              Deploy on Ethereum for $10
            </div>
          </a>
        </div>
      </transition>
      </Modal>
    </div>
    <div v-else class="flex justify-center my-24">
      You are on the waiting list for deploying tokens
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, computed, onMounted, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import auth from "../services/authentication";
import { formatAddress } from "../services/formatAddress";
import { User } from "../models/User";
import api, { TokenResponse } from "../services/api";
import { useStore } from "vuex";
import SvgLoader from "../components/SvgLoader.vue";
import ImageContainer from "../components/ImageContainer.vue";
import TokenInfoComponent from "../components/TokenInfoComponent.vue";
import Modal from "../components/Modal.vue";
import DeleteLink from "../components/DeleteLink.vue";
import { Link } from "../models/Link";
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { SimpleTokenFactory } from "../contracts/SimpleTokenFactory"
import { TimedMintTokenFactory } from "../contracts/TimedMintTokenFactory"
import { TimedMintToken } from "../contracts/TimedMintToken";
import { SimpleToken } from "../contracts/SimpleToken";
import { ethers, utils, BigNumber, Signer, providers } from "ethers";
import currency from "currency.js";
import detectEthereumProvider from '@metamask/detect-provider';


export default defineComponent({
  name: "EditProfilePage",
  props: {},
  components: { SvgLoader, ImageContainer, TokenInfoComponent, Modal, DeleteLink },
  setup() {

    return {
      ...composeProfileInfo(),
      ...composeUpdateImage(),
      ...composeDeployToken(),
      ...composeLinks(),
      ...composeDeployGovToken(),
      c: (value: currency) => currency(Number(value), { separator: ",", symbol:'', precision: 0 }).format()
    }
  },
});
function composeProfileInfo() {
  const store = useStore();
  const fullName = ref(store.state.authUser.user.name);
  const about = ref(store.state.authUser.user.about);
  const links = ref(store.state.authUser.user.links);
  const hasToken = store.getters["authUser/hasToken"];
  const isAllowedUser = ref(store.state.authUser.user.isAlphaUser);

  const profileUpdateStatuses = [
    "INIT",
    "EDITED",
    "UPLOADING",
    "ERROR",
    "SUCCESS",
  ];
  const profileUpdateStatus = ref(profileUpdateStatuses[0]);
  async function updateProfile() {
    profileUpdateStatus.value = profileUpdateStatuses[2];
    const response = await auth.updateProfile({
      name: fullName.value,
      about: about.value,
    });
    if (response.status !== 200) {
      profileUpdateStatus.value = profileUpdateStatuses[3];
      return;
    }
    profileUpdateStatus.value = profileUpdateStatuses[4];
    const userData = (await response.json()) as Promise<User>;
    store.commit("authUser/setUser", userData);
  }

  return {
    updateProfile,
    fullName,
    about,
    links,
    profileUpdateStatus,
    hasToken,
    formatAddress,
    isAllowedUser,
  };
}
function composeUpdateImage() {
  const store = useStore();
  const pictureFormUpload = ref(HTMLInputElement);
  const profileImage = ref(store.state.authUser.user.avatar);
  const pictureStatuses = ["INIT", "PREVIEW", "UPLOADING", "ERROR", "SUCCESS"];
  const pictureStatus = ref<string>(pictureStatuses[0]);
  const imageToUpload = ref<File>(new File([], ""));
  function changeProfile() {
    (pictureFormUpload.value as unknown as HTMLInputElement).click();
  }
  function changePic(e: Event) {
    if (e.target) {
      const inputElement = e.target as HTMLInputElement;
      const files = inputElement.files;
      pictureStatus.value = pictureStatuses[1];
      if (!files) {
        return;
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (e) => {
        profileImage.value = URL.createObjectURL(files[0]);
        imageToUpload.value = files[0];
      });
      fileReader.readAsArrayBuffer(files[0]);
    }
  }

  async function sendPhoto() {
    pictureStatus.value = pictureStatuses[2];
    const uploadRequest = await auth.uploadPicture(imageToUpload.value);
    if (uploadRequest.status == 200) {
      pictureStatus.value = pictureStatuses[4];
      const responseJson = await ((await uploadRequest.json()) as Promise<{
        image: string;
      }>);
      const newImageUrl = responseJson.image
      profileImage.value = newImageUrl;
      store.commit("authUser/setUserPicture", newImageUrl);
    } else {
      pictureStatus.value = pictureStatuses[3];
    }
  }
  function resetPhoto() {
    pictureStatus.value = pictureStatuses[0];
    profileImage.value = store.state.authUser.user.avatar;
  }
  return {
    pictureFormUpload,
    pictureStatus,
    profileImage,
    changeProfile,
    changePic,
    sendPhoto,
    resetPhoto,
    user: store.state.authUser.user,
  };
}

function composeDeployGovToken() {
  const router = useRouter();
  const showExpandedList = ref(false)
  const tokenStatuses = ['INIT', 'DEPLOYING_TEST', 'DEPLOYED_TEST']
  const tokenStatus = ref(tokenStatuses[0])
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
  const metamaskStatus = ref(metamaskAuthStatuses[0]);
  const simpleTokenModalDisplayed = ref(false)
  const network = ref('')
  const tokenTxHash = ref('')
  const deployedTokenAddress = ref('')
  const tokenParams = reactive({
    name: '',
    symbol: '',
    initialSupply: '',
    vaultAddress: '',
    airdropSupply: '',
    adminAddresses: '',
    minting: 'false',
    maxSupply: '',
    timeDelay: 0,
    mintCap: ''
  })
  interface networks {
    [id: string]: network 
  }
  interface network {
    name: string;
    blockExplorer: string;
  }
  const networks: networks = {
    "1": {
      name: "Ethereum",
      blockExplorer: "https://etherscan.io/"
    },
    "3": {
      name: "Ropsten Testnet",
      blockExplorer: "https://ropsten.etherscan.io/"
    },
    "137": {
      name: "Polygon",
      blockExplorer: "https://polygonscan.com/"
    },
    "10": {
      name: "Optimism",
      blockExplorer: "https://optimistic.etherscan.io/"
    },
    "421611": {
      name: "Arbitrum Testnet",
      blockExplorer: "https://testnet.arbiscan.io/"
    }, 
    "42161": {
      name: "Arbitrum",
      blockExplorer: "https://arbiscan.io/"
    }
  }
  const networkName = computed((): string => {
    return networks[network.value].name||"Unsuported"
  })
  const isKnownNetwork = computed((): network => {
    return networks[network.value];
  })
  const blockExplorer = computed((): string => {
    return networks[network.value].blockExplorer;
  })
  const totalSupply = computed(() => {
    return Number(tokenParams.initialSupply) + Number(tokenParams.airdropSupply)
  })
  const parsedAddresses = computed(() => {
    const { adminAddresses } = tokenParams;
    const addresses = adminAddresses.split(',')
    if(addresses.length > 1) return addresses.map(val => val.trim())
    return [adminAddresses].map(v => ethers.utils.getAddress(v))
  })
  let ethereum: any = {}, provider: providers.Provider;
	const decimalsMultiplyer = BigNumber.from("1000000000000000000")
  function toggleSimpleTokenModal() {
    simpleTokenModalDisplayed.value = !simpleTokenModalDisplayed.value;
    if(tokenStatus.value === tokenStatuses[0]) {
      deployToTestnet()
    }
  }
  function expandAddressList() {
    showExpandedList.value = !showExpandedList.value
  }
  async function deployToTestnet(){
    tokenStatus.value = tokenStatuses[1] 
    const hasEthProvider = await detectEthereumProvider();
    if (hasEthProvider) {
      ethereum = (window as any).ethereum;
      provider = new ethers.providers.Web3Provider(ethereum, "any");
      ethereum.request({ method: 'eth_requestAccounts' });
      const networkInfo = await provider.getNetwork();
      network.value = networkInfo.chainId.toString();
      provider.on("network", (newNetwork, oldNetwork) => {
        if(oldNetwork) {
          network.value = newNetwork.chainId
        }
      })
      metamaskStatus.value = metamaskAuthStatuses[3];
      await api.deploySimpleTokenToTestNet({
        freeSupply: tokenParams.initialSupply,
        airdropSupply: tokenParams.airdropSupply,
        vaultAddress: tokenParams.vaultAddress,
        tokenName: tokenParams.name,
        tokenSymbol: tokenParams.symbol,
        tokenType: tokenParams.symbol,
        contractVersion: tokenParams.symbol,
        adminAddresses: parsedAddresses.value,
        chainId: network.value
      })
      tokenStatus.value = tokenStatuses[2] 
    } else {
      metamaskStatus.value = metamaskAuthStatuses[4]
    }
  }
  async function deployToken(){
    tokenStatus.value = tokenStatuses[3];
    const signer = provider.getSigner();
		let token: SimpleToken | TimedMintToken | undefined;
    if (tokenParams.minting === 'false') {
      token = await deploySimpleToken(signer);
    } else if (tokenParams.minting === 'true') {
      token = await deployTimedMintToken(signer);
    } else {
      return
    }
    const tokenRequest = await storeTokenData();
    const tokenResponse = await tokenRequest.json()
    metamaskStatus.value = metamaskAuthStatuses[5];
    if(token){
      await token.deployed();
      await router.push({ path: "/token-success", query: { tokenId: tokenResponse.token.id } });
    }
  }
  
  async function deploySimpleToken(signer: Signer) {
    console.groupCollapsed("tokenInfo")
    console.log("Deploying Simple Token v0.1.0")
    let simpleToken: SimpleToken
    try {
      simpleToken = await new SimpleTokenFactory(signer).deploy(
        BigNumber.from(tokenParams.initialSupply).mul(decimalsMultiplyer),
        BigNumber.from(tokenParams.airdropSupply).mul(decimalsMultiplyer),
        ethers.utils.getAddress(tokenParams.vaultAddress),
        tokenParams.name,
        tokenParams.symbol,
        parsedAddresses.value.map(v => ethers.utils.getAddress(v))
      );
      tokenTxHash.value = simpleToken.deployTransaction.hash
      deployedTokenAddress.value = simpleToken.address
      console.groupEnd()
      return simpleToken
    } 
    catch (err: any) {
      console.error(err)
      tokenStatus.value = tokenStatuses[8]
      console.groupEnd()
    }
  }

  async function deployTimedMintToken(signer: Signer) {
    console.groupCollapsed("tokenInfo")
    console.log("Deploying Timed Mint Token v0.1.0")
    let timedMintToken: TimedMintToken
    try {
      timedMintToken = await new TimedMintTokenFactory(signer).deploy(
        BigNumber.from(tokenParams.initialSupply).mul(decimalsMultiplyer),//vault
        BigNumber.from(tokenParams.airdropSupply).mul(decimalsMultiplyer),//airdrop
        BigNumber.from(tokenParams.maxSupply).mul(decimalsMultiplyer),	  //supplycap
        ethers.utils.getAddress(tokenParams.vaultAddress),							  //vault
        BigNumber.from(tokenParams.timeDelay).mul(BigNumber.from(86400)), //timeDelay
        BigNumber.from(tokenParams.mintCap),                              //mintCap
        tokenParams.name,
        tokenParams.symbol,
        parsedAddresses.value.map(v => ethers.utils.getAddress(v))
      );
      tokenTxHash.value = timedMintToken.deployTransaction.hash
      deployedTokenAddress.value = timedMintToken.address
      console.groupEnd()
      return timedMintToken
    } 
    catch (err: any) {
      console.error(err)
      tokenStatus.value = tokenStatuses[8]
      console.groupEnd()
    }
  }

  async function storeTokenData() {
    return await auth.saveTokenData({
      tokenType: tokenParams.minting == 'true' ? "timed_mint": "simple",
      contractVersion: "v0.1.0",
      freeSupply: tokenParams.initialSupply,
      airdropSupply: tokenParams.airdropSupply,
      vaultAddress: tokenParams.vaultAddress,
      tokenName: tokenParams.name,
      tokenSymbol: tokenParams.symbol,
      adminAddresses: tokenParams.adminAddresses,
      chainId: network.value,
      txHash: tokenTxHash.value,    
      contractAddress: deployedTokenAddress.value
    })
  }
  function submitToken() {
    toggleSimpleTokenModal()
  }
  function isEtherAddress(value: string) {
    const trimmedAddress = value.trim()
    return trimmedAddress.substring(0,2) === "0x" && trimmedAddress.length === 42
  }
  function isNumberString(value: string) {
    if (value) {
      const trimmedString = value.trim()
      return parseInt(trimmedString) != 'Nan'
    }
    return true
  }
	const rules = computed(() => ({
		name: {
			required,
			minLength: minLength(2)
		},
		symbol: {
			required,
			minLength: minLength(2)
		},
		initialSupply: {
			required,
			minLength: minLength(2)
		},
		vaultAddress: {
			required,
			isEtherAddress
		},
		airdropSupply: {
			required,
			minLength: minLength(2)
		},
		adminAddresses: {
			required,
      isListOfAdminAddresses: (value: string) => {
        return value.split(',').every(isEtherAddress)
      }
		},
		minting: {
			required,
		},
		maxSupply: {
			isNumberString
		},
		timeDelay: {
			isNumberString
		},
		mintCap: {
			isNumberString
		},
	}))
  const v$ = useVuelidate(rules, tokenParams)
  return { 
    tokenParams,
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
    metamaskStatus,
    tokenTxHash,
    deployedTokenAddress,
    blockExplorer,
    isKnownNetwork
  }
}
function composeDeployToken() {
  const store = useStore();
  const tokenName = ref(store.state.authUser.user.username + "Coin");
  const tokenSymbol = ref("TKN");
  const modalIsOpen = ref(false);
  const tokenDeployStatuses = ["INIT", "DEPLOYING", "SUCCESS", "ERROR"];
  const tokenDeployStatus = ref(tokenDeployStatuses[0]);
  const tokenTestnetTx = ref("");
  const tokenTestnetAddress = ref("");
  const checkoutLink = computed(() => {
    const encodedName = encodeURIComponent(tokenName.value);
    const encodedSymbol = encodeURIComponent(tokenSymbol.value);
    return `${
      import.meta.env.VITE_BACKEND_URL
    }/create-checkout-session?tokenName=${encodedName}&tokenSymbol=${encodedSymbol}`;
  });
  function onTestDeployButtonPress() {
    if (tokenDeployStatus.value === "INIT") {
      deployToTestNet();
    }
    toggleModal();
  }
  async function deployToTestNet() {
    tokenDeployStatus.value = tokenDeployStatuses[1];
    const apiResponse = await api.deployTokenToTestNet({
      tokenName: tokenName.value,
      tokenSymbol: tokenSymbol.value,
    });
    if (apiResponse.status == 200) {
      tokenDeployStatus.value = tokenDeployStatuses[2];
      const responseJson = await (apiResponse.json() as Promise<TokenResponse>);
      tokenTestnetTx.value = responseJson.tx;
      tokenTestnetAddress.value = responseJson.address;
    } else {
      tokenDeployStatus.value = tokenDeployStatuses[3];
    }
  }
  function toggleModal() {
    modalIsOpen.value = !modalIsOpen.value;
  }
  return {
    tokenName,
    tokenSymbol,
    deployToTestNet,
    toggleModal,
    modalIsOpen,
    tokenDeployStatus,
    tokenTestnetTx,
    tokenTestnetAddress,
    checkoutLink,
    onTestDeployButtonPress,
  };
}
function composeLinks() {
  const store = useStore();
  const links = ref(store.state.authUser.user.links);
  const linksDeployStatuses = ["INIT", "DEPLOYING", "SUCCESS", "ERROR"];
  const linksDeployStatus = ref(linksDeployStatuses[0]);
  const showDelete = ref(false)
  function newLink() {
    links.value.push({
      label: "",
      url: "",
    });
  }
  async function deleteLink(index: number) {
    if (links.value[index].id !== undefined) {
      const response = await auth.links.delete(links.value[index]);
      if (!response.success) {
        return;
      }
    }
    links.value.splice(index, 1);
  }
  async function saveLinks() {
    linksDeployStatus.value = linksDeployStatuses[1];
    const response = await auth.links.update(links.value);
    if (response.success) {
      links.value = response.links;
      linksDeployStatus.value = linksDeployStatuses[2];
      return;
    } else {
      linksDeployStatus.value = linksDeployStatuses[3];
    }
  }
  function updateLabel(e:Event) {
    if ((e.target as HTMLInputElement).dataset.index) {
      const index = parseInt((e.target as HTMLInputElement).dataset.index as string);
      links.value[index].label = (e.target as HTMLInputElement).value;
    } 
  }
  function updateUrl(e:Event) {
    if ((e.target as HTMLInputElement).dataset.index) {
      const index = parseInt((e.target as HTMLInputElement).dataset.index as string);
      links.value[index].url = (e.target as HTMLInputElement).value;
    }
  }
  return {
    links,
    newLink,
    showDelete,
    deleteLink,
    saveLinks,
    updateLabel,
    updateUrl,
    linksDeployStatus
    }
}
</script>

<style scoped lang="postcss">
</style>
