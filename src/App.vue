<template>
  <main class="min-h-screen">
    <nav
      class="
        h-20
        bg-white
        border-b-2 border-black
        absolute
        w-screen
        flex
        items-center
        px-16
        justify-between
      "
    >
      <router-link to="/">
        <img src="./assets/logo_large.png" alt="Valorize" class="h-8" />
      </router-link>
      <div>
        <div class="sm:hidden">
        <button @click="triggerBlock" class=" hamburger hamburger--slider" :class="showBlock ? 'is-active' : ''">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
        </div>
        <div :class="showBlock ? '' : 'hidden'" class="absolute sm:relative bg-white -ml-24 sm:block">
          <div v-if="!authenticated" class="p-8 mb-8 sm:pr-6 flex flex-col sm:flex-row">
            <router-link class="pr-4" to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
          </div>
          <div v-else class="px-10 py-4 sm:pr-6 flex flex-col sm:flex-row">
            <router-link to="/edit-profile" class="px-4 py-2 sm:mr-4">Edit Profile</router-link>
            <button @click="logout" class="px-4 py-2">Logout</button>
          </div>
        </div>
      </div>

    </nav>
    <div class="pt-20 min-h-screen w-screen overflow-hidden bg-purple-50">
      <div
        v-if="checkingAuth"
        class="
          flex
          items-center
          justify-center
          mt-20
          bg-purple-900
          absolute
          top-0
          left-0
          w-screen
          h-screen
          z-50
        "
      >
        <SvgLoader fill="#fff" class="h-12 mx-auto"></SvgLoader>
      </div>
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { defineComponent } from "vue";
import SvgLoader from "./components/SvgLoader.vue";
import auth from "./services/authentication";

export default defineComponent({
  name: "App",
  components: { SvgLoader },
  data() {
    return {
      showBlock: false
    }
  },
  methods: {
    ...mapMutations({ logoutState : "authUser/logout" }),
    async logout() {
      await auth.logout();
      this.logoutState()
      this.$router.push("/login");
    },
    triggerBlock() {
      this.showBlock = !this.showBlock
    }
  },
  computed: {
    ...mapGetters({
      checkingAuth: "authUser/checkingAuth",
      authenticated: "authUser/authenticated",
      user: "authUser/user",
    }),
  },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.hamburger {
  padding: 15px 15px;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible; }
.hamburger:hover {
  opacity: 0.7; }
.hamburger.is-active:hover {
  opacity: 0.7; }
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
  background-color: #000; }
.hamburger--slider .hamburger-inner {
  top: 2px; }
.hamburger--slider .hamburger-inner::before {
  top: 10px;
  transition-property: transform, opacity;
  transition-timing-function: ease;
  transition-duration: 0.15s; }
.hamburger--slider .hamburger-inner::after {
  top: 20px; }

.hamburger--slider.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(45deg); }
.hamburger--slider.is-active .hamburger-inner::before {
  transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
  opacity: 0; }
.hamburger--slider.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(-90deg); }

.hamburger-box {
  width: 40px;
  height: 24px;
  display: inline-block;
  position: relative; }

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px; }
.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
  width: 40px;
  height: 4px;
  background-color: #000;
  border-radius: 4px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease; }
.hamburger-inner::before, .hamburger-inner::after {
  content: "";
  display: block; }
.hamburger-inner::before {
  top: -10px; }
.hamburger-inner::after {
  bottom: -10px; }

</style>
