<!-- SwiperItem.vue -->
<template>
  <div 
    class="swiper-item" 
    :class="{
      'active': isActive,
      'slide-left': isActive && direction === 'left',
      'slide-right': isActive && direction === 'right'
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, computed } from 'vue'

const swiperContext = inject('swiperContext') as any
const index = ref(-1)

const isActive = computed(() => swiperContext.activeIndex.value === index.value)
const direction = computed(() => swiperContext.direction.value)

onMounted(() => {
  index.value = swiperContext.registerItem({})
})
</script>

<style scoped>
.swiper-item {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.5s ease;
  transform: translateX(100%);
}

.swiper-item.active {
  opacity: 1;
  transform: translateX(0);
}

.slide-left.active {
  transform: translateX(0);
}

.slide-left:not(.active) {
  transform: translateX(-100%);
}

.slide-right.active {
  transform: translateX(0);
}

.slide-right:not(.active) {
  transform: translateX(100%);
}
</style>