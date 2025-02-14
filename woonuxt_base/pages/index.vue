<script lang="ts" setup>
const ProductCategoriesData = await useAsyncGql('getProductCategories', { first: 8 });
const productCategories = ProductCategoriesData?.data.value?.productCategories?.nodes || [];

const { data } = await useAsyncGql('getProducts');
const products = (data?.value?.products?.nodes?.filter((item: Object, i: number) => i < 9) || []) as Products[];

useSeoMeta({
  title: `Home`,
  ogTitle: `WooNuxt`,
  description: `This is an example of a WooNuxt store. It provides a modern, fast, and SEO friendly ecommerce store built with Nuxt and WooCommerce.`,
  ogDescription: `This is an example of a WooNuxt store. It provides a modern, fast, and SEO friendly ecommerce store built with Nuxt and WooCommerce.`,
  ogImage: `https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png`,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <HeroBanner />
    
    <div class="little_title relative min-h-[44px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png" alt="">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png">Shop By Category</span>
    </div>
    <!-- <div class="container flex flex-wrap items-center justify-center my-16 text-center gap-x-8 gap-y-4 brand lg:justify-between">
      <img src="/images/logoipsum-211.svg" alt="Brand 1" width="132" height="35" />
      <img src="/images/logoipsum-221.svg" alt="Brand 2" width="119" height="30" />
      <img src="/images/logoipsum-225.svg" alt="Brand 3" width="49" height="48" />
      <img src="/images/logoipsum-280.svg" alt="Brand 4" width="78" height="30" />
      <img src="/images/logoipsum-284.svg" alt="Brand 5" width="70" height="44" />
      <img src="/images/logoipsum-215.svg" alt="Brand 6" width="132" height="40" />
    </div> -->

    <section class="container max-w-[1200px] mb-[50px]">
      <div class="grid justify-center grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-8">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
    </section>

    <div class="little_title relative min-h-[44px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png" alt="">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png">Featured & New</span>
    </div>
    <div class="container max-w-[1200px] mt-[10px]">
      <TransitionGroup name="shrink" tag="div" mode="in-out" class="product-grid">
        <ProductCard v-for="(node, i) in products" :key="node.id || i" :node="node" :index="i" />
      </TransitionGroup>
    </div>
    <div class="little_title relative min-h-[44px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png" alt="">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png">Pruduct Reviews</span>
    </div>
    <ProductReviews></ProductReviews>
    <!-- <section class="container grid gap-4 my-24 md:grid-cols-2 lg:grid-cols-4">
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/box.svg" width="60" height="60" alt="Free Shipping" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Free Shipping</h3>
          <p class="text-sm">Free shipping on order over €50</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/moneyback.svg" width="60" height="60" alt="Money Back" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Peace of Mind</h3>
          <p class="text-sm">30 days money back guarantee</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/secure.svg" width="60" height="60" alt="Secure Payment" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">100% Payment Secure</h3>
          <p class="text-sm">Your payment are safe with us.</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/support.svg" width="60" height="60" alt="Support 24/7" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Support 24/7</h3>
          <p class="text-sm">24/7 Online support</p>
        </div>
      </div>
    </section> -->
  </main>
</template>

<style scoped lang="postcss">
.product-grid {
  @apply my-4 min-h-[600px] grid transition-all lg:my-8 gap-[20px];

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
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}
.little_title {
  margin: 20px 0;
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 16px;
  color: #7F1C1B;
}
</style>
