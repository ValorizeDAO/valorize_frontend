<template>
  <div id="profile-page" class="grid grid-cols-12">
    <div
      id="user-info"
      class="
        col-span-12
        px-4
        pt-8
        border-r-0 border-black
        md:bg-purple-200
        md:border-r-2
        md:px-16
        md:col-span-5
        md:min-h-screen
      "
    >
      <h1 class="text-3xl font-black">{{ userInfo.username }}</h1>
      <div class="flex justify-center">
        <ImageContainer
          class="my-8"
          :tailwindSize="'h-40 w-40 md:h-52 md:w-52'"
        >
          <img
            class="h-40 w-40 md:h-52 md:w-52 object-cover"
            :src="userInfo.avatar"
            alt=""
          />
        </ImageContainer>
      </div>
      <p class="mt-8">{{ userInfo.about }}</p>
      <div class="my-12 flex flex-col">
        <h2 v-if="links.length" class="font-black text-xl mb-4">Links:</h2>
        <a
          class="btn mb-4 text-center"
          v-for="link in links"
          :key="link.id"
          :href="link.url"
          >{{ link.label }}</a
        >
      </div>
    </div>
    <div
      class="
        pt-8
        border-black
        px-4
        col-span-12
        md:col-span-7
        md:px-16
        md:min-h-screen
      "
    >
      <div v-if="userInfo.hasDeployedToken">
        <h2 class="text-3xl font-black mb-4">Buy {{ username }}'s Token</h2>
        <TokenInfoComponent :username="username" />
        <h2 class="text-2xl font-black mt-12 mb-6">What is this?</h2>
        <div class="mb-24">
          <p>
            Creator Tokens are
            <a
              href="https://101blockchains.com/what-is-erc20/"
              class="underline"
              >ERC20</a
            >
            tokens on Ethereum. Each time you buy from the contract new tokens
            get generated. The more tokens there are the more expensive it is to
            generate new tokens.
          </p>
          <p class="my-2">
            <a
              class="underline"
              href="https://tokeneconomy.co/dynamic-token-bonding-curves-41d36e43befa"
            >
              Find out more about the math that generates the tokens
            </a>
          </p>
          <router-link to="login" class="underline"
            >Get early access!</router-link
          >
        </div>
      </div>
      <div v-else>
        <div v-if="authUser.username === username">
          <h2 class="text-2xl font-black mt-12 mb-6">
            Looks like you have not deployed your token yet
          </h2>
          <p>
            If you have just deployed your token, please check in a few minutes
          </p>
        </div>
        <div v-else>
          <h2 class="text-2xl font-black mt-12 mb-6">
            Looks like this user has not deployed a token yet
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onUnmounted, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import composeUserInfo from "../composed/userInfo";
import ImageContainer from "../components/ImageContainer.vue";
import TokenInfoComponent from "../components/TokenInfoComponent.vue";
import { useStore } from "vuex";
import store from "../vuex/store";
export default defineComponent({
  name: "ProfilePage",
  components: { ImageContainer, TokenInfoComponent },
  setup() {
    const store = useStore();
    const router = useRoute();
    const { username } = router.params;
    let usernameString;
    if (typeof username == "object") {
      usernameString = username[0] as string;
    } else {
      usernameString = username as string;
    }
    return {
      ...composeUserInfo(usernameString),
      username,
      authUser: computed(() => store.state.authUser.user),
    };
  },
});
function useVuex<T>(getState: () => T): Ref<T> {
  const data = ref<T>(getState()) as Ref<T>;
  const unwatch = store.watch<T>(getState, (newVal: T) => {
    data.value = newVal;
  });
  onUnmounted(() => {
    unwatch();
  });
  return data;
}
</script>
