<template>
  <section
    id="hero"
    class="heroSection flex items-center"
  >
    <div class="flex flex-col justify-center max-w-4xl mt-28">
      <h1 class="text-5xl lg:text-7xl font-black mb-8">
        Multiply the Power of Your Community.
      </h1>
      <div class="divider" />
      <h2 class="heroSection__supportCopy">
        Launch a Token, turn your <em>community</em> into a DAO.
      </h2>
      <h2 class="heroSection__supportCopy text-center mt-8">
        It is easier than you think.
      </h2>
      <div class="p-8 mx-auto flex flex-col items-center justify-center">
        <router-link
          to="/beta-signup"
          class="cta_button text-center font-bold text-2xl"
        >
          Book a Free Call
        </router-link>
        <router-link
          to="/beta-signup"
          class="text-center font-bold text-xl mt-4 border-b-2 px-2 border-black"
        >
          Or Signup
        </router-link>
      </div>
    </div>
    <div
      class="
        lg:block
        items-center
        transform
        sm:translate-x-80
        md:translate-x-40
        xl:translate-x-20
        max-h-[60vh] max-w-[580px]
      "
    >
      <div
        class="
          productImage__section
          transform
          -translate-y-[25%]
          object-fill
          relative
        "
      >
        <img
          src="/product-screenshot1.png"
          alt="product screenshot"
          srcset=""
          class="transform translate-y-[140%] down fadeIn1"
          ref="image1"
        >
        <img
          src="/product-screenshot2.png"
          alt="product screenshot"
          srcset=""
          class="z-0 transform translate-x-0 fadeIn2"
          ref="image2"
        >
        <img
          src="/product-screenshot3.png"
          alt="product screenshot"
          srcset=""
          class="transform -translate-y-[140%] up fadeIn3"
          ref="image3"
        >
      </div>
    </div>
  </section>
  <section
    id="describe"
    class="describeSection bg-white border-4 border-black"
  >
    <div class="describeSection__heading mb-24 pt-28">
      <h2 class="text-4xl font-black">
        Choose a smart contract template. Launch a token.
      </h2>
      <h3 class="text-2xl mt-4">
        We have state of the art token templates that are used by the biggest
        DAOs in the space.
      </h3>
    </div>

    <div class="describeSection__heading--right">
      <h2 class="text-4xl font-black">
        Create rewards, aridrops, and more.
      </h2>
      <h3 class="text-2xl mt-4">
        We have easy to use tools to manage and distribute your tokens
      </h3>
      <a
        href="https://medium.com/@valorize_app/introducing-valorize-c2c3b2fcf8b"
      ><button class="cta_button mt-8">Find Out More</button></a>
    </div>
  </section>
  <section
    id="pricing"
    class="px-6 pt-12 md:px-12 lg:px-24"
  >
    <h2 class="text-4xl">
      Pricing
    </h2>
    <div class="flex flex-wrap mx-auto mt-12 justify-center">
      <div
        id="card-1"
        class="bg-white border-4 md:w-2/5 border-black p-8 md:mr-2 flex flex-col justify-between"
      >
        <h3 class="font-black text-2xl">
          Create Your Own Token
        </h3>
        <ul class="mt-4">
          <li class="mt-2">
            Use one of our templates
          </li>
          <li class="mt-2">
            Get Access To A Personalized Management Console
          </li>
          <li class="mt-2">
            Create Unlimited Airdrops for an Unlimited Amount of Users
          </li>
          <li class="mt-2">
            Manage Minting Now and Into the Future
          </li>
        </ul>
        <div class="mt-8">
          <div class="divider mt-4" />
          <div class="flex justify-between text-xl">
            <span>Price:</span><span>0.3 ETH</span>
          </div>
          <div class="text-center mt-4">
            <router-link
              to="dashboard"
              class="btn bg-purple-50 font-black p-4"
            >
              <button>Get Started</button>
            </router-link>
          </div>
        </div>
      </div>
      <div
        id="card-2"
        class="bg-white border-4 md:w-2/5 mt-4 md:mt-0 border-black p-8 flex flex-col justify-between"
      >
        <h3 class="font-black text-2xl">
          Get a Consultation
        </h3>
        <ul class="mt-4">
          <li class="mt-2">
            Get in touch to speak to experts in the field of token design
          </li>
          <li class="mt-2">
            Use our token management tools once your token is live
          </li>
        </ul>
        <div class="mt-8">
          <div class="flex justify-between text-xl">
            <span>Consultation:</span><span class="text-right">Initial Call Free</span>
          </div>
          <div class="divider my-4" />
          <div class="flex justify-between text-xl">
            <span>Cost:</span><span class="text-right">Based on Requirements</span>
          </div>
          <div class="text-center mt-4">
            <router-link
              to="beta-signup"
              class="btn bg-purple-50 font-black p-4"
            >
              <button>Book a Call</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section
    id="FAQ"
    class="faqSection"
  >
    <h2 class="text-4xl">
      FAQ
    </h2>
    <div class="divider" />
    <ul class="faqSection__accordionContainer">
      <li class="faqSection__accordion">
        <button
          class="faqSection__question"
          @click="open0"
        >
          <h3 class="faqSection__questionTitle">
            What is a Governance Token?
          </h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden0 ? '' : 'open'"
          />
        </button>
        <p
          class="faqSection__answer"
          v-show="!isHidden0"
        >
          Governance tokens are cryptocurrency contracts living on a blockchain
          like ethereum. They are used to reward, incentivize, manage, and vote
          on the future of organizations
        </p>
      </li>
      <div class="divider" />
      <li
        x-data="accordion"
        class="faqSection__accordion"
      >
        <button
          class="faqSection__question"
          @click="open1"
        >
          <h3 class="faqSection__questionTitle">
            How Do I Get My Own?
          </h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden1 ? '' : 'open'"
          />
        </button>
        <div
          class="faqSection__answer mb-4"
          v-show="!isHidden1"
        >
          <p>
            Join the platform to get on the waitlist. Let us know who you are by
            filling this form and we will get back to you.
          </p>
          <div class="mt-4">
            <router-link
              to="register"
              class="cta_button"
            >
              Get Early Access
            </router-link>
          </div>
        </div>
      </li>
      <div class="divider" />
      <li
        x-data="accordion"
        class="faqSection__accordion"
      >
        <button
          class="faqSection__question"
          @click="open2"
        >
          <h3 class="faqSection__questionTitle">
            How do we know how many tokens to mint?
          </h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden2 ? '' : 'open'"
          />
        </button>
        <p
          class="faqSection__answer mt-8"
          v-show="!isHidden2"
        >
          If you want a consultation, you can get in touch with us. We are
          building out resources that will be available to you soon! Fill out
          the Sign Up Form or contact us in the chat!
        </p>
      </li>
      <div class="divider" />
      <li
        x-data="accordion"
        class="faqSection__accordion"
      >
        <button
          class="faqSection__question"
          @click="open3"
        >
          <h3 class="faqSection__questionTitle">
            Do I Have to Pay A Fee?
          </h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden3 ? '' : 'open'"
          />
        </button>
        <p
          class="faqSection__answer"
          v-show="!isHidden3"
        >
          Yes, network fees as well as launching fees are required to launch a
          token. Proceeds go to continue the development of Valorize and are
          managed by Valorize DAO.
        </p>
      </li>
    </ul>
  </section>
  <section
    id="footer"
    class="section mb-4"
  >
    <!-- <h2 class="text-right">Links</h2>  -->
    <div class="divider my-6" />
    <div class="flex justify-end items-center">
      <a
        href="https://twitter.com/valorizedao"
        target="_blank"
        class="mr-4 opacity-30 hover:opacity-40"
      >
        <img
          class="w-12"
          src="/src/assets/img/logos/twitter.svg"
          alt="Twitter"
        >
      </a>
      <a
        href="https://discord.gg/3PRMWrH9DT"
        target="_blank"
        class="opacity-30 hover:opacity-40"
      >
        <img
          class="w-12"
          src="/src/assets/img/logos/discord.svg"
          alt="Discord"
        >
      </a>
    </div>
  </section>
  <div
    id="unity-nft-trigger"
    ref="intersection-trigger"
    class="border py-4"
  />
  <transition name="fadeUp">
    <section
      id="unity-nft"
      class="fixed bottom-0 z-50"
      v-show="showBottomModal"
    >
      <div class="bg-black text-center py-24 text-white font-black h-screen w-screen flex flex-col justify-center items-center">
        <h2 class="text-4xl">
          Valorize Unity NFT
        </h2>
        <p class="pt-8">
          Optimists welcome, cynics, you have your space in the majority of society.
          Breathe a breath of fresh air in our community.
        </p>
        <div class="mt-4 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 11l7-7 7 7M5 19l7-7 7 7"
            />
          </svg>
        </div>
        <p>Scroll Up to forget</p>
        <div class="mt-24">
          <a
            href="https://nft.valorize.app"
            class="p-8 border-2 border-white"
          >Click to find out more</a>
        </div>
      </div>
    </section>
  </transition>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue"
