
<template>
  <transition name="fade" mode="out-in">
    <button
      v-if="!showDelete"
      @click="() => (showDelete = true)"
      class="px-4 py-2 border-2 border-black rounded-lg font-black"
    >
      Delete
    </button>
    <div v-else>
      <span class="mr-4">Confirm Delete Link:</span>
      <button
        @click="() => (showDelete = false)"
        class="w-18 px-4 py-2 border-2 border-black rounded-lg font-black mr-4"
      >
        No
      </button>
      <button
        @click="deleteLink"
        class="w-18 px-4 py-2 border-2 border-black rounded-lg font-black"
      >
        Yes
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Link } from "../models/Link";

export default defineComponent({
  name: "DeleteLink",
  props: ["link", "index"],
  data() {
    return {
      showDelete: false,
    }
  },
  methods: {
    deleteLink() {
      this.$emit("deleteLink", this.index);
    },
  },
})
</script>

<style scoped>
</style>
