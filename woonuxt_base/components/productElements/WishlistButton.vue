<script setup lang="ts">
const { addToWishlist, removeFromWishlist, isInList } = useWishlist();

const { product } = defineProps<{ product: Product }>();

const isWishlisted = computed(() => (product.databaseId ? isInList(product.databaseId) : false));

const toggleWishlist = () => (isWishlisted.value && product.databaseId ? removeFromWishlist(product.databaseId) : addToWishlist(product));
</script>

<template>
  <button type="button" class="cursor-pointer flex mt-[0] sm:mt-4 text-sm text-gray-400 justify-center sm:justify-start sm:gap-2 items-center wish_btn" @click="toggleWishlist">
    <Icon v-if="isWishlisted" name="ion:heart" size="18" class="text-red-400" />
    <Icon v-else name="ion:heart-outline" size="18" />
    <span>{{ isWishlisted ? $t('messages.shop.wishlistRemove') : $t('messages.shop.wishlistAdd') }}</span>
  </button>
</template>

<style scoped lang="postcss">
.cursor-pointer {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #292929;
}
@media (max-width: 640px) {
  .wish_btn {
    background-image: url("/modile/wishlist_btn.webp");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 0.88rem;
    color: #292929;
    @apply w-[8.13rem] h-[3.13rem];
    svg {
      display: none !important;
    }
  }
}
</style>
