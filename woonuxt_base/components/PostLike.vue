<template>
  <div class="right mb-[20px] w-full sm:w-[240px]">
    <div class="top_block">
      <div class="title_bg hidden sm:block">{{ $t("messages.general.recentPosts") }}</div>
      <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:hidden">
        <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block" src="/modile/title_bg.webp" alt="" loading="lazy">
        <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.general.recentPosts") }}</span>
      </div>
      <div class="grid grid-cols-2 gap-[0.63rem] sm:block sm:gap-0 ">
        <NuxtLink :to="`/${locale}/blog/${decodeURIComponent(item.slug)}`" class="row cursor-pointer flex flex-col sm:flex-row sm:mt-[10px] overflow-hidden w-full sm:h-[60px]" v-for="item in recentPosts" :key="item.id">
          <div class="sm:w-[80px] sm:h-[60px]"><img class="w-full h-[5.69rem] sm:h-full object-cover bg-[#f8f8f8]" :src="item.featuredImage ? item.featuredImage.node.sourceUrl : fallbackImage" :alt="item.title || 'post'" loading="lazy"></div>
          <div class="describe mt-[0.31rem] flex-1 sm:py-[12px] sm:px-[10px] sm:bg-[#f8f8f8] sm:mt-0">
            <div>{{ item.title }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="bottom_block mt-[1.88rem] sm:mt-[20px]">
      <div class="title_bg hidden sm:block">{{ $t("messages.product.10") }}</div>
      <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:hidden">
        <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block" src="/modile/title_bg.webp" alt="" loading="lazy">
        <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.product.10") }}</span>
      </div>
      <div class="hidden sm:block">
        <NuxtLink class="row" v-for="item in relatedProducts" :key="item.id" :to="`/${locale}/product/${decodeURIComponent(item.slug)}`">
          <div class="img">
            <img :src="item.image ? item.image.sourceUrl : fallbackImage" :alt="item.name || 'product'" loading="lazy">
          </div>
          <div class="describe">
            <div>{{ item.name }}</div>
          </div>
        </NuxtLink>
      </div>
      <div class="sm:hidden">
        <section v-if="relatedProducts && !!relatedProducts.length" class="relative w-full grid transition-all grid-cols-2 gap-[0.63rem]">
          <ProductCard v-for="(node, i) in relatedProducts" :key="node.id || i" :node="node" :index="i" :class="i === 8 ? 'hidden sm:block' : ''"/>
        </section>
        <NoProductsFound v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const { fallbackImage } = useHelpers();
const { localNum } = useUtils();
const recentPosts = ref([])
const relatedProducts = ref([])
useAsyncGql('GetAllPosts', {
  languages: localNum(locale.value),
  first: 4,
}).then(res => {
  recentPosts.value = res.data.value?.posts?.nodes || [];
})
useAsyncGql('getProducts', {
  language: localNum(locale.value),
  first: 4
}).then(res => {
  relatedProducts.value = res.data.value?.products?.nodes || [];
})
</script>

<style lang='postcss' scoped>
.little_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.94rem;
  color: #7F1C1B;
}
.right {
  .top_block {
    .title_bg {
      background: url('/images/title_bg.webp') no-repeat;
      background-size: 100% 100%;
      font-family: HarmonyOS Sans-Medium;
      font-weight: 500;
      font-size: 14px;
      color: rgba(255,255,255,0.95);
      line-height: 60px;
      @apply w-[240px] h-[60px] text-center;
    }
    .row {
      .describe {
        div {
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 0.88rem;
          color: #1A1A1A;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .bottom_block {
    .title_bg {
      background: url('/images/title_bg.webp') no-repeat;
      background-size: 100% 100%;
      font-family: HarmonyOS Sans-Medium;
      font-weight: 500;
      font-size: 14px;
      color: rgba(255,255,255,0.95);
      line-height: 60px;
      @apply w-[240px] h-[60px] text-center;
    }
    .row {
      background: url('/images/box.webp') no-repeat;
      background-size: 100% 100%;
      @apply flex mt-[10px] p-[7px] w-full overflow-hidden h-[70px] cursor-pointer;
      &:hover {
        background: url('/images/box_hover.webp') no-repeat;
        background-size: 100% 100%;
      }
      .img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 54px;
        height: 54px;
        @apply flex justify-center items-center w-[52px] h-[54px];
        img {
          @apply max-w-[100%] max-h-[100%];
        }
      }
      .describe {
        word-break: break-all;
        @apply flex-1 overflow-hidden py-[9px] px-[8px];
        div {
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 13px;
          color: #292929;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: warp;
        }
      }
    }
  }
}
@media (min-width: 640px) {
  .right .top_block .row .describe div{
    font-size: 13px;
    color: #292929;
  }
}
</style>