<template>
  <main class="min-h-screen">
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
        <img src="./assets/logo_large.png" alt="Valorize" class="h-8" />
      </router-link>
      <div>
        <div class="sm:hidden">
          <button
            @click="triggerBlock"
            class="hamburger hamburger--slider"
            :class="showMobileMenu ? 'is-active' : ''"
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
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
            <router-link class="pb-8 sm:pb-0 sm:pr-4" id="login" to="/login"
              >Login</router-link
            >
            <router-link id="register" to="/register">Register</router-link>
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
            "
          >
            <router-link
              id="edit-profile"
              to="/edit-profile"
              class="px-4 py-2 sm:mr-4"
              >Edit Profile</router-link
            >
            <button id="logout" @click="logout" class="px-4 py-2">
              Logout
            </button>
            <!-- <router-link to="/beta-signup">
            <button class="pb-8 sm:pb-0 sm:pr-4">
              Sign Up
            </button>
          </router-link> -->
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
import { mapGetters, mapActions } from "vuex";
import { defineComponent } from "vue";
import SvgLoader from "./components/SvgLoader.vue";
import auth from "./services/authentication";
import asciiLogo from "./assets/ascii-logo";

export default defineComponent({
  name: "App",
  components: { SvgLoader },
  data() {
    return {
      showMobileMenu: false,
    };
  },
  methods: {
    ...mapActions({ logoutState: "authUser/logout" }),
    async logout() {
      this.logoutState();
    },
    triggerBlock() {
      this.showMobileMenu = !this.showMobileMenu;
    },
  },
  computed: {
    ...mapGetters({
      checkingAuth: "authUser/checkingAuth",
      authenticated: "authUser/authenticated",
      user: "authUser/user",
    }),
  },
  mounted() {
    //check if app is running in production
    console.log("VALORIZE_APP_DEPLOY_0.1.2");
    if (import.meta.env.VITE_ENV != "dev") {
      console.log(
        `%c${asciiLogo}
  %cWELCOME TO VALORIZE, 
  We are on a mission to design better incentives that improve the technology of human collaboration.
  JOIN US! https://discord.gg/3PRMWrH9DT`,
        "color: purple; font-size:10px; line-height: 12 px;",
        "color:unset; font-size: 1em"
      );
    }
  },
});
</script>

<style>
.cta_button,
.cta_button--main {
  background-color: #d6c7e8;
  border: solid 2px #23123a;
  padding: 0.4em 0.6em;
  min-width: 7em;
  cursor: pointer;
}
.cta_button--main {
  padding: 0.8em 1.2em;
  width: 10em;
}
.cta_button.disabled,
.disabled.cta_button--main {
  cursor: default;
  pointer-events: none;
}
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
  overflow: visible;
}
.hamburger:hover {
  opacity: 0.7;
}
.hamburger.is-active:hover {
  opacity: 0.7;
}
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
  background-color: #000;
}
.hamburger--slider .hamburger-inner {
  top: 2px;
}
.hamburger--slider .hamburger-inner::before {
  top: 10px;
  transition-property: transform, opacity;
  transition-timing-function: ease;
  transition-duration: 0.15s;
}
.hamburger--slider .hamburger-inner::after {
  top: 20px;
}

.hamburger--slider.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--slider.is-active .hamburger-inner::before {
  transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
  opacity: 0;
}
.hamburger--slider.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(-90deg);
}

.hamburger-box {
  width: 40px;
  height: 24px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 40px;
  height: 4px;
  background-color: #000;
  border-radius: 4px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}
.hamburger-inner::before,
.hamburger-inner::after {
  content: "";
  display: block;
}
.hamburger-inner::before {
  top: -10px;
}
.hamburger-inner::after {
  bottom: -10px;
}
</style>
