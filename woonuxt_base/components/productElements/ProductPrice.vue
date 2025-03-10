<script setup lang="ts">
interface ProductPriceProps {
  regularPrice?: string | null;
  salePrice?: string | null;
}

const { regularPrice, salePrice } = defineProps<ProductPriceProps>();
</script>

<template>
  <div v-if="regularPrice" class="flex font-price color-primary">
    <span v-if="salePrice" class="mr-2" v-html="salePrice" />
    <span :class="{ 'text-gray-400 line-through font-normal': salePrice }" v-html="regularPrice" />
  </div>
</template>
<style scoped>
.font-price {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #7F1C1B;
}
.font-price span:not(:first-child) {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  color: #8B8B8B;
}
@media (min-width: 640px) {
  .font-price {
    font-size: 18px;
  }
}
</style>
