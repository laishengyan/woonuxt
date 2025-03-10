<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";

const { locale, t } = useI18n();
const { isQueryEmpty } = useHelpers();
const { localNum } = useUtils();
const categories = inject('globalCategories');
const { data: product } = await useAsyncGql('getProducts', { // 假设 useAsyncGql 的第一个参数是 query name
  language: localNum(locale.value),
  first: 15
})
const generalSettings = inject('generalSettings');
const categoriesList = computed(() => {
  return categories.value?.productCategories?.nodes || []
})
const { data: page } = await useAsyncGql('page', {
  pageId: 1363,
  language: localNum(locale.value)
})
const nowData = page.value?.pageBy?.translation
useSeoMeta({
  title: t("messages.general.home"),
  ogTitle: generalSettings?.value?.generalSettings?.title,
  description: nowData?.content?.replace("<p>", "")?.replace("</p>", ""),
  ogDescription: nowData?.content?.replace("<p>", "")?.replace("</p>", ""),
  twitterCard: t('messages.general.twitterCard'),
});
useHead({
  meta: [
    { name: 'keywords', content: generalSettings?.value?.generalSettings?.description },
  ]
})
</script>

<template>
  <main class="container max-w-[1200px]">
    <HeroBanner />
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.general.showByCategory") }}</span>
    </div>
    <section class="min-h-[204px] sm:min-h-0 mb-[2rem] sm:mb-[50px]">
      <client-only>
        <div class="grid justify-center grid-cols-4 gap-2 sm:gap-4 lg:grid-cols-8 px-[0.63rem] sm:px-[0]" v-if="categoriesList && categoriesList.length">
          <CategoryCard v-for="(category, i) in categoriesList" :key="i" class="w-full" :node="category" />
        </div>
      </client-only>
    </section>
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.general.fAndNew") }}</span>
    </div>
    <div class="mt-[10px]">
      <section v-if="product && product.products  && product.products.nodes && !!product.products.nodes.length" class="relative w-full product-grid">
        <ProductCard v-for="(node, i) in product.products.nodes" :key="node.id || i" :node="node" :index="i" :class="i === 8 ? 'hidden sm:block' : ''"/>
      </section>
      <NoProductsFound v-else />
    </div>
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.shop.reviews") }}</span>
    </div>
    <ProductReviews :indexShow="true"></ProductReviews>
  </main>
</template>

<style scoped lang="postcss">
.container {
  contain: layout;
}
.product-grid {
  @apply my-[1rem] min-h-[600px] grid transition-all px-[0.63rem] grid-cols-2 gap-[0.63rem];
}
.product-grid:empty {
  display: none;
}

.little_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.94rem;
  color: #7F1C1B;
}
@media (min-width: 640px) {
  .little_title {
    font-family: HarmonyOS Sans-Bold;
    font-weight: bold;
    font-size: 16px;
    color: #7F1C1B;
  }
  .product-grid {
    @apply my-8 gap-[20px] px-[0rem] grid-cols-3;
  }
}
</style>
