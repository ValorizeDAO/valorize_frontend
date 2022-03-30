<template>
  <div
    id="edit-profile-page"
    class="md:grid grid-cols-12 gap-8 min-h-screen px-8 bg-paper-lighter"
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
      <div v-if="isAllowedUser">
        <CreateToken />
      </div>
      <div
        v-else
        class="flex justify-center my-24"
      >
        You are on the waiting list for deploying tokens
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import CreateToken from "../components/CreateToken.vue"
import { useStore } from "vuex"

export default defineComponent({
  name: "EditProfilePage",
  props: {},
  components: {
    CreateToken,
  },
  setup() {
    return {
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
