<template>
  <div class="font-black text-4xl text-center py-48">
    Congratulations, Your token is live!!
    <div class="text-center my-8">
      <div class="text-lg max-w-xs mx-auto">
        Redirecting you to admin page...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue"
import JSConfetti from "js-confetti"
import { useRoute, useRouter } from "vue-router"

export default defineComponent({
  name: "TokenSuccess",
  setup: () => {
    const route = useRoute()
    const router = useRouter()
    onMounted(() => {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ["🚀", "🎉", "🦄", "✨", "🚀", "🔥", "🌈"],
      })
      setTimeout(() => router.push("/dashboard/token/" + route.query.tokenId), 2000)
    })
    return {
    }
  },
})
</script>

<style scoped>
</style>
