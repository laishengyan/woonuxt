<script setup lang="ts">
const { theList } = useWishlist();
const { locale, t } = useI18n();
const { isQueryEmpty } = useHelpers();
const { localNum } = useUtils();
const products = ref<Product[]>([]);
useAsyncGql('getProducts', {
  language: localNum(locale.value),
  first: 6,
}).then((res: any) => {
  products.value = res.data.value?.products?.nodes
})
useHead({
  title:  t('messages.shop.wishlist'),
  meta: [{ hid: t('messages.shop.wishlist'), name:t('messages.shop.wishlist'), content: t('messages.shop.wishlist') }]
})
</script>

<template>
  <div class="container max-w-[1200px] mx-auto min-h-[600px] w-full max-w-6xl px-[0.63rem] sm:px-0">
    <Breadcrumb :isWishList="true" class="mb-4 sm:mb-[10px]" />
    <h1 class="py-[10px] text-2xl font-semibold text-left hidden sm:block">{{ $t('messages.shop.wishlist') }}</h1>
    <client-only>
      <ul v-if="theList.length" class="grid mb-4 sm:mb-8 mt-4 divide-y divide-gray-100">
        <LazyWishListItem v-for="(product, index) in theList" :key="product.databaseId" :product="product" :class="{
          'mt-[0.63rem] sm:mt-[10px]': index !== 0,
        }" />
      </ul>
      <div v-else class="flex text-center min-h-[600px] text-gray-500 items-center justify-center">
        <p>{{ $t('messages.shop.wishlistNoItems') }}</p>
      </div>
    </client-only>
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.shop.popularProducts") }}</span>
    </div>
    <div class="container max-w-[1200px] mt-[10px]">
      <TransitionGroup name="shrink" tag="div" mode="in-out">
        <section v-if="products && !!products.length" class="relative w-full product-grid">
          <ProductCard v-for="(node, i) in products" :key="node.id || i" :node="node" :index="i" />
        </section>
        <NoProductsFound v-else />
      </TransitionGroup>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.product-grid {
  @apply my-4 min-h-[600px] grid transition-all gap-[0.63rem] sm:gap-[20px] lg:my-8;

  grid-template-columns: repeat(2, 1fr);
}
.product-grid:empty {
  display: none;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
}
</style>
