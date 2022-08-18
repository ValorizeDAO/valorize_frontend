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
    <router-link
      to="/"
      class="home"
    >
      <img
        src="../assets/logo_large.png"
        alt="Valorize"
        class="h-8"
      >
    </router-link>
    <div class="sm:flex sm:h-full">
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
          sm:h-full
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
            left-0
            px-10
            py-4
            flex flex-col
            text-center
            sm:w-full
            sm:pr-6
            sm:py-0
            sm:h-full
            sm:items-center
            sm:flex-row
          "
        >
          <router-link
            to="/register"
            class="navbar-button"
          >
            Sign Up
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
            flex flex-col
            text-center
            transition
            duration-100
            sm:py-0
            sm:h-full
            sm:pr-6
            sm:flex-row
            sm:justify-center
          "
        >
          <router-link
            id="edit-profile"
            to="/dashboard"
          >
            <button
              class="navbar-button"
            >
              Dashboard
            </button>
          </router-link>
          <router-link
            id="edit-profile"
            to="/edit-profile"
          >
            <button
              class="navbar-button"
            >
              Profile
            </button>
          </router-link>
          <button
            id="logout"
            @click="logout"
            class="navbar-button"
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
<style lang="postcss" scoped>
.navbar-button {
  @apply sm:flex items-center transition ease-in-out duration-300 border-white pb-8 sm:justify-center sm:h-full sm:pb-0 sm:min-w-[8em] lg:min-w-[11em] hover:font-bold hover:px-7 sm:border-b-4 hover:sm:border-purple-900;
}
.router-link {
  @apply sm:flex items-center;
}
.router-link-exact-active{
  @apply sm:border-b-4 border-purple-900;
}
.router-link-exact-active .navbar-button {
  @apply sm:border-b-0 border-purple-900;
}
.router-link-exact-active.home{
  @apply sm:border-b-0;
}
</style>
