<template>
  <div>
    <div
      class="absolute transform translate-x-2 -translate-y-2"
    >
      <slot />
    </div>
    <img
      alt="dotted shadow"
      :class="tailwindSize"
      src="../assets/img/dotted_shadow.png"
    >
  </div>
</template>
<script lang="ts">
export default {
  name: "ImageContainer",
  props: {
    tailwindSize: {
      type: String,
      default: "h-52 w-52",
    },
  },
}
</script>
