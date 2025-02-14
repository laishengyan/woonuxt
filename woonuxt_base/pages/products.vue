<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const route = useRoute();

const { isQueryEmpty } = useHelpers();

const { data } = await useAsyncGql('getProducts');
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
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container max-w-[1200px]">
    <Breadcrumb class="mb-6" />
    <div class="content_desc">Chinese landscape painting is an art form that uses natural landscapes as its creative theme. It depicts mountains and rivers as its subjects and has a unique artistic charm. This style of painting not only occupies a key position in the history of Chinese</div>
    <div class="flex items-center justify-end mt-[20px]">
      <OrderByDropdown class="hidden md:inline-flex" />
    </div>
    <div class="flex items-start gap-16" v-if="allProducts.length">
      <Filters />
  
      <div class="w-full">
        <LazyShowFilterTrigger class="md:hidden" />
        <ProductGrid />
      </div>
    </div>
    <NoProductsFound v-else>Could not fecth products from your store. Please check your configuration.</NoProductsFound>
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
