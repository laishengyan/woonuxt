<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { locale } = useI18n();
const { product, slug } = defineProps<{ product?: Product, slug?: String }>();

// TODO fetch perma link from WP API
const productCategoryPermallink = runtimeConfig?.public?.PRODUCT_CATEGORY_PERMALINK || '/product-category/';
const primaryCategory = computed(() => product && product.productCategories?.nodes[0]);
const format = computed(() => {
  if (product) {
    return [
      { name: 'Products', slug: `/${locale}/products` },
      {
        name: primaryCategory.value?.name,
        slug: `${String(productCategoryPermallink)}${primaryCategory.value?.slug}`,
      },
      { name: product.name },
    ]
  } else if (slug) {
    return [
      { name: 'Products', slug: `/${locale}/products` },
      {
        name: slug,
        slug: `/${locale}${String(productCategoryPermallink)}${slug}`
      }
    ]
  } else {
    return [{ name: 'Products', slug: `/${locale}/products` }]
  }
});
</script>

<template>
  <div class="flex text-sm leading-none text-gray-400 gap-1 items-center mt-[20px]">
    <span>
      <NuxtLink to="/" class="hover:text-primary name_title">{{ $t('messages.general.home') }}</NuxtLink>
      <span> /</span>
    </span>
    <span v-for="(link, i) in format" :key="link.name || i">
      <NuxtLink v-if="link.slug" :to="decodeURIComponent(link.slug)" class="hover:text-primary name_title">{{ link.name }}</NuxtLink>
      <span v-else class="text-gray-800">{{ link.name }}</span>
      <span v-if="i + 1 < format.length"> /</span>
    </span>
  </div>
</template>
<style scoped>
.name_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 13px;
  color: #292929;
}
</style>
