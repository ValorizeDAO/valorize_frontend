<template>
  <div
    id="banner"
    class="bg-purple-900 fixed top-20 w-full py-6 transform text-center font-bold text-white flex justify-between items-center duration-1000"
    :class="{ '-translate-y-48': !shouldShowBanner }"
  >
    <div class="px-12" />
    <div>
      Not sure about the process? We can help. <br class="lg:hidden">
      <a
        :href="callSignupUrl"
        class="mx-8"
      >
        <button class="bg-white font-normal p-2 rounded-sm text-black  mt-4 lg:mt-0">
          Book a free call
        </button>
      </a>
    </div>
    <button
      class="px-8"
      @click="shouldShowBanner = false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
  <div
    id="edit-profile-page"
    class="md:grid grid-cols-12 gap-8 min-h-screen px-8 bg-paper-lighter block"
  >
    <div
      id="right-pane"
      class="
        col-span-12
        md:col-span-10
        md:col-start-2
        xl:col-span-6
        xl:col-start-4
        pr-4
        pt-8
        md:px-16 md:pt-12 md:border-x-2
        border-black
        h-full
        md:bg-paper-light
      "
    >
      <CreateToken @tokenUpdated="onTokenUpdated" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue"
import CreateToken from "../components/CreateToken.vue"
import { useStore } from "vuex"
import { TokenParams, isTokenParams } from "../models/Token"

export default defineComponent({
  name: "CreateTokenPage",
  props: {},
  components: {
    CreateToken,
  },
  setup() {
    const shouldShowBanner = ref(false)
    onMounted(() => {
      setTimeout(() => {
        shouldShowBanner.value = true
      }, 7000)
    })
    return {
      shouldShowBanner,
      ...composeProfileInfo(),
    }
  },
})
function composeProfileInfo() {
  const store = useStore()
  const userInfo = store.getters["authUser/user"]
  const tokenInfo = ref({}) as Ref<TokenParams>
  const fullName = ref(userInfo.name)
  const about = ref(userInfo.about)
  const hasToken = store.getters["authUser/hasToken"]

  const callSignupUrl = computed(() => {
    return `https://z097733a167.typeform.com/to/RNBCAQwg#email=${userInfo.email}&token_data=${JSON.stringify(tokenInfo.value)}`
  })

  function onTokenUpdated(e:unknown) {
    if (isTokenParams(e)) {
      tokenInfo.value = e as TokenParams
    }
  }

  return {
    fullName,
    about,
    hasToken,
    tokenInfo,
    callSignupUrl,
    onTokenUpdated,
  }
}
</script>

<style scoped lang="postcss">
</style>
