<template>
  <div class="font-black text-4xl text-center py-48">
    Congratulations, Your token is live!!
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, Ref } from "vue";

export default defineComponent({
  name: "Token Success",
  setup: () => {
    window.scrollTo(0,0)
    return {
    };
  },
});
</script>

<style scoped>
</style>
