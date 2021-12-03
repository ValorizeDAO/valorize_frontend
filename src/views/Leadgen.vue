<template>
  <div class="h-screen -mt-2">
    <div
      class="h-screen"
      data-tf-widget="OAwwIXjV"
      data-tf-hide-headers
      data-tf-iframe-props="title=Valorize Beta Signup"
      style="width: 100%; height: 100%"
    ></div>
    <component 
        :is="'script'" 
        ref="leadgen"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    const leadgen = this.$refs.leadgen as HTMLElement;
    leadgen.setAttribute("src", "//embed.typeform.com/next/embed.js");
  },
});
</script>