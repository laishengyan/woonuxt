<script setup>
const { toggleCart, cart } = useCart();
</script>

<template>
  <div class="flex items-center cursor-pointer h-[28px] cart-trigger pr-5 pl-5 relative" title="Cart" @click="toggleCart">
    <!-- <Icon name="ion:cart-outline" size="16" class="mr-2" /> -->
    <img src="/icons/cart.png" alt="" class="w-4 h-4 mr-2">
    <span>My Cart</span>
    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cart?.contents?.itemCount > 0"
          class="bg-primary rounded-full text-white leading-none min-w-[16px] p-[3px] top-0 right-0 text-[10px] absolute inline-flex justify-center items-center"
          >{{ cart?.contents?.itemCount }}</span
        >
      </Transition>
    </ClientOnly>
  </div>
</template>

<style lang="postcss">
/* popIn */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}
.cart-trigger {
  background: #E0A864;
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
}
</style>
