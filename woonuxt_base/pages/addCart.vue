<script setup lang="ts">
const { cart, toggleCart, isUpdatingCart } = useCart();
const { isQueryEmpty } = useHelpers();
const { localNum } = useUtils();
const { locale, t } = useI18n();

const products = ref<Product[]>([]);

useAsyncGql('getProducts', {
  language: localNum(locale.value),
  first: 6
}).then((res: any) => {
  products.value = res.data.value?.products?.nodes || []
})

useHead({
  title:  t('messages.shop.cart'),
  meta: [{ hid: t('messages.shop.cart'), name:t('messages.shop.cart'), content: t('messages.shop.cart') }],
})
</script>

<template>
  <div class="container max-w-[1200px] min-h-[600px] px-[0.63rem] sm:px-[0]">
    <Breadcrumb :isCart="true" class="mb-4 sm:mb-[10px]" />
    <!-- <Icon name="ion:close-outline" class="absolute p-1 bg-white rounded-lg shadow-lg top-6 left-6 md:left-8" size="34" @click="toggleCart(false)" />
    <EmptyCart v-if="cart && !cart.isEmpty" class="rounded-lg shadow-lg p-1.5 hover:bg-red-400 hover:text-white" /> -->

    <div class="mt-6 text-left hidden sm:block">
      {{ $t('messages.shop.cart') }}
      <span v-if="cart?.contents?.productCount"> ({{ cart?.contents?.productCount }}) </span>
    </div>

    <ClientOnly>
      <template v-if="cart && !cart.isEmpty">
        <div class="cart-list-header hidden sm:flex">
          <span>{{ $t('messages.cart.1') }}</span>
          <span>{{ $t('messages.cart.2') }}</span>
          <span>{{ $t('messages.cart.3') }}</span>
          <span>{{ $t('messages.cart.4') }}</span>
        </div>
        <ul class="flex flex-col flex-1">
          <CartCard v-for="(item, index) in cart.contents?.nodes" :key="item.key" :item :class="{
            'mt-[1.25rem]': index != 0
          }" />
        </ul>
        <div class="cart-total-container w-full h-[3.13rem] sm:h-[60px] sm:my-[20px] bg-white sm:bg-[#F8F8F8] flex justify-between items-center sm:py-[20px]">
          <span>{{ $t('messages.cart.5') }}</span>
          <span v-html="cart.total" />
        </div>
        <div class="flex flex-col-reverse sm:flex-row justify-end mt-[0.63rem] sm:mt-0 sm:mb-8 gap-[0.63rem] sm:gap-[20px]">
          <div class="Browsing-button-container w-full h-[2.81rem] sm:w-[240px] sm:h-[44px] flex items-center justify-center cursor-pointer">
            <NuxtLink class="block text-lg text-center justify-evenly" :to="`/${locale}`">
              <span class="mx-2">{{ $t('messages.cart.6') }}</span>
            </NuxtLink>
          </div>
          <div class="checkOut-button-container w-full h-[2.81rem] sm:w-[240px] sm:h-[44px] flex items-center justify-center cursor-pointer">
            <NuxtLink class="block text-lg text-center text-white justify-evenly" :to="`/${locale}/checkout`">
              <span class="mx-2">{{ $t('messages.shop.checkout') }}</span>
            </NuxtLink>
          </div>
        </div>
      </template>
      <!-- Empty Cart Message -->
      <div v-else class="flex flex-col items-center justify-center flex-1 mb-12">
        <div class="mb-20 text-xl text-gray-300">{{ $t('messages.shop.cartEmpty') }}</div>
      </div>
    </ClientOnly>
    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25">
      <LoadingIcon />
    </div>
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t('messages.cart.popularProducts') }}</span>
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
<style scoped lang="postcss">
.cart-list-header {
  width: 1200px;
  height: 40px;
  margin-top: 14px;
  background: #7F1C1B;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
  span:nth-child(1) {
    width: 660px;
  }
  span:nth-child(2) {
    width: 196px;
  }
  span:nth-child(3) {
    width: 240px;
  }
  span:nth-child(4) {
    width: 100px;
  }
}
.cart-total-container {
  border-bottom: 0.03rem solid rgba(0, 0, 0, 0.10);
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1.19rem;
  color: #1A1A1A;
}
.checkOut-button-container {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #FFFFFF;
  background: url("/images/default-button.png") no-repeat;
  background-size: 100% 100%;
  &:hover {
    background: url("/images/default-button-hover.png") no-repeat;
    background-size: 100% 100%;
  }
}
.Browsing-button-container {
  font-family:HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #292929;
  background: url("/images/default-button-white.png") no-repeat;
  background-size: 100% 100%;
  &:hover {
    background: url("/images/default-button-white-hover.png") no-repeat;
    background-size: 100% 100%;
  }
}
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
  .cart-total-container {
    border-bottom: none;
    font-size: 24px;
  }
}
</style>
