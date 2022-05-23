
<template>
  <div class="px-6 sm:px-16 py-4">
    <div class="flex w-full justify-between">
      <h1 class="text-3xl font-sans font-black">
        Welcome, {{ user.username }}!
      </h1>
      <router-link
        to="edit-profile"
        class="btn my-3 w-40 text-center bg-paper-light"
      >
        Setup Profile
      </router-link>
    </div>
    <section
      id="manage-tokens"
    >
      <h2 class="text-2xl font-black my-4">
        Your Tokens
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        <router-link
          class="
            bg-purple-300
            p-8
            border-2 border-black
            token-list-item
            drop-shadow-square
            transition
            hover:drop-shadow-square-sm hover:-translate-x-1 hover:translate-y-1
          "
          :class="userTokens.length === 1 ? 'sm:col-span-2' : 'sm:col-span-1'"
          v-for="token in userTokens"
          :id="'token-' + token.id"
          :key="token.id"
          :to="'/dashboard/token/' + token.id"
        >
          <h3 class="text-lg font-black">
            {{ token.name }} ({{ token.symbol }})
          </h3>
          <p
            v-if="token.chain_id"
            class="font-black"
          >
            Active on:
            <span class="network-name">{{
              networkInfo[token.chain_id].name
            }}</span>
          </p>
          <div class="text-center">
            <button class="btn bg-paper-light mt-2 mx-auto">
              Manage
            </button>
          </div>
        </router-link>
        <router-link
          to="/dashboard/token/create"
          class="
            bg-purple-300
            p-8
            border-2 border-black
            drop-shadow-square
            transition
            font-bold
            text-center
            flex flex-col justify-between
            items-start
            col-span-1
            hover:drop-shadow-square-sm hover:-translate-x-1 hover:translate-y-1"
          :class="userTokens.length === 0 ? 'sm:col-span-3' : 'sm:col-span-1'"
        >
          <h3 class="text-lg font-black">
            New Token
          </h3>
          <div class="self-center">
            <button class="btn bg-paper-light mx-auto">
              Create
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
import { networkInfo } from "../services/network"
export default defineComponent({
  name: "Dashboard",
  props: {},
  components: {},
  setup: () => {
    const store = useStore()
    const user = store.getters["authUser/user"]
    const userTokens = reactive([] as Token[])
    onMounted(async () => {
      const req = await auth.getTokens()
      if (req.status === 200) {
        const { tokens } = await req.json() as { tokens: Token[] }
        const filtered = tokens.filter(t => t.token_type !== "creator")
        userTokens.push(...filtered)
      }
    })
    return { store, user, userTokens, networkInfo }
  },
})
</script>

<style scoped>
</style>
