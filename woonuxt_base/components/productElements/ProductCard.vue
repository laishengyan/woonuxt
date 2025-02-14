<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const props = defineProps({
  node: { type: Object, default: null },
  index: { type: Number, default: 1 },
});
const { addToCart, isUpdatingCart } = useCart();

const imgWidth = 344;
const imgHeight = 344;

// example: ?filter=pa_color[green,blue],pa_size[large]
const filterQuery = ref(route.query.filter);
const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

// watch filterQuery
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter;
    paColor.value = filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || [];
  },
);

const mainImage = computed<string>(() => props.node?.image?.producCardSourceUrl || props.node?.image?.sourceUrl || '/images/placeholder.jpg');
const imagetoDisplay = computed<string>(() => {
  if (paColor.value.length) {
    const activeColorImage = props.node?.variations?.nodes.filter((variation) => {
      const hasMatchingAttributes = variation.attributes.nodes.some((attribute) => paColor.value.some((color) => attribute.value.includes(color)));
      const hasMatchingSlug = paColor.value.some((color) => variation.slug.includes(color));
      return hasMatchingAttributes || hasMatchingSlug;
    });
    if (activeColorImage?.length) return activeColorImage[0].image?.producCardSourceUrl || activeColorImage[0].image?.sourceUrl || mainImage.value;
  }
  return mainImage.value;
});
</script>

<template>
  <div class="relative product-card">
    <NuxtLink :to="`/${locale}/product/${decodeURIComponent(node.slug)}`" :title="node.name">
      <!-- <SaleBadge :node="node" class="absolute top-2 right-2" /> -->
      <img
        v-if="imagetoDisplay"
        :width="imgWidth"
        :height="imgHeight"
        :src="imagetoDisplay"
        :alt="node.image?.altText || node.name"
        :title="node.image?.title || node.name"
        :loading="index <= 3 ? 'eager' : 'lazy'"
        placeholder
         />
    </NuxtLink>
    <div class="p-2 flex flex-col align-center justify-center" style="line-height: initial;">
      <NuxtLink :to="`/${locale}/product/${decodeURIComponent(node.slug)}`" :title="node.name">
        <div class="mb-2 capitalize line-clamp-2 overflow-hidden whitespace-normal text-center first_title" v-html="node.name"></div> 
      </NuxtLink>
      <div class="mb-1 text-center litter_title" v-html="node.shortDescription"></div>
      <ProductPrice class="flex justify-center items-center" :sale-price="node.salePrice" :regular-price="node.regularPrice" />
      <StarRating :rating="node.averageRating" :count="node.reviewCount" class="star-rating" />
      <AddToCartButton class="flex-1 w-full md:max-w-xs hidden add-to-cart-btn" :class="{ loading: isUpdatingCart }" @click="addToCart({
        productId: node.databaseId, 
        quantity: 1
      })" />
    </div>
  </div>
</template>

<style lang="postcss">

.product-card:hover {
  background-image: url('/icons/produst_bg_hover.png');
  .litter_title {
    @apply hidden;
  }
  .star-rating {
    @apply hidden;
  }
  .add-to-cart-btn {
    @apply flex;
  }
}
.product-card {
  padding: 20px;
  background-image: url('/icons/produst_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.first_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: rgba(26,26,26,0.95);
}
.litter_title {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 12px;
  color: #8B8B8B;
}
</style>
