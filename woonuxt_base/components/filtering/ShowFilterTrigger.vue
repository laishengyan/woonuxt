<script setup>
const { toggleBodyClass, removeBodyClass } = useHelpers();
const { isFiltersActive } = await useFiltering();
onBeforeUnmount(() => {
  removeBodyClass('show-filters');
});
</script>

<template>
  <div class="relative inline-flex -space-x-px shadow-sm rounded-m isolate">
    <button
      class="relative inline-flex items-center p-2 text-sm text-gray-500 bg-white hover:bg-gray-50 focus:z-20 filter_title"
      aria-label="Show filters"
      @click="toggleBodyClass('show-filters')"
      title="Show filters">
      <!-- <Icon name="ion:funnel-outline" size="18" class="transition-transform transform transform-origin-center" /> -->
      <span class="mr-[0.31rem]">filters</span>
      <img src="/modile/filters.webp" alt="filters" class="w-[1rem] h-[1rem]">
    </button>
    <span class="absolute z-20 w-2.5 h-2.5 rounded-full bg-primary -top-1 -right-1" v-if="isFiltersActive" />
  </div>
</template>

<style scope lang="postcss">
.filter_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #292929;
  border: 0.06rem solid #C8C8C8;
}
</style>
