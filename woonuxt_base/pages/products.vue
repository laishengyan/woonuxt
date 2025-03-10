<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { locale, t } = useI18n();

const { isQueryEmpty } = useHelpers();
const { localNum } = useUtils();

const { data } = await useAsyncGql('getProducts', {
  language: localNum(locale.value)
});
const allProducts = (data.value?.products?.nodes || []) as Product[];
setProducts(allProducts);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: t('messages.general.allProducts'),
  meta: [{ hid: t('messages.description'), name: t('messages.description'), content: t('messages.general.allProducts') }],
});
</script>

<template>
  <div class="container max-w-[1200px] px-[0.63rem] sm:px-[0]">
    <Breadcrumb class="mb-4 sm:mb-6" />
    <div class="flex items-center justify-end sm:mt-[20px] sticky top-[155px] z-30">
      <OrderByDropdown class="hidden md:inline-flex" />
    </div>
    <div class="flex items-start gap-16" v-if="allProducts.length">
      <Filters />
  
      <div class="w-full">
        <LazyShowFilterTrigger class="sm:sticky sm:top-[155px] mb-[0.63rem] z-30 sm:mb-[0] md:hidden" />
        <ProductGrid />
      </div>
    </div>
    <NoProductsFound v-else>{{ $t("messages.product.NoProductsFound") }}</NoProductsFound>
    <ScrollTop></ScrollTop>
  </div>
</template>

<style scoped lang="postcss">
.content_desc {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 15px;
  color: #292929;  
}
</style>
