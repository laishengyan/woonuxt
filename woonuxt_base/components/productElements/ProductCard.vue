<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
// 优化后的计算属性逻辑
const variationsCache = new WeakMap();
const props = defineProps({
  node: { type: Object, default: null },
  index: { type: Number, default: 1 },
});
const { addToCart, isUpdatingCart } = useCart();

// example: ?filter=pa_color[green,blue],pa_size[large]
const filterQuery = ref(route.query.filter);
// const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

// watch filterQuery
// watch(
//   () => route.query,
//   () => {
//     filterQuery.value = route.query.filter;
//     paColor.value = filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || [];
//   },
// );

const mainImage = computed<string>(() => props.node?.image?.sourceUrl || '/images/placeholder.jpg');
const imagetoDisplay = computed<string>(() => {
   // 添加缓存机制
   if (variationsCache.has(props.node)) {
    return variationsCache.get(props.node);
  }

  const activeImage = mainImage.value;
  variationsCache.set(props.node, activeImage);
  return activeImage;
  // if (paColor.value.length) {
  //   const activeColorImage = props.node?.variations?.nodes.filter((variation) => {
  //     const hasMatchingAttributes = variation.attributes.nodes.some((attribute) => paColor.value.some((color) => attribute.value.includes(color)));
  //     const hasMatchingSlug = paColor.value.some((color) => variation.slug.includes(color));
  //     return hasMatchingAttributes || hasMatchingSlug;
  //   });
  //   if (activeColorImage?.length) return activeColorImage[0].image?.sourceUrl || mainImage.value;
  // }
});
</script>

<template>
  <div class="relative product-card" :key="node.id">
    <NuxtLink :to="`/${locale}/product/${decodeURIComponent(node.slug)}`" :title="node.name"  class="flex justify-center items-center bg-[#f8f8f8] overflow-hidden m-h-[9.5rem] sm:min-h-[300px]">
      <!-- <SaleBadge :node="node" class="absolute top-2 right-2" /> -->
      <NuxtImg
      :src="mainImage"
      sizes="100vw sm:50vw md:300px"
      :alt="node.image?.altText || node.name"
      :loading="index < 3 ? 'eager' : 'lazy'"
      width="200" 
      height="200"
      class="object-contain w-full h-[9.5rem] sm:h-[300px]"
      format="webp"
      decoding="async"
      :modifiers="{ f: 'webp', q: '75' }"
      :fetchpriority="index < 3 ? 'high' : 'low'"
      preload
      placeholder
      placeholder-class="blur-xl"
      densities="x1 x2"
      />
    </NuxtLink>
    <div class="p-2 flex flex-col align-center justify-center" style="line-height: initial;">
      <NuxtLink :to="`/${locale}/product/${decodeURIComponent(node.slug)}`" :title="node.name">
        <div class="mb-2 capitalize line-clamp-2 overflow-hidden whitespace-normal text-center first_title" v-html="node.name"></div> 
      </NuxtLink>
      <div class="mb-1 text-center overflow-hidden litter_title hidden h-[1.2rem] sm:block" v-html="node.shortDescription"></div>
      <ProductPrice class="flex justify-center items-center" :sale-price="node.salePrice" :regular-price="node.regularPrice" v-once />
      <StarRating :rating="node.averageRating" :count="node.reviewCount" class="star-rating hidden sm:inline-flex h-[1.5rem]" />
      <div class="flex justify-between items-center mt-[0.25rem] block sm:hidden">
        <StarRating :rating="node.averageRating" :count="node.reviewCount" :size="10" class="star-rating" />
        <AddToCartButton class="w-[1.5rem] h-[1.5rem] flex justify-center items-center" :class="{ loading: isUpdatingCart }" @click="addToCart({
            productId: node.databaseId, 
            quantity: 1
          })" isMobile />
      </div>
      <AddToCartButton class="w-full add-to-cart-btn hidden" :class="{ loading: isUpdatingCart }" @click="addToCart({
        productId: node.databaseId, 
        quantity: 1
      })" />
    </div>
  </div>
</template>

<style lang="postcss">
/* 在商品卡片添加GPU层 */
.product-card {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

/* 图片容器单独分层 */
.NuxtImg-wrapper {
  isolation: isolate;
}
.product-card {
  background-image: url('/icons/produst_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  @apply p-[0.63rem]
}
.first_title {
  font-family: HarmonyOS Sans-Medium;
  font-display: swap; /* 添加字体交换策略 */
  font-weight: 500;
  font-size: 0.88rem;
  color: #1A1A1A;
}
.litter_title {
  font-family: HarmonyOS Sans-Regular;
  font-display: swap; /* 添加字体交换策略 */
  font-weight: 400;
  font-size: 12px;
  color: #8B8B8B;
  p {
    text-overflow: ellipsis;
    w: 100%;
    white-space: nowrap;
    overflow: hidden;
  }
}
@media (min-width: 640px) {
  .product-card {
    padding: 20px;
    overflow: hidden;
  }
  .first_title {
    color: rgba(26,26,26,0.95);
  }
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
}
</style>
