<template>
  <div
    id="profile-page"
    class="grid grid-cols-12"
  >
    <div
      id="user-info"
      class="
        col-span-12
        px-4
        pt-8
        border-r-0 border-black
        md:bg-purple-50 md:px-16 md:col-span-6 md:col-start-4 md:min-h-screen
      "
    >
      <h1 class="text-3xl font-black">
        {{ userInfo.username }}
      </h1>
      <div class="flex justify-center">
        <ImageContainer
          class="my-8"
          :tailwind-size="'h-40 w-40 md:h-52 md:w-52'"
        >
          <img
            class="h-40 w-40 md:h-52 md:w-52 object-cover"
            :src="userInfo.avatar"
            alt=""
          >
        </ImageContainer>
      </div>
      <p class="mt-8">
        {{ userInfo.about }}
      </p>
      <div class="my-12 flex flex-col">
        <h2
          v-if="links.length"
          class="font-black text-xl mb-4"
        >
          Links:
        </h2>
        <a
          class="btn mb-4 text-center"
          v-for="link in links"
          :key="link.id"
          :href="link.url"
        >{{ link.label }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useRoute } from "vue-router"
import composeUserInfo from "../composed/userInfo"
import ImageContainer from "../components/ImageContainer.vue"
import { useStore } from "vuex"
export default defineComponent({
  name: "ProfilePage",
  components: { ImageContainer },
  setup() {
    const store = useStore()
    const router = useRoute()
    const { username } = router.params
    let usernameString
    if (typeof username == "object") {
      usernameString = username[0] as string
    } else {
      usernameString = username as string
    }
    return {
      ...composeUserInfo(usernameString),
      username: usernameString,
      authUser: computed(() => store.state.authUser.user),
    }
  },
})
</script>
