
<template>
  <div class="px-16 py-4">
    <div class="flex w-full justify-between">
      <h1 class="text-3xl font-sans font-black">Welcome, {{ user.username }}!</h1>
      <router-link to="edit-profile" class="btn  my-3 w-40 text-center bg-paper-light"
        >
        Setup Profile
        </router-link>
    </div>
    <section id="manage-tokens">
      <h2 class="text-2xl font-black my-4">Your Tokens</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <ImageContainer>
        <div class="col-span-1 bg-purple-300 p-8 border-2 border-black">
          <h3 class="text-lg font-black">Token Test</h3>
        </div>
        </ImageContainer> 
        <ImageContainer>
        <div class="col-span-1 bg-purple-300 p-8 border-2 border-black">
          <h3 class="text-lg font-black">Token Test</h3>
        </div>
        </ImageContainer>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import ImageContainer from "../components/ImageContainer.vue";
export default defineComponent({
  name: "Dashboard",
  props: {},
  components: { ImageContainer },
  setup: () => {
    const store = useStore();
    const user = store.getters["authUser/user"];
    return { store, user };
  },
});
</script>

<style scoped>
</style>
