
<template>
  <div>
    <div class="px-16 pt-4 flex border-b-4 border-black bg-purple-200">
      <router-link class="border-2 border-black border-b-0 mr-1 bg-purple-100" :to="{ name: 'Token Admin' }">
        <div class="px-6 py-2">
          Token Admin
        </div>
      </router-link> 
      <router-link class="border-2 border-black border-b-0 bg-purple-100" :to="{ name: 'Create Airdrop' }">
        <div class=" px-6 py-2">
          Create Airdrop
        </div>
      </router-link>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <keep-alive>
          <suspense>
            <template #default>
              <component
                :is="Component"
              />
            </template>
            <template #fallback> Loading... </template>
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
  </div>

</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import {useStore} from "vuex";
export default defineComponent({
  name: "Token Dashboard",
  setup: () => ({}),
});
</script>

<style scoped lang="postcss">
.router-link-exact-active{
  @apply border-b-purple-50 bg-purple-50 border-b font-black pb-1 -mb-1
}
</style>
