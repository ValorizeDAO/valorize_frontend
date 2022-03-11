<template>
  <div class="h-screen w-screen -mt-2 flex items-center justify-center">
    <SvgLoader fill="black" class="h-16 w-16 absolute" />
    <div
      class="h-screen"
      data-tf-widget="OAwwIXjV"
      data-tf-hide-headers
      data-tf-iframe-props="title=Valorize Beta Signup"
      style="width: 100%; height: 100%"
    ></div>
    <component :is="'script'" ref="leadgen" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgLoader from "../components/SvgLoader.vue";

export default defineComponent({
  components: { SvgLoader },
  mounted() {
    const leadgen = this.$refs.leadgen as HTMLElement;
    leadgen.setAttribute("src", "//embed.typeform.com/next/embed.js");
  },
});
</script>