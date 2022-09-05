<template>
  <div
    @click.prevent="showInfo = true"
    @mouseenter="showInfo = true"
    @mouseleave="showInfo = false"
    @focusin="showInfo = true"
    @focusout="showInfo = false"
  >
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
    <transition name="fade">
      <div
        v-if="showInfo"
        class="absolute w-screen md:w-2/5 bg-black text-white p-4 left-0 md:left-1/3"
      >
        <p>
          <slot />
        </p>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"

const showInfo = ref(false)
</script>
