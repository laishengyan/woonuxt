<script setup lang="ts">
const { removeFromWishlist } = useWishlist();
const { product } = defineProps<{ product: Product }>();
const { locale } = useI18n();
</script>

<template>
  <li class="sm:bg-[#F7F7F7] pb-[1.25rem] sm:p-3 cursor-pointer flex gap-[0.63rem] sm:gap-4">
    <NuxtLink v-if="product.slug" :to="`/${locale}/product/${decodeURIComponent(product.slug)}`">
      <img
        v-if="product?.image?.cartSourceUrl"
        class="object-cover w-[5rem] h-[5rem] sm:h-[120px] sm:w-[100px] bg-[#f8f8f8]"
        :src="product?.image?.cartSourceUrl || product.image?.sourceUrl || '/images/placeholder.jpg'"
        :alt="product.image?.altText || product.name"
        :title="product.image?.altText || product.name"
        width="100%"
        height="100%" 
        loading="lazy"
        />
    </NuxtLink>
    <div class="h-full flex-col sm:py-[5px] justify-between flex flex-1">
      <NuxtLink v-if="product.slug" class="text-lg leading-tight" :to="`/${locale}/product/${decodeURIComponent(product.slug)}`">{{ product.name }}</NuxtLink>
      <div class="flex items-center w-full justify-between mt-[1.25rem] sm:mt-0">
        <ProductPrice :sale-price="product.salePrice" :regular-price="product.regularPrice" class="ProductPrice"/>
        <button v-if="product.databaseId" title="Remove Item" @click="removeFromWishlist(product.databaseId)" class="flex items-start">
          <img src="/images/delete.png" loading="lazy">
        </button>
      </div>
    </div>
  </li>
</template>
<style lang="postcss" scoped>
li {
  border: none;
  border-bottom: 0.03rem solid rgba(0,0,0,0.1);
  border-bottom-width: 0.03rem !important;
  border-color: rgba(0,0,0,0.1) !important;
}
.ProductPrice {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #292929;
}
.ProductPrice>span:nth-child(1) {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #292929;
}
.ProductPrice>span:nth-child(2) {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #686868;
  text-decoration-line: line-through;
}
@media (min-width: 640px) {
  li {
    border: none;
  }
}
</style>
