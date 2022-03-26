<template>
  <div class="bg-purple-50">
    <div class="max-w-sm mx-auto pt-24 px-6 md:px-0">
      <h1 class="font-black text-3xl">Register</h1>
      <div class="my-8">
        <form @submit.prevent="sendLogin" class="my-12">
          <label for="email" class="">
            <span class="text-xl font-black">Email</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            class="
              p-2
              mb-12
              w-full
              border-0 border-b-2 border-black
              bg-purple-50
            "
            v-model="email"
          />
          <label for="username" class="">
            <span class="text-xl font-black">Username</span>
          </label>
          <input
            type="text"
            name="username"
            id="username"
            class="p-2 w-full border-0 border-b-2 border-black bg-purple-50"
            :value="displayValue"
            @input="debounceListener"
          />
          <div class="text-sm h-12">
            <transition name="fade" mode="out-in">
              <div
                v-if="debouncedValue.length > 0"
                :class="{ 'text-red-700': !userNameAvailable }"
              >
                {{
                  userNameAvailable
                    ? debouncedValue + " is available!"
                    : " * " + debouncedValue + " is not available"
                }}
              </div>
            </transition>
          </div>
          <label for="password" class="mt-36">
            <span class="text-xl font-black">Password</span>
          </label>
          <input
            type="password"
            name="password"
            class="p-2 w-full border-0 border-b-2 border-black bg-purple-50 mb-12"
            id="password"
            v-model="password"
          />
          <br />
          <label for="password-2" class="mt-24">
            <span class="text-xl font-black">Re-Enter Password</span>
          </label>
          <input
            type="password"
            name="password2"
            class="p-2 w-full border-0 border-b-2 border-black bg-purple-50"
            id="password-2"
            v-model="passwordVerify"
          />
          <br />
          <div class="mt-20">
            <transition name="fade" mode="out-in">
              <div v-if="status === 'pending'">
                <SvgLoader fill="#cecece" class="h-12 mx-auto"></SvgLoader>
              </div>
              <div v-else-if="['init', 'error', 'conflict'].includes(status)">
                <input
                  type="submit"
                  class="px-4 py-2 border-2 rounded-md font-black w-full"
                  id="submit-registration"
                  :class="
                    ready
                      ? 'text-black border-black bg-purple-50 cursor-pointer'
                      : 'cursor-not-allowed text-gray-400'
                  "
                  :disabled="!ready"
                />
                <p v-if="status === 'error'" class="text-red-800 font-bold">
                  {{ errorMessage }}
                </p>
              </div>
            </transition>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, Ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import SvgLoader from "../components/SvgLoader.vue";
import useDebounced from "../composed/useDebounced";
import { User } from "../models/User";
import auth from "../services/authentication";
import api from "../services/api";

export default defineComponent({
  name: "Register",
  components: { SvgLoader },
  setup: () => {
    const requestStatuses = ["init", "pending", "conflict", "error", "success"];
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const passwordVerify = ref("");
    const status = ref(requestStatuses[0]);
    const userNameAvailable = ref(true);
    const errorMessage = ref("");
    const hasQueryToAddUserWallet =
      route.query.redirectUri && route.query.registerAddress;

    const ready = computed(() => {
      const passwordIsNotEmpty =
        password.value != "" && passwordVerify.value != "";
      const passwordsMatch = password.value === passwordVerify.value;
      const emailIsNotEmpty = email.value !== "";

      return (
        userNameAvailable.value &&
        passwordIsNotEmpty &&
        passwordsMatch &&
        emailIsNotEmpty
      );
    });

    async function fetchUserName(usernameToTest: Ref<string>) {
      username.value = usernameToTest.value;
      api
        .get(`/api/v0/users/${usernameToTest.value}`)
        .then((response) => {
          if (response.status === 404) {
            userNameAvailable.value = true;
          } else if (response.status === 200) {
            userNameAvailable.value = false;
          } else {
          }
          return response.json();
        })
        .catch((error) => console.log(error));
    }

    async function sendLogin() {
      status.value = requestStatuses[1];
      const formdata: FormData = new FormData();
      formdata.append("username", username.value);
      formdata.append("password", password.value);
      formdata.append("email", email.value);

      const requestOptions = {
        method: "POST",
        body: formdata,
        credentials: "include",
      } as RequestInit;

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/register",
        requestOptions
      );
      if (response.status === 409) {
        status.value = requestStatuses[2];
      } else if (response.status === 201) {
        status.value = requestStatuses[4];
        const result = (await response.json()) as User | { error: string };
        store.commit("authUser/setUser", result);
        if (hasQueryToAddUserWallet) {
          route.query.registerAddress &&
            (await auth.addExternalWalletToAccount(
              route.query.registerAddress.toString()
            ));
          route.query.redirectUri &&
            (await router.push(decodeURI(route.query.redirectUri.toString())));
        } else {
          await router.push({ path: "/edit-profile" });
        }
      } else {
        status.value = requestStatuses[3];
        const result = (await response.json()) as { error: string };
        errorMessage.value = result.error;
      }
    }

    return {
      ...useDebounced(500, fetchUserName),
      email,
      password,
      passwordVerify,
      status,
      ready,
      userNameAvailable,
      sendLogin,
      errorMessage,
    };
  },
});
</script>

<style scoped>
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
