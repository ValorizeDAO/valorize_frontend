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
import { ref, defineComponent, onMounted, Ref } from "vue";
import JSConfetti from 'js-confetti'
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Token Success",
  setup: () => {
    const route = useRoute();
    const router = useRouter();
    onMounted(() => {
    })
    return {
    };
  },
});
</script>

<style scoped>
</style>
