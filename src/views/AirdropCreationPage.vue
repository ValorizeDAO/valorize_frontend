<template>
  <div class="px-16 pt-8 font-black">
    {{ c(totalSupply) }} Available for Airdrop
    <div class="text-center my-8">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "Token Success",
  props: ['state'],
  setup: (props) => {
    return {
    };
  },
});
</script>

<style scoped>
</style>
