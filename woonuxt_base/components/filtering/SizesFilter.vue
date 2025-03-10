<script setup>
const { getFilter, setFilter, isFiltersActive } = useFiltering();
const { localNum } = useUtils();
const { locale } = useI18n();
const { label, hideEmpty, showCount, open } = defineProps({
  label: { type: String, default: '' },
  hideEmpty: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  open: { type: Boolean, default: true },
});

const { data: allSize } = await useAsyncGql("allPaSize", {
  language: localNum(locale.value)
})

const allPaTerms = allSize.value?.allPaSize?.nodes || [];
const selectedTerms = ref(getFilter("pa_size") || []);
const filterTitle = ref(label);

const isOpen = ref(open);

watch(isFiltersActive, () => {
  // uncheck all checkboxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

// Update the URL when the checkbox is changed
const checkboxChanged = () => {
  setFilter("pa_size", selectedTerms.value);
};
</script>

<template>
  <div>
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
      <span>{{ filterTitle }}</span>
      <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-show="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
      <div v-for="{ count, slug, name } in allPaTerms" :key="slug" class="flex gap-2 items-start">
        <input :id="slug" v-model="selectedTerms" type="checkbox" :value="slug" @change="checkboxChanged" />
        <label :for="slug" class="cursor-pointer m-0 text-sm flex items-center flex-wrap title_name">
          <span v-html="name" />
          <small v-if="showCount" class="ml-1 text-gray-400 tabular-nums" aria-hidden="true">({{ count || 0 }})</small>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.title_name {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: #292929;
}
</style>
