<template>
  <div
    @click.stop="toggle"
    id="modal-bg"
    v-if="modalIsOpen"
    class="
      h-screen
      w-screen
      fixed
      top-0
      left-0
      bg-black bg-opacity-70
      flex
      justify-center
      items-center
    "
  >
    <div
      id="modal-body"
      @click.stop
      class="w-full sm:w-9/12 mx-auto px-10 sm:-mt-48"
      :class="bodyClass"
    >
      <div class="flex w-full justify-end">
        <button
          @click="toggle"
          class="my-2 -ml-8 p-1 border-black border rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="my-4 mx-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "Modal",
  props: {
    modalIsOpen: {
      type: Boolean,
      required: true,
    },
    bodyClass: {
      default: ["bg-paper-light"],
    },
  },
  setup(props, { emit }) {
    function toggle() {
      emit("toggle")
    }
    return {
      toggle,
    }
  },
})
</script>
