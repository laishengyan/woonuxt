<script setup>
const { cart } = useCart();
const props = defineProps({
  disabled: { type: Boolean, default: false },
});
const isLoading = ref(false);
const { t } = useI18n();
const addToCartButtonText = computed(() => (isLoading.value ? t('messages.shop.adding') : t('messages.shop.addToCart')));

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});
</script>

<template>
  <button
    type="submit"
    class="flex items-center justify-center mt-2 pt-[9px] pb-[10px]"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    @click="isLoading = true">
    <img class="w-4 h-4" src="/icons/cart.png" alt="">
    <span>{{ addToCartButtonText }}</span>
    <LoadingIcon v-if="isLoading" stroke="4" size="12" color="#fff" />
  </button>
</template>

<style lang="postcss" scoped>
button {
  outline: none !important;
  transition: all 150ms ease-in;
  background-image: url('/icons/add_btn.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
  background-color: transparent;
}

button.disabled {
  @apply cursor-not-allowed bg-gray-400;
}
</style>
