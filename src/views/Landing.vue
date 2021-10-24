
<template>
  <section id="hero" class="heroSection">
    <div class="flex flex-col items-center justify-center max-w-4xl mt-28">
      <h1 class="text-5xl lg:text-7xl font-black mb-8">
        Launch a Token, <br />
        Turn a Community Into a DAO
      </h1>
      <div class="divider"></div>
      <h2 class="heroSection__supportCopy">
        Creating your own token <em class="font-black italic">WAS</em> the most
        difficult part of turning a <em>discord</em> into a DAO.
      </h2>
      <h2 class="heroSection__supportCopy text-center mt-8">
        With us, it is not.
      </h2>
      <div class="p-8 mx-auto flex justify-center">
        <router-link to="Register" class="cta_button text-center font-bold text-2xl"
          >Sign Up</router-link
        >
      </div>
    </div>
  </section>
  <section id="describe" class="describeSection">
    <div class="describeSection__heading mb-24">
      <h2 class="text-4xl">
        Choose a smart contract template. Launch a token.
        <br/>
        <div class="mt-4">Multiply the power of your community. </div>
      </h2>
    </div>

    <div class="describeSection__heading--right">
      <h2 class="text-4xl">
        Launching your own token is easier than ever, create and use tokens while maintaining complete
        control of them.
      </h2>
      <a
        href="https://www.notion.so/valorize/Valorize-White-Paper-58fa3161c09e4ec2807cb0ea5d581d8f"
        ><button class="cta_button mt-8">Find Out More</button></a
      >
    </div>
  </section>
  <section id="FAQ" class="faqSection">
    <h2>FAQ</h2>
    <div class="divider"></div>
    <ul class="faqSection__accordionContainer">
      <li x-data="accordion" class="faqSection__accordion">
        <button class="faqSection__question" @click="open0">
          <h3 class="faqSection__questionTitle">What is a Creator Token?</h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden0 ? '' : 'open'"
          ></div>
        </button>
        <p class="faqSection__answer" v-show="!isHidden0" x-transition.fade>
          Creator Tokens are the first type of cryptocurrency token we have developed. 
          It works through a bonding curve, where people mint new tokens by depositing 
          ETH into the conract, and can allways sell. 
        </p>
      </li>
      <div class="divider"></div>
      <li x-data="accordion" class="faqSection__accordion">
        <button class="faqSection__question" @click="open1">
          <h3 class="faqSection__questionTitle">How Do I Get My Own?</h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden1 ? '' : 'open'"
          ></div>
        </button>
        <p class="faqSection__answer" v-show="!isHidden1" x-transition.fade>
          Join the waitlist by joining the platform. You can set up your profile. If you believe 
          you are a great candidate for early access, please  <a class="underline" href="mailto:javier@valorize.app">send us an email </a>
          <br /><br /><router-link to="Register" class="cta_button">
            Sign Up
          </router-link>
        </p>
      </li>
      <div class="divider"></div>
      <li x-data="accordion" class="faqSection__accordion">
        <button class="faqSection__question" @click="open2">
          <h3 class="faqSection__questionTitle">Do I Have to Pay A Fee?</h3>
          <div
            class="faqSection__questionButton"
            :class="isHidden2 ? '' : 'open'"
          ></div>
        </button>
        <p class="faqSection__answer" v-show="!isHidden2" x-transition.fade>
          Yes, network fees as well as launching fees are required to launch a token.
          Proceeds go to continue the development of Valorize and are managed by Valorize DAO.
        </p>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, Ref } from "vue";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { useStore } from "vuex";
Chart.register(...registerables);
export default defineComponent({
  name: "Dashboard",
  props: {},
  data() {
    return {
      isHidden0: true,
      isHidden1: true,
      isHidden2: true,
      isHidden3: true,
    };
  },
  methods: {
    //sorry to whoever cleans this or to future me
    open0() {
      this.isHidden0 = !this.isHidden0;
    },
    open1() {
      this.isHidden1 = !this.isHidden1;
    },
    open2() {
      this.isHidden2 = !this.isHidden2;
    },
    open3() {
      this.isHidden3 = !this.isHidden3;
    },
  },
  setup() {
    const store = useStore()
    store.dispatch("authUser/checkAuth")
    return { ...composeImageSlider(), ...composeChart() };
  },
});

const totalDuration = 5000;
const data = [
  3, 30, 42, 65, 75, 79, 121, 145, 175, 235, 365, 418, 522, 588, 660, 775, 815,
  900, 1025, 1050, 1178, 1280, 1320, 1390, 1580, 1650,
];
const delayBetweenPoints = totalDuration / data.length;

