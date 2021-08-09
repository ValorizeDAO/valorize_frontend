<template>
  <div id="profile-page" class="grid grid-cols-12">
    <div id="user-info" class="col-span-12  px-4 pt-8 border-r-2 border-black md:bg-purple-200  md:px-16 md:col-span-5 md:min-h-screen">
      <h1 class="text-3xl font-black">{{ userInfo.username }}</h1>
      <ImageContainer class="my-8">
        <img class="h-52 w-52 object-cover" :src="userInfo.avatar" alt="">
      </ImageContainer>
      <p class="mt-8">{{ userInfo.about }}</p>
    </div>
    <div class="pt-8 border-black px-4 col-span-12 md:col-span-7 md:px-16 md:min-h-screen">
      <div v-if="userInfo.hasDeployedToken">
        <TokenInfoComponent :username="username"/>
        <h2 class="text-2xl font-black mt-12 mb-6">What can you do with a CreatorToken?</h2>
        <p>Creator Tokens are <a href="https://101blockchains.com/what-is-erc20/" class="underline">ERC20 Compliant</a> tokens that
          Live on the Ethereum BlockChain. You can buy sell, trade, gift and use them for whatever you like.
        </p>
        <p class="mb-12">
          To create more tokens, you have to deposit Eth into the contract above, functionality to do that is coming
          soon!
        </p>
        </div>
        <div v-else>
          <div v-if="state.loggedInUserInfo.username === username">
            <h2 class="text-2xl font-black mt-12 mb-6">Looks like you have not deployed your token yet</h2>
            <p>If you have just deployed your token, please check in a few minutes</p>
          </div>
          <div v-else>
            <h2 class="text-2xl font-black mt-12 mb-6">Looks like this user has not deployed a token yet</h2>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onUnmounted, ref, Ref } from "vue";
import { useRoute } from 'vue-router';
import composeUserInfo from "../composed/userInfo"
import ImageContainer from "../components/ImageContainer.vue";
import TokenInfoComponent from "../components/TokenInfoComponent.vue"
import { useStore } from "vuex";
import { User } from "../models/User"
import store from "../vuex/store"
export default defineComponent({
  name: 'ProfilePage',
  components: { ImageContainer, TokenInfoComponent },
  setup() {
    const store = useStore()
    const router = useRoute()
    const state = reactive({
      loggedInUserInfo: useVuex<User>(() => store.getters["authUser/user"])
    })
    const { username } = router.params
    let usernameString
    if (typeof username == "object") {
      usernameString = username[0] as string
    } else {
      usernameString = username as string
    }
    return {
      ...composeUserInfo(usernameString),
      username,
      state
    }
  }
})
function useVuex<T> (getState: () => T): Ref<T> {
  const data = ref<T>(getState()) as Ref<T>
  const unwatch = store.watch<T>(
    getState,
    (newVal: T) => {
      data.value = newVal
    }
  )
  onUnmounted(() => {
    unwatch()
  })
  return data
}
</script>
