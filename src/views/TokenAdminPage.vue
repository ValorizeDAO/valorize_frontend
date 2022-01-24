<template>
  <h1 class="font-black text-4xl px-16 pt-4">Manage Token</h1>
  <div class="max-w-2xl mx-auto mt-24">
    <h2 class="font-black text-3xl">{{ tokenName }} ({{ tokenSymbol }})</h2>
    <div class="flex justify-between">
      <span class="text-2xl">
        Current Supply:
      </span>
      <span class="text-2xl">{{ c(circulatingSupply) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, Ref } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api"
import currency from "currency.js";

export default defineComponent({
  name: "Token Admin",
  setup: () => {
    const route = useRoute();
    const circulatingSupply = ref("10000000000000")
    onMounted(async () => {
      console.log(await api.getTokenData(route.params.id))
    })
    return {
      circulatingSupply,
      c: value => currency(Number(value), { separator: ",", symbol:'$', precision: 0 })
    };
  },
});
</script>

<style scoped>
</style>
