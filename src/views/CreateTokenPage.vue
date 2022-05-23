<template>
    <div id="banner"
      class="bg-purple-900 fixed top-20 w-full py-6 transform text-center font-bold text-white flex justify-between items-center duration-1000"
      :class="{ '-translate-y-48': !shouldShowBanner }"
    >
      <div class="px-12"> </div>
      <div>
        We Offer Consultation Services to Help You Plan Your Token!
        <router-link to="/beta-signup" class="mx-8">
          <button class="bg-white font-normal p-2 rounded-sm text-black">
            Find Out More
          </button>
        </router-link>
      </div>
      <button class="px-8" @click="shouldShowBanner = false">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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
      <CreateToken />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import CreateToken from "../components/CreateToken.vue"
import { useStore } from "vuex"

export default defineComponent({
  name: "EditProfilePage",
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
  const fullName = ref(userInfo.name)
  const about = ref(userInfo.about)
  const hasToken = store.getters["authUser/hasToken"]
  const isAllowedUser = ref(store.state.authUser.user.isAlphaUser)

  return {
    fullName,
    about,
    hasToken,
    isAllowedUser,
  }
}
</script>

<style scoped lang="postcss">
</style>
