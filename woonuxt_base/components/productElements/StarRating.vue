<script setup lang="ts">
defineProps({
  rating: { type: Number, default: 0 },
  count: { type: Number, default: null },
  hideCount: { type: Boolean, default: false },
  size: { type: Number, default: 14 },
});
</script>

<template>
  <div class="inline-flex items-center justify-center mt-2">
    <Icon v-for="i in 5" :key="i" name="ion:star" :size="size + ''" :color="rating < i ? '#ccc' : '#E0A864'" class="mr-[2px]" />
    <span v-if="count !== null && !hideCount" class="text-xs ml-1 text-gray-500">{{ count }} Review</span>
  </div>
</template>
<style scoped lang="postcss">
.text-xs {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 13px;
  color: #167EFF;
}
</style>
