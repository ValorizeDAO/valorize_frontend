<template>
  <div class="font-black text-4xl text-center py-48">
    Congratulations, Your token is live!!
    <div class="text-center my-8">
      <p class="btn bg-purple-200 text-lg">
        Redirecting you to admin page...
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, Ref } from "vue";
import JSConfetti from 'js-confetti'
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Token Success",
  setup: () => {
    const route = useRoute();
    const router = useRouter();
    onMounted(() => {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ['🚀', '🎉', '🦄', '✨', '🚀', '🔥', '🌈']
      })
      setTimeout(() => router.push("/token/" + route.query.tokenId), 2000)
    })
    return {
    };
  },
});
</script>

<style scoped>
</style>
