<template>
  <div>
    <div class="flex justify-between">
      <slot name="title" />
    </div>
    <div class="mt-4">
      <TransitionGroup
        name="list"
        tag="ul"
      >
        <li
          class="text-xl"
          v-for="admin, i in admins"
          :key="i"
        >
          {{ admin.address }}
        </li>
      </TransitionGroup>
      <button
        v-if="props.admins.length > 3"
        @click="showExpanded = !showExpanded"
      >
        Show <span v-text="!showExpanded ? 'All' : 'Less'" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
  admins: {address: string, user: number }[];
}>()
const showExpanded = ref(false)
const admins = computed(() => {
  console.log(showExpanded, props.admins)
  console.log(showExpanded, props.admins.slice(0, 2))
  return showExpanded.value ? props.admins : props.admins.slice(0, 3)
})
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
