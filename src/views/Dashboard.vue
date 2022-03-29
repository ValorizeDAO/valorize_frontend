
<template>
  <div class="px-16 py-4">
    <div class="flex w-full justify-between">
      <h1 class="text-3xl font-sans font-black">
        Welcome, {{ user.username }}!
      </h1>
      <router-link
        to="edit-profile"
        class="btn  my-3 w-40 text-center bg-paper-light"
      >
        Setup Profile
      </router-link>
    </div>
    <section id="manage-tokens">
      <h2 class="text-2xl font-black my-4">
        Your Tokens
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <router-link
          to="/"
          class="col-span-1 bg-purple-300 p-8 border-2 border-black token-list-item"
          v-for="token in userTokens"
          :key="token.id"
        >
          <h3 class="text-lg font-black">
            {{ token.name }} ({{ token.symbol }})
          </h3>
          <p class="font-black">
            Active on: <span>{{ token.chain_id }}</span>
          </p>
          <div class="text-center">
            <button class="btn bg-paper-light mt-2 mx-auto">
              Manage
            </button>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue"
import { useStore } from "vuex"
import { Token } from "../models/Token"
import auth from "../services/authentication"
export default defineComponent({
  name: "Dashboard",
  props: {},
  components: { },
  setup: () => {
    const store = useStore()
    const user = store.getters["authUser/user"]
    const userTokens = reactive([] as Token[])
    onMounted(async () => {
      const req = await auth.getTokens()
      if (req.status === 200) {
        const { tokens } = await req.json()
        userTokens.push(...tokens)
      }
    })
    return { store, user, userTokens }
  },
})
</script>

<style scoped>
</style>
