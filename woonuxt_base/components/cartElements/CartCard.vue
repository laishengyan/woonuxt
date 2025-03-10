<script setup>
const { updateItemQuantity } = useCart();
const { addToWishlist } = useWishlist();
const { fallbackImage } = useHelpers();
const { locale } = useI18n();
const { item } = defineProps({
  item: { type: Object, required: true },
  isOrderSummary: { type: Boolean, default: false }
});

const productType = computed(() => (item.variation ? item.variation?.node : item.product?.node));
const productSlug = computed(() => `/${locale.value}/product/${decodeURIComponent(item.product.node.slug)}`);
const isLowStock = computed(() => (productType.value.stockQuantity ? productType.value.lowStockAmount >= productType.value.stockQuantity : false));

const removeItem = () => {
  updateItemQuantity(item.key, 0);
};

const moveToWishList = () => {
  addToWishlist(item.product.node);
  removeItem();
};

const itemTotal = ref((parseFloat(productType.value.rawPrice) * parseFloat(item.quantity)).toFixed(2))
const handleChange = (val) => {
  console.log(productType)
  itemTotal.value = (parseFloat(productType.value.rawPrice) * parseFloat(val)).toFixed(2)
}
const salePercentage = computed(() => {
  const regularPrice = parseFloat(productType.value.regularPrice.replace(/\D/g, ''));
  const salePrice = parseFloat(productType.value.salePrice.replace(/\D/g, ''));
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100) + '%';
});
</script>

<template>
  <SwipeCard @remove="removeItem">
    <div v-if="productType" class="flex group content_border">
      <div class="flex" :class="{
        'sm:w-[640px] sm:h-[240px] sm:py-[20px]': !isOrderSummary
      }">
        <NuxtLink :to="productSlug">
          <NuxtImg
            width="100%"
            height="100%"
            class="w-[5rem] h-[5rem] rounded-md skeleton object-contain"
            :class="{
              'sm:w-[200px] sm:h-[200px]': !isOrderSummary
            }"
            :src="productType.image?.sourceUrl || item.product.image?.sourceUrl || fallbackImage"
            :title="productType.image?.title || productType.name"
            loading="eager" preload placeholder placeholder-class="blur-xl" format="webp">
          </NuxtImg>
        </NuxtLink>
        <div class="pl-[20px] flex-1 hidden" :class="{
              'sm:block': !isOrderSummary
            }">
          <NuxtLink class="leading-tight" :to="productSlug">{{ productType.name }}</NuxtLink>
        </div>
      </div>
      <div class="flex flex-1 overflow-hidden ml-[0.63rem] flex-col" :class="{
              'sm:flex-row sm:ml-[0]': !isOrderSummary
            }">
        <div class="flex-1" :class="{
              'sm:hidden': !isOrderSummary
            }">
          <NuxtLink class="leading-tight" :to="productSlug">{{ productType.name }}</NuxtLink>
        </div>
        <div class="flex items-center flex-row mt-[0.63rem] gap-[0.63rem]" :class="{
              'sm:flex-col sm:mt-0 sm:w-[190px] sm:py-[20px] sm:gap-0 sm:items-start': !isOrderSummary
            }">
          <div class="flex-1 overflow-hidden" :class="{
              'sm:flex-none sm:w-[80px] sm:mb-[10px] ': !isOrderSummary
            }">
            <QuantityInput :item @change="handleChange"/>
          </div>
          <div class="text-xs text-gray-400 group-hover:text-gray-700 flex leading-none items-center btn_remove justify-center w-[2.5rem] h-[2.5rem]" :class="{
              'sm:justify-start': !isOrderSummary
            }">
            <button title="Remove Item" aria-label="Remove Item" @click="removeItem" type="button" class="flex items-center gap-1 hover:text-red-500 cursor-pointer">
              <img style="width:16px; height: 16px;" src="/images/delete.png" alt="" loading="lazy">
            </button>
          </div>
        </div>
        <div class="w-full mt-[0.63rem]" :class="{
              'sm:w-[232px] sm:py-[20px]': !isOrderSummary
            }">
          <ProductPrice class="mt-1 text-xs" :sale-price="productType.salePrice" :regular-price="productType.regularPrice" />
        </div>
        <div class="cart-item-four-container hidden" :class="{
              'sm:block': !isOrderSummary
            }">
          <span>${{ itemTotal }}</span>
        </div>
      </div>
    </div>
  </SwipeCard>
</template>
<style lang="postcss" scoped>
.leading-tight {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #1A1A1A;
}
.font-price {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #292929;
}
.cart-item-four-container {
  width: 100px;
  padding: 20px 0;
  .font-price {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 15px;
    color: #292929;
  }
}
.btn_remove {
  border: 0.06rem solid #CBCBCB;
}
@media (min-width: 640px) {
  .btn_remove {
    border: none;
    width: initial;
    height: initial;
  }
}
</style>
