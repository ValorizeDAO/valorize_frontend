<template>
  <div class="bg-purple-50 mt-20">
    <div class="max-w-sm mx-auto pt-24 px-6 md:px-0">
      <h1 class="font-black text-3xl">
        Reset Password
      </h1>
      <div class="my-8">
        <form
          @submit.prevent="resetPassword"
          class="my-12"
        >
          <label
            for="name"
            class=""
          >
            <span class="text-xl font-black">New Password</span>
          </label>
          <input
            type="password"
            name="name"
            id="name"
            class="
              p-2
              mb-12
              w-full
              border-0 border-b-2 border-black
              bg-purple-50
            "
            v-model="password"
          >
          <label
            for="password"
            class="mt-24"
          >
            <span class="text-xl font-black">Re-Type Password</span>
          </label>
          <input
            type="password"
            name="password"
            class="p-2 w-full border-0 border-b-2 border-black bg-purple-50"
            id="password2"
            v-model="password2"
          >
          <div class="flex justify-center mt-8">
            <input
              type="submit"
              class="btn bg-purple-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
              :disabled="!enteredPasswordsMatch"
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import authentication from "../services/authentication"
const router = useRouter()
const route = useRoute()
const password = ref("")
const password2 = ref("")
const enteredPasswordsMatch = computed(() => {
  return (!!password.value.length && !!password2.value.length && password.value === password2.value)
})
let credential = ""
onMounted(() => {
  route.query.credential || router.push("/")
  credential = route.query.credential as string
})
function resetPassword() {
  authentication.resetPassword(credential, password.value)
}
</script>
