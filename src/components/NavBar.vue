<template>
  <nav
    class="
      h-20
      bg-white
      border-b-2 border-black
      fixed
      top-0
      w-screen
      flex
      items-center
      px-4
      md:px-16
      justify-between
      z-10
    "
  >
    <router-link to="/">
      <img
        src="../assets/logo_large.png"
        alt="Valorize"
        class="h-8"
      >
    </router-link>
    <div>
      <div class="sm:hidden">
        <button
          @click="triggerBlock"
          class="hamburger hamburger--slider"
          :class="showMobileMenu ? 'is-active' : ''"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner" />
          </span>
        </button>
      </div>
      <div
        :class="showMobileMenu ? '' : 'hidden'"
        class="
          absolute
          left-0
          sm:relative
          bg-white
          border-b-2 border-black
          sm:border-0 sm:bg-transparent sm:block
        "
      >
        <div
          @click="triggerBlock"
          v-if="!authenticated"
          class="
            w-screen
            sm:w-full
            left-0
            px-10
            py-4
            sm:pr-6
            flex flex-col
            sm:flex-row
            text-center
          "
        >
          <router-link to="/beta-signup">
            <button
              class="
                sm:flex sm:justify-center
                pb-8
                sm:pb-0 sm:px-2
                hover:font-bold
                transition
                duration-100
              "
            >
              Sign Up To Beta
            </button>
          </router-link>
          <router-link
            class="pb-8 sm:pb-0 sm:mx-4 hover:font-bold transition duration-100"
            id="login"
            to="/login"
          >
            Login
          </router-link>
        </div>
        <div
          v-else
          @click="triggerBlock"
          class="
            w-screen
            sm:w-full
            left-0
            px-10
            py-4
            sm:pr-6
            flex flex-col
            sm:flex-row
            text-center
            hover:font-bold
            transition
            duration-100
          "
        >
          <router-link
            id="edit-profile"
            to="/edit-profile"
          >
            <button
              class="
                sm:flex sm:justify-center
                pb-8
                sm:py-2 sm:px-2
                hover:font-bold
                transition
                duration-100
              "
            >
              Edit Profile
            </button>
          </router-link>
          <button
            id="logout"
            @click="logout"
            class="px-4 py-2 hover:font-bold transition duration-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapGetters } from "vuex"
export default defineComponent({
  name: "NavBar",
  data() {
    return {
      showMobileMenu: false,
    }
  },
  methods: {
    ...mapActions({ logoutState: "authUser/logout" }),
    async logout() {
      this.logoutState()
      this.$router.push("/")
    },
    triggerBlock() {
      this.showMobileMenu = !this.showMobileMenu
    },
  },
  computed: {
    ...mapGetters({
      checkingAuth: "authUser/checkingAuth",
      authenticated: "authUser/authenticated",
      user: "authUser/user",
    }),
  },
})
</script>
