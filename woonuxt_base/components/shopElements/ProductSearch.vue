<script setup>
const { getSearchQuery, setSearchQuery, clearSearchQuery } = useSearching();
const { locale } = useI18n();
const searchQuery = ref(getSearchQuery());

const reset = () => {
  clearSearchQuery();
  searchQuery.value = '';
};

watch(getSearchQuery, (value) => {
  if (!value) reset();
});
</script>

<template>
  <form class="relative items-center flex-1 -space-x-px shadow-sm" @submit.prevent="setSearchQuery(searchQuery, locale)">
    <Icon name="ion:search-outline" size="20" class="absolute z-10 opacity-50 pointer-events-none left-2" />
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="$t('messages.shop.searchProducts')"
      class="z-0 inline-flex items-center w-full p-2 pl-10 text-sm text-gray-500 border border-gray-300 shadow-inner outline-none bg-gray-50 shadow-gray-200 search-input pr-[80px]" />
    <span
      v-if="searchQuery"
      class="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer bg-primary bg-opacity-10 hover:bg-opacity-20 text-primary right-2"
      @click="reset">
      <span>{{ $t('messages.general.clear') }}</span>
      <Icon name="ion:close-outline" size="18" />
    </span>
  </form>
</template>
<style scoped>
.search-input::placeholder {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: #686868;
}
</style>