import { useStore } from "vuex"
export default defineComponent({
  name: "Dashboard",
  props: {},
  data() {
    return {
      isHidden0: true,
      isHidden1: true,
      isHidden2: true,
      isHidden3: true,
      showBottomModal: false,
    }
  },
  methods: {
    // sorry to whoever cleans this or to future me
    open0() {
      this.isHidden0 = !this.isHidden0
    },
    open1() {
      this.isHidden1 = !this.isHidden1
    },
    open2() {
      this.isHidden2 = !this.isHidden2
    },
    open3() {
      this.isHidden3 = !this.isHidden3
    },
  },
  mounted() {
    const observer = new IntersectionObserver((intersectedTarget) => {
      intersectedTarget.forEach(el => {
        console.log("intersecting: ", el.isIntersecting)
        this.showBottomModal = el.isIntersecting
      })
    })
    observer.observe(this.$refs["intersection-trigger"] as HTMLElement)
  },
  setup() {
    const store = useStore()
    store.dispatch("authUser/checkAuth")
    return { ...composeAnimateProductImages() }
  },
})

function composeAnimateProductImages() {
  const image1 = ref < HTMLImageElement | null >(null)
  const image2 = ref < HTMLImageElement | null >(null)
  const image3 = ref < HTMLImageElement | null >(null)
  onMounted(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      if (image1.value) {
        image1.value.classList.add("productImage_image")
        image1.value.classList.remove("fadeIn1")
      }
      if (image2.value) {
        image2.value.classList.add("productImage_image")
        image2.value.classList.remove("fadeIn2")
      }
      if (image3.value) {
        image3.value.classList.add("productImage_image")
        image3.value.classList.remove("fadeIn3")
      }
    }, 4700)
  })
  return { image1, image2, image3 }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800;900&display=swap");
