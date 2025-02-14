<script setup>
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useAsyncGql('getProducts', { slug });
setProducts(data.value?.products?.nodes || []);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'product-category-slug') return;
    updateProductList();
  },
);

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container max-w-[1200px]">
    <Breadcrumb class="mb-6" :slug />
    <div class="content_desc">Chinese landscape painting is an art form that uses natural landscapes as its creative theme. It depicts mountains and rivers as its subjects and has a unique artistic charm. This style of painting not only occupies a key position in the history of Chinese</div>
    <div class="flex items-start gap-16">
      <Filters :hide-categories="true" />
  
      <div class="w-full">
        <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown class="hidden md:inline-flex" />
          <ShowFilterTrigger class="md:hidden" />
        </div>
        <ProductGrid />
      </div>
    </div>
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
