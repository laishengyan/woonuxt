<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { locale, t } = useI18n();
const { product, slug, post, isPost, isWishList, isCart, isCorpInfo, isFurtherInfo } = defineProps<{ product?: Product, slug?: String, post?: Post, isPost?: boolean, isWishList?: boolean, isCart?: boolean, isCorpInfo?: boolean, isFurtherInfo?: boolean }>();

// TODO fetch perma link from WP API
const productCategoryPermallink = runtimeConfig?.public?.PRODUCT_CATEGORY_PERMALINK || '/category/';
const primaryCategory = computed(() => product && product.productCategories?.nodes[0]);
const format = computed(() => {
  if (isWishList) {
    return [
      { name: t('messages.shop.wishlist'), slug: `/${locale.value}/wishlist` }
    ]
  }
  if (isFurtherInfo) {
    return [
      { name: t('messages.furtherInfo'), slug: `/${locale.value}/further-info` }
    ]
  }
  if (isCorpInfo) {
    return [
      { name: t('messages.general.corpInfo'), slug: `/${locale.value}/corp_info` }
    ]
  }
  if (isCart) {
    return [
      { name: t('messages.shop.cart'), slug: `/${locale.value}/addCart` }
    ]
  }
  if (isPost) {
    if (post) {
      return [
        { name: t("messages.general.ourBlog"), slug: `/${locale.value}/blog` },
        {
          name: post.slug,
          slug: `/${locale.value}/blog/${post.slug}`,
        }
      ]
    } else {
      return [
        { name: t("messages.general.ourBlog"), slug: `/${locale.value}/blog` }
      ]
    }
  } else {
    if (product) {
      return [
        { name: t("messages.general.allProducts"), slug: `/${locale.value}/products` },
        {
          name: primaryCategory.value?.name,
          slug: `/${locale.value}${String(productCategoryPermallink)}${primaryCategory.value?.slug}`,
        },
        { name: product.name },
      ]
    } else if (slug) {
      return [
        { name: t("messages.general.allProducts"), slug: `/${locale.value}/products` },
        {
          name: slug,
          slug: `/${locale.value}${String(productCategoryPermallink)}${slug}`
        }
      ]
    } else {
      return [{ name: t("messages.general.allProducts"), slug: `/${locale.value}/products` }]
    }
  }
});
</script>

<template>
  <div class="flex text-sm leading-none text-gray-400 gap-1 items-center mt-[1.25rem] sm:mt-[20px] banner_breadcrumb">
    <span style="line-height: normal;">
      <NuxtLink :to="`/${locale}`" class="hover:text-primary name_title">{{ $t('messages.general.home') }}</NuxtLink>
      <span> /</span>
    </span>
    <span v-for="(link, i) in format" :key="link.name || i" style="line-height: normal;">
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
  font-size: 0.88rem;
  color: #292929;
}
.banner_breadcrumb {
  white-space: nowrap;
  overflow: hidden;
}
.banner_breadcrumb > span:last-child {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (min-width: 640px) {
  .name_title {
    font-size: 13px;
  }
}
</style>