function composeImageSlider() {
  const container: Ref<null | HTMLDivElement> = ref(null);
  const investors = ref(150);
  const tokenSamplePrice = ref(20.0);
  onMounted(() => {
    const observerCallback: IntersectionObserverCallback = (
      e: IntersectionObserverEntry[]
    ) => {
      if (e[0].isIntersecting && investors.value === 150) {
        const increaseNums = window.setInterval(animateFrame, 50);
        window.setTimeout(
          () => window.clearInterval(increaseNums),
          totalDuration
        );
      } else {
        window.removeEventListener("scroll", animateFrame);
      }
    };
    let observer = new IntersectionObserver(observerCallback, {
      threshold: 0,
    });
    if (container.value) {
      observer.observe(container.value);
    }
    const animateFrame = () => {
      investors.value = investors.value + 15;
      tokenSamplePrice.value = Number(
        (Math.round((investors.value / 25) * 100) / 100).toFixed(2)
      );
    };
  });
  return {
    investors,
    tokenSamplePrice,
    container,
  };
}

let myChart: Chart;
function composeChart() {
  const chart: Ref<null | HTMLCanvasElement> = ref(null);
  onMounted(() => {
    const observerCallback: IntersectionObserverCallback = (e) => {
      if (e[0].isIntersecting && !myChart && chart.value) {
        myChart = new Chart(chart.value, config);
      }
    };
    let observer = new IntersectionObserver(observerCallback);
    const { value: ctx } = chart;
    if (ctx) {
      observer.observe(ctx);
    }
  });
  return { chart };
}

const previousY = (ctx: {
  index: number;
  chart: {
    scales: { y: { getPixelForValue: (arg0: number) => any } };
    getDatasetMeta: (arg0: any) => {
      (): any;
      new (): any;
      data: {
        getProps: (
          arg0: string[],
          arg1: boolean
        ) => { (): any; new (): any; y: any };
      }[];
    };
  };
  datasetIndex: any;
}) =>
  ctx.index === 0
    ? ctx.chart.scales.y.getPixelForValue(100)
    : ctx.chart
        .getDatasetMeta(ctx.datasetIndex)
        .data[ctx.index - 1].getProps(["y"], true).y;

const animation = {
  x: {
    type: "number",
    easing: "linear",
    duration: delayBetweenPoints,
    from: NaN, // the point is initially skipped
    delay(ctx: { type: string; xStarted: boolean; index: number }) {
      if (ctx.type !== "data" || ctx.xStarted) {
        return 0;
      }
      ctx.xStarted = true;
      return ctx.index * delayBetweenPoints;
    },
  },
  y: {
    type: "number",
    easing: "linear",
    duration: delayBetweenPoints,
    from: previousY,
    delay(ctx: { type: string; yStarted: boolean; index: number }) {
      if (ctx.type !== "data" || ctx.yStarted) {
        return 0;
      }
      ctx.yStarted = true;
      return ctx.index * delayBetweenPoints;
    },
  },
};
let config: ChartConfiguration = {
  type: "line",
  data: {
    labels: new Array(data.length).fill(""),
    datasets: [
      {
        label: "",
        data: data,
        fill: false,
        borderColor: "#23123a",
      },
    ],
  },
  options: {
    interaction: { intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: false },
      },
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  },
};
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