/* ----Theme ---- */
/* -----Breakpoints ---*/
body {
  font-family: "Inter", "Helvetica", "sans-serif";
  background-color: #dad1e9;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

img {
  object-fit: contain;
}

.hidden {
  display: none;
}

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
.section {
  padding: 0 6em;
}
@media (max-width: 640px) {
  .section {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .section {
    padding: 0 1em;
  }
}

.heroSection {
  padding: 0 6em;
  min-height: 70vh;
  justify-content: space-around;
}
@media (max-width: 640px) {
  .heroSection {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .heroSection {
    padding: 0 1em;
  }
}
@media (max-width: 920px) {
  .heroSection {
    flex-direction: column;
  }
}
.heroSection__mainCopy {
  font-weight: 900;
  font-size: 42px;
}
@media (min-width: 640px) {
  .heroSection__mainCopy {
    font-size: 48px;
    line-height: 77px;
  }
}
@media (min-width: 1280px) {
  .heroSection__mainCopy {
    font-size: 64px;
    line-height: 77px;
  }
}
.heroSection__supportCopy {
  font-size: 18px;
}
@media (min-width: 640px) {
  .heroSection__supportCopy {
    font-size: 32px;
  }
}
@media (min-width: 1280px) {
  .heroSection__supportCopy {
    font-size: 38px;
  }
}
.heroSection__main--left {
  padding-top: 5vh;
  text-align: left;
  max-width: 100vw;
  margin-right: 0;
}
@media (min-width: 920px) {
  .heroSection__main--left {
    padding-top: 25vh;
    margin-right: 5em;
    max-width: 50vw;
  }
}
.heroSection__main--right {
  text-align: right;
}
.heroSection__aside--left {
  text-align: left;
}
.heroSection__aside--right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5em;
}
.heroSection__form {
  max-width: 700px;
  margin: auto;
  position: relative;
  z-index: 0;
}

.divider {
  background-color: black;
  height: 0.2em;
}

h3 {
  font-size: 22pt;
}

.describeSection {
  padding: 0 6em;
  min-height: 80vh;
  margin-top: 2em;
  padding-top: 4em;
  overflow: hidden;
  max-width: 100vw;
}
@media (max-width: 640px) {
  .describeSection {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .describeSection {
    padding: 0 1em;
  }
}
.describeSection__heading,
.describeSection__heading--right {
  width: 700px;
  font-size: 18pt;
}
@media (max-width: 920px) {
  .describeSection__heading,
  .describeSection__heading--right {
    width: 100%;
  }
}
.describeSection__heading--right {
  text-align: right;
  margin-left: auto;
}

.faqSection {
  padding: 0 6em;
  margin: 8em 0;
  max-width: 60vw;
}
@media (max-width: 640px) {
  .faqSection {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .faqSection {
    padding: 0 1em;
  }
}
@media (max-width: 1024px) {
  .faqSection {
    max-width: unset;
  }
}
.faqSection * {
  transition-duration: 0.3s;
}
.faqSection__accordionContainer {
  padding: 0;
  margin: 0;
}
.faqSection__accordion {
  list-style: none;
  padding: 0;
  margin: 0;
}
.faqSection__question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: none;
  background-color: unset;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.faqSection__questionTitle {
  font-size: 1.8rem;
}
@media (max-width: 640px) {
  .faqSection__questionTitle {
    font-size: 1.4rem;
    text-align: left;
    margin-right: 1rem;
  }
}
.faqSection__questionButton {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 30px 0;
  /* Vertical line */
  /* horizontal line */
}
.faqSection__questionButton:before,
.faqSection__questionButton:after {
  content: "";
  position: absolute;
  background-color: black;
  transition: transform 0.3s ease-out;
}
.faqSection__questionButton:before {
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  margin-left: -2px;
}
.faqSection__questionButton:after {
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  margin-top: -2px;
}
.faqSection__questionButton.open:before {
  transform: rotate(90deg);
}
.faqSection__questionButton.open:after {
  transform: rotate(180deg);
}
.faqSection__answer {
  margin-bottom: 3em;
}

.fadeIn0 {
  opacity: 0;
  animation: fade 1.2s forwards;
}

.fadeIn1 {
  opacity: 0;
  animation: fade 1.2s forwards;
  animation-delay: 0.8s;
}
.fadeIn2 {
  opacity: 0;
  animation: fade 1.2s forwards;
  animation-delay: 2.2s;
}
.fadeIn3 {
  opacity: 0;
  animation: fade 1.2s forwards;
  animation-delay: 3.6s;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0%);
  }
}
@keyframes slideUp {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
}
@keyframes fade {
  from {
    opacity: 0%;
  }
  to {
    opacity: 100%;
  }
}

@media (max-width: 1280px) {
  .productImage__section {
    display: none;
  }
}
.productImage_image {
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
}
.productImage_image.up {
  animation-name: floatUp;
}

.productImage_image.down {
  animation-name: floatDown;
}

@keyframes floatDown {
  from {
    transform: translateY(140%);
  }
  to {
    transform: translateY(135%);
  }
}

@keyframes floatUp {
  from {
    transform: translateY(-140%);
  }
  to {
    transform: translateY(-135%);
  }
}

/*# sourceMappingURL=styles.css.map */
</style>
