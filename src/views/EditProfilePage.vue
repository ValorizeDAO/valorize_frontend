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
            <h1 class="text-3xl font-black sm:mb-6">
              Your Profile
            </h1>
            <h2 class="text-2xl font-black mb-4 sm:mb-0">
              {{ user.username }}
            </h2>
          </div>
          <div class="">
            <router-link
              :to="user.username"
              class="btn min-h-12 pt-1"
            >
              See Public Profile
            </router-link>
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
                  >
                </div>
                <div v-else>
                  <img
                    :src="
                      profileImage === ''
                        ? '/src/assets/img/default_avatar.png'
                        : profileImage
                    "
                    class="h-52 w-52 object-cover"
                  >
                </div>
              </ImageContainer>
            </div>
            <transition name="fade">
              <div
                v-if="pictureStatus === 'INIT' || pictureStatus === 'SUCCESS'"
              >
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
                  pictureStatus === 'PREVIEW' || pictureStatus === 'ERROR'
                "
              >
                <button
                  @click="sendPhoto"
                  class="btn w-48 my-4 bg-purple-100 mr-4"
                >
                  Save
                </button>
                <button
                  @click="resetPhoto"
                  class="btn w-48 my-4 bg-purple-100"
                >
                  Cancel
                </button>
                <div v-if="pictureStatus === 'ERROR'">
                  <span class="text-red-700 text-sm">
                    There was an error changing your photo. Try again or contact
                    us.
                  </span>
                </div>
              </div>
            </transition>
            <input
              @change="changePic"
              type="file"
              name="picture"
              id="picture-upload"
              class="sr-only"
              ref="pictureFormUpload"
            >
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
                >
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
                <button
                  :disabled="profileUpdateStatus === 'UPLOADING'"
                  class="
                    btn
                    w-48
                    mt-24
                    bg-purple-100
                    mx-auto
                    disabled:border-gray-600 disabled:text-gray-600
                  "
                >
                  Update Info
                </button>
              </div>
            </form>
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
        md:px-16 md:pt-4 md:border-l-2
        border-black
        h-full
      "
    >
      <div
        class="
              col-span-5
              lg:col-span-5 lg:col-start-5 lg:pl-8 lg:mt-16
              mt-12
              md:mt-0
            "
        :class="{ 'opacity-70': linksDeployStatus === 'DEPLOYING' }"
      >
        <h3 class="font-black text-xl mb-4">
          Add Social Media Links:
        </h3>
        <div
          v-for="(link, i) in links"
          :key="link.id"
          class="flex flex-col"
        >
          <label
            class="font-black"
          >Label:
            <input
              type="text"
              class="bg-purple-50 border-black border-b-2 w-full mb-4"
              :value="link.label"
              @input="updateLabel"
              :data-index="i"
            >
          </label>
          <label
            class="font-black"
          >Address:
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
          <button
            class="text-center"
            @click="newLink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add New Link
          </button>
        </div>
        <transition name="fade">
          <div
            v-if="links"
            class="text-center mb-24"
          >
            <button
              @click="saveLinks"
              class="btn w-48 mt-8 bg-purple-100 mx-auto"
            >
              Save Links
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue"
import auth from "../services/authentication"
import { formatAddress } from "../services/formatAddress"
import { User } from "../models/User"
import api, { TokenResponse } from "../services/api"
import { useStore } from "vuex"
import ImageContainer from "../components/ImageContainer.vue"
import DeleteLink from "../components/DeleteLink.vue"
import currency from "currency.js"