.heroSection {
  padding: 0 6em;
  min-height: 80vh;
  display: flex;
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

.nav {
  padding: 0 6em;
  opacity: 90%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 640px) {
  .nav {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .nav {
    padding: 0 1em;
  }
}
.nav,
.nav nav.nav {
  padding-top: 1em;
  padding-bottom: 1em;
}
@media (max-width: 640px) {
  .nav {
    flex-wrap: wrap;
    align-items: baseline;
  }
}
.nav__logo {
  max-height: 2.5em;
  margin: 0;
}
@media (max-width: 420px) {
  .nav__logo {
    max-width: 60vw;
  }
}
.nav.sticky {
  background-color: white;
  backdrop-filter: blur(5px);
  border-bottom: solid 2px black;
  position: sticky;
  top: 0;
  transform: translateY(0%);
  animation-name: slideDown;
  animation-duration: 0.8s;
}
.nav.notSticky {
  position: sticky;
  top: 0;
  transform: translateY(0%);
  animation-name: slideUp;
  animation-duration: 0.8s;
}
.nav.fade {
  position: relative;
  animation-name: fade;
  animation-duration: 0.8s;
}
.nav.noBackground {
  background: none;
}
.nav__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  padding: 0.8em;
  align-items: center;
}
@media (max-width: 640px) {
  .nav__items {
    display: block;
    width: 100%;
  }
}
.nav__items.hidden {
  display: flex;
}
@media (max-width: 640px) {
  .nav__items.hidden {
    display: none;
  }
}
.nav__item {
  font-weight: 900;
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  margin-right: 2em;
}
.nav__item button {
  text-decoration: none;
}
@media (max-width: 640px) {
  .nav__item button {
    width: 40%;
    padding: 0.6em;
  }
}
.nav__item a {
  text-decoration: none;
}
@media (max-width: 640px) {
  .nav__item a {
    padding: 1.2em 4em;
  }
}
.nav__item:last-child a {
  border: none;
}
.nav__hamburger {
  background-attachment: fixed;
  animation: 1s;
}
.nav__hamburgerButton {
  border: none;
  padding: 6px;
  background-color: unset;
}
@media (min-width: 640px) {
  .nav__hamburgerButton {
    display: none;
  }
}
.nav__hamburgerButton.open {
  padding: 8px;
  background: none;
  border: none;
}
@media (min-width: 900px) {
  .nav__hamburgerButton {
    right: 30%;
    top: 0.8em;
  }
}
.nav__hamburger #nav-icon3 {
  width: 2.2em;
  height: 28px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.nav__hamburger #nav-icon3 span {
  display: block;
  position: absolute;
  height: 4px;
  width: 100%;
  background: black;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
}
.nav__hamburger #nav-icon3 span:nth-child(1) {
  top: 0px;
}
.nav__hamburger #nav-icon3 span:nth-child(2),
.nav__hamburger #nav-icon3 span:nth-child(3) {
  top: 10px;
}
.nav__hamburger #nav-icon3 span:nth-child(4) {
  top: 20px;
}
.nav__hamburger #nav-icon3.open span:nth-child(1) {
  top: 2em;
  width: 0%;
  left: 50%;
}
.nav__hamburger #nav-icon3.open span {
  background: #303030;
}
.nav__hamburger #nav-icon3.open span:nth-child(2) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.nav__hamburger #nav-icon3.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.nav__hamburger #nav-icon3.open span:nth-child(4) {
  top: 14px;
  width: 0%;
  left: 50%;
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
  width: 50vw;
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
.describeSection__imageContainer {
  width: 50vw;
  margin: 4em auto;
}
@media (max-width: 640px) {
  .describeSection__imageContainer {
    width: 80vw;
    margin: 4em 0;
    display: block;
  }
}
.describeSection__imageContainer * {
  margin-top: 0;
}
.describeSection__imageContainer--slider {
  display: flex;
  position: relative;
}
@media (max-width: 640px) {
  .describeSection__imageContainer--slider {
    display: block;
  }
}
@media (max-width: 640px) {
  .describeSection__imageContainer--slider img {
    width: 100%;
  }
}
.describeSection__imageContainer--text {
  transition-duration: 0.4s;
  transition-timing-function: linear;
  margin-left: 0.8em;
  color: white;
  font-size: 36pt;
  position: relative;
  z-index: 1;
}
@media (max-width: 920px) {
  .describeSection__imageContainer--text {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
@media (max-width: 420px) {
  .describeSection__imageContainer--text {
    font-size: 28pt;
  }
}
.describeSection__imageContainer--text h3 {
  font-size: 42pt;
}
@media (max-width: 420px) {
  .describeSection__imageContainer--text h3 {
    font-size: 34pt;
  }
}
.describeSection__imageContainer--text * {
  margin: 0;
}
.describeSection__imageContainer--chart {
  position: absolute;
  width: 50vw;
  height: 400px;
  transform: translate(50%, 0%);
}
@media (max-width: 920px) {
  .describeSection__imageContainer--chart {
    display: none;
  }
}

.howItWorksSection {
  padding: 0 6em;
  margin-top: 0em;
  padding-top: 8em;
}
@media (max-width: 640px) {
  .howItWorksSection {
    padding: 0 3em;
  }
}
@media (max-width: 420px) {
  .howItWorksSection {
    padding: 0 1em;
  }
}
@media (max-width: 640px) {
  .howItWorksSection {
    margin-top: 8em;
  }
}
.howItWorksSection__header {
  font-size: 24pt;
}
.howItWorksSection__body {
  font-size: 18pt;
  margin: 2em 0;
}
.howItWorksSection__cta {
  text-align: center;
}

.faqSection {
  padding: 0 6em;
  margin: 8em 0;
  max-width: 50vw;
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
@media (max-width: 640px) {
  .faqSection {
    max-width: unset;
  }
}
.faqSection * {
  transition-duration: 0.3s;
}
.faqSection h2 {
  font-size: 2.5rem;
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

.button:hover {
  cursor: pointer;
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

/*# sourceMappingURL=styles.css.map */
</style>
