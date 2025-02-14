<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const { productsPerPage } = useHelpers();
const { products } = useProducts();

// TODO: Refactor all this logic. It's a mess.
const currentQuery = computed(() => {
  const query = route.query;
  const queryKeys = Object.keys(query);
  let currentQuery = '';
  if (queryKeys.length > 0) {
    queryKeys.forEach((key, index) => {
      currentQuery += index === 0 ? `${key}=${query[key]}` : `&${key}=${query[key]}`;
    });
  }
  return decodeURIComponent(currentQuery);
});

const page = ref(route.params.pageNumber ? parseInt(route.params.pageNumber as string) : 1);
const numberOfPages = computed<number>(() => Math.ceil(products.value.length / productsPerPage || 1));

const prevSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return decodeURIComponent(`/${locale}/products/page/${pageNumber > 1 ? pageNumber - 1 : pageNumber}`);
  } else {
    return decodeURIComponent(pageNumber > 1 ? `/${locale}/products/page/${pageNumber - 1}/?${currentQuery.value}` : `/${locale}/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};

const nextSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return decodeURIComponent(`/${locale}/products/page/${pageNumber < numberOfPages.value ? pageNumber + 1 : pageNumber}`);
  } else {
    return decodeURIComponent(pageNumber < numberOfPages.value ? `/${locale}/products/page/${pageNumber + 1}/?${currentQuery.value}` : `/${locale}/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};

const numberSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return decodeURIComponent(`/${locale}/products/page/${pageNumber}`);
  } else {
    return decodeURIComponent(`/${locale}/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};
</script>

<template>
  <div class="flex justify-center mt-8 mb-16 col-span-full tabular-nums">
    <!-- Pagination -->
    <nav v-if="numberOfPages && numberOfPages > 1" class="inline-flex self-end -space-x-px rounded-md shadow-sm isolate gap-x-[8px]" aria-label="Pagination">
      <!-- PREV -->
      <NuxtLink :to="prevSrc(page)" class="prev" :disabled="page == 1" :class="{ 'cursor-not-allowed': page == 1 }" :aria-disabled="page == 1" aria-label="Previous">
        <Icon name="ion:chevron-back-outline" size="20" class="w-3 h-3" />
      </NuxtLink>

      <!-- NUMBERS -->
      <NuxtLink v-for="pageNumber in numberOfPages" :key="pageNumber" :to="numberSrc(pageNumber)" :aria-current="pageNumber === page ? 'page' : undefined" class="page-number">{{
        pageNumber
      }}</NuxtLink>

      <!-- NEXT -->
      <NuxtLink
        :to="nextSrc(page)"
        class="next"
        :disabled="page === numberOfPages"
        :class="{ 'cursor-not-allowed': page === numberOfPages }"
        :aria-disabled="page === numberOfPages"
        aria-label="Next">
        <Icon name="ion:chevron-forward-outline" size="20" class="w-3 h-3" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style lang="postcss" scoped>
.prev,
.next,
.page-number {
  @apply py-[5px] px-[10px] bg-[#F2F3F5];
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: #686868;
}

.page-number {
  @apply px-3;
}

.page-number[aria-current='page'] {
  @apply bg-primary border-primary border text-primary z-10;
  color: #FFFFFF;
}

.prev,
.next {
  &.cursor-not-allowed svg{
    @apply opacity-50;
  }
}
</style>