export default defineComponent({
  name: "EditProfilePage",
  props: {},
  components: {
    ImageContainer,
    DeleteLink,
  },
  setup() {
    return {
      ...composeProfileInfo(),
      ...composeUpdateImage(),
      ...composeDeployToken(),
      ...composeLinks(),
      c: (value: string | number) =>
        currency(Number(value), {
          separator: ",",
          symbol: "",
          precision: 0,
        }).format(),
    }
  },
})
function composeProfileInfo() {
  const store = useStore()
  const userInfo = store.getters["authUser/user"]
  const fullName = ref(userInfo.name)
  const about = ref(userInfo.about)
  const hasToken = store.getters["authUser/hasToken"]
  const isAllowedUser = ref(store.state.authUser.user.isAlphaUser)

  const profileUpdateStatuses = [
    "INIT",
    "EDITED",
    "UPLOADING",
    "ERROR",
    "SUCCESS",
  ]
  const profileUpdateStatus = ref(profileUpdateStatuses[0])
  async function updateProfile() {
    profileUpdateStatus.value = profileUpdateStatuses[2]
    const response = await auth.updateProfile({
      name: fullName.value,
      about: about.value,
    })
    if (response.status !== 200) {
      profileUpdateStatus.value = profileUpdateStatuses[3]
      return
    }
    profileUpdateStatus.value = profileUpdateStatuses[4]
    const userData = (await response.json()) as Promise<User>
    store.commit("authUser/setUser", userData)
  }

  return {
    updateProfile,
    fullName,
    about,
    profileUpdateStatus,
    hasToken,
    formatAddress,
    isAllowedUser,
  }
}
function composeUpdateImage() {
  const store = useStore()
  const pictureFormUpload = ref(HTMLInputElement)
  const profileImage = ref(store.state.authUser.user.avatar)
  const pictureStatuses = ["INIT", "PREVIEW", "UPLOADING", "ERROR", "SUCCESS"]
  const pictureStatus = ref<string>(pictureStatuses[0])
  const imageToUpload = ref<File>(new File([], ""))
  function changeProfile() {
    (pictureFormUpload.value as unknown as HTMLInputElement).click()
  }
  function changePic(e: Event) {
    if (e.target) {
      const inputElement = e.target as HTMLInputElement
      const files = inputElement.files
      pictureStatus.value = pictureStatuses[1]
      if (!files) {
        return
      }
      const fileReader = new FileReader()
      fileReader.addEventListener("load", (e) => {
        profileImage.value = URL.createObjectURL(files[0])
        imageToUpload.value = files[0]
      })
      fileReader.readAsArrayBuffer(files[0])
    }
  }

  async function sendPhoto() {
    pictureStatus.value = pictureStatuses[2]
    const uploadRequest = await auth.uploadPicture(imageToUpload.value)
    if (uploadRequest.status === 200) {
      pictureStatus.value = pictureStatuses[4]
      const responseJson = await ((await uploadRequest.json()) as Promise<{
        image: string;
      }>)
      const newImageUrl = responseJson.image
      profileImage.value = newImageUrl
      store.commit("authUser/setUserPicture", newImageUrl)
    } else {
      pictureStatus.value = pictureStatuses[3]
    }
  }
  function resetPhoto() {
    pictureStatus.value = pictureStatuses[0]
    profileImage.value = store.state.authUser.user.avatar
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
  }
}

function composeDeployToken() {
  const store = useStore()
  const tokenName = ref(store.state.authUser.user.username + "Coin")
  const tokenSymbol = ref("TKN")
  const modalIsOpen = ref(false)
  const tokenDeployStatuses = ["INIT", "DEPLOYING", "SUCCESS", "ERROR"]
  const tokenDeployStatus = ref(tokenDeployStatuses[0])
  const tokenTestnetTx = ref("")
  const tokenTestnetAddress = ref("")
  const checkoutLink = computed(() => {
    const encodedName = encodeURIComponent(tokenName.value)
    const encodedSymbol = encodeURIComponent(tokenSymbol.value)
    return `${
      import.meta.env.VITE_BACKEND_URL
    }/create-checkout-session?tokenName=${encodedName}&tokenSymbol=${encodedSymbol}`
  })
  function onTestDeployButtonPress() {
    if (tokenDeployStatus.value === "INIT") {
      deployToTestNet()
    }
    toggleModal()
  }
  async function deployToTestNet() {
    tokenDeployStatus.value = tokenDeployStatuses[1]
    const apiResponse = await api.deployTokenToTestNet({
      tokenName: tokenName.value,
      tokenSymbol: tokenSymbol.value,
    })
    if (apiResponse.status === 200) {
      tokenDeployStatus.value = tokenDeployStatuses[2]
      const responseJson = await (apiResponse.json() as Promise<TokenResponse>)
      tokenTestnetTx.value = responseJson.tx
      tokenTestnetAddress.value = responseJson.address
    } else {
      tokenDeployStatus.value = tokenDeployStatuses[3]
    }
  }
  function toggleModal() {
    modalIsOpen.value = !modalIsOpen.value
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
  }
}
function composeLinks() {
  const store = useStore()
  const links = ref(store.state.authUser.user.links)
  const linksDeployStatuses = ["INIT", "DEPLOYING", "SUCCESS", "ERROR"]
  const linksDeployStatus = ref(linksDeployStatuses[0])
  const showDelete = ref(false)
  function newLink() {
    links.value.push({
      label: "",
      url: "",
    })
  }
  async function deleteLink(index: number) {
    if (links.value[index].id !== undefined) {
      const response = await auth.links.delete(links.value[index])
      if (!response.success) {
        return
      }
    }
    links.value.splice(index, 1)
  }
  async function saveLinks() {
    linksDeployStatus.value = linksDeployStatuses[1]
    const response = await auth.links.update(links.value)
    if (response.success) {
      links.value = response.links
      linksDeployStatus.value = linksDeployStatuses[2]
    } else {
      linksDeployStatus.value = linksDeployStatuses[3]
    }
  }
  function updateLabel(e: Event) {
    if ((e.target as HTMLInputElement).dataset.index) {
      const index = parseInt(
        (e.target as HTMLInputElement).dataset.index as string,
      )
      links.value[index].label = (e.target as HTMLInputElement).value
    }
  }
  function updateUrl(e: Event) {
    if ((e.target as HTMLInputElement).dataset.index) {
      const index = parseInt(
        (e.target as HTMLInputElement).dataset.index as string,
      )
      links.value[index].url = (e.target as HTMLInputElement).value
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
    linksDeployStatus,
  }
}
</script>

<style scoped lang="postcss">
</style>
