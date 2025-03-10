<script setup>
const { cart } = useCart();
const props = defineProps({
  disabled: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false },
  isProduct: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false }
});
const isLoading = ref(false);
const { t } = useI18n();
const addToCartButtonText = computed(() => (isLoading.value ? t('messages.shop.adding') : t('messages.shop.addToCart')));

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});
watch(isLoading, (val) => {
  isLoading.value = val;
});
</script>

<template>
  <button
    v-if="isProduct"
    type="submit"
    class="flex items-center justify-center sm:mt-2 sm:pt-[9px] sm:pb-[10px] buttonProduct h-[3.13rem]"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    @click="isLoading = true">
    <span class="inline-block">{{ addToCartButtonText }}</span>
    <LoadingIcon v-if="isLoading" stroke="4" size="12" color="#fff" />
  </button>
  <button
    v-else
    type="submit"
    class="flex items-center justify-center sm:mt-2 sm:pt-[9px] sm:pb-[10px]"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    @click="isLoading = true">
    <img class="w-4 h-4 hidden sm:inline-block" src="/icons/cart.png" alt="" loading="lazy">
    <span class="hidden sm:inline-block">{{ addToCartButtonText }}</span>
    <img src="/modile/cat_click.webp" class="w-[0.86rem] h-[0.8rem] sm:hidden" alt="" :class="{
      hidden: isLoading
    }">
    <LoadingIcon v-if="isLoading" stroke="4" size="12" :color="isMobile ? '#7F1C1B' : '#fff'" />
  </button>
</template>

<style lang="postcss" scoped>
button {
  outline: none !important;
  transition: all 150ms ease-in;
}

button.disabled {
  @apply cursor-not-allowed bg-gray-400;
}
.buttonProduct {
  background-image: url('/modile/btn_master.webp');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
  background-color: transparent;
}
@media (min-width: 640px) {
  button {
    background-image: url('/icons/add_btn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: HarmonyOS Sans-Regular;
    font-weight: 400;
    font-size: 13px;
    color: rgba(255,255,255,0.95);
    background-color: transparent;
  }
}
</style>
