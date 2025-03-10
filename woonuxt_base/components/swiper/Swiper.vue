<!-- Swiper.vue -->
<template>
  <div class="swiper-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <div class="swiper-wrapper">
      <slot />
    </div>

    <!-- 导航按钮 -->
    <div v-if="showNav" class="navigation">
      <button class="nav-button prev" @click="switchSlide(-1)"><span>{{ "<" }}</span></button>
      <button class="nav-button next" @click="switchSlide(1)"><span>{{ ">" }}</span></button>
    </div>

    <!-- 指示点 -->
    <div v-if="showDots" class="pagination bottom-[0.5rem] md:bottom-[20px]">
      <span 
        v-for="(item, index) in items" 
        :key="index"
        class="dot"
        :class="{ active: activeIndex === index }"
        @click="setActive(index)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, onMounted, onBeforeUnmount, useSlots } from 'vue'

interface SwiperProps {
  duration?: number // 自动播放间隔（ms）
  autoplay?: boolean
  showDots?: boolean
  showNav?: boolean
}

const props = withDefaults(defineProps<SwiperProps>(), {
  duration: 3000,
  autoplay: true,
  showDots: true,
  showNav: true
})

const activeIndex = ref(0)
const direction = ref<'left' | 'right'>('left')
const items = reactive<any[]>([])
let autoPlayTimer: number | null = null

// 注册子组件
const registerItem = (item: any) => {
  items.push(item)
  return items.length - 1
}

// 切换幻灯片
const switchSlide = (step: number) => {
  const newIndex = (activeIndex.value + step + items.length) % items.length
  direction.value = step > 0 ? 'left' : 'right'
  activeIndex.value = newIndex
}

// 设置当前激活项
const setActive = (index: number) => {
  direction.value = index > activeIndex.value ? 'left' : 'right'
  activeIndex.value = index
}

// 自动播放控制
const startAutoPlay = () => {
  if (props.autoplay) {
    autoPlayTimer = setInterval(() => {
      switchSlide(1)
    }, props.duration)
  }
}

const pauseAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 提供上下文给子组件
provide('swiperContext', {
  activeIndex,
  direction,
  registerItem
})

onMounted(startAutoPlay)
onBeforeUnmount(pauseAutoPlay)
</script>

<style scoped>
.swiper-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  position: relative;
  height: 100%;
}

.navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 10;
}

.nav-button {
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
.nav-button span {
  line-height: initial;
}

.nav-button:hover {
  background: rgba(0,0,0,0.8);
}

.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(127, 28, 27, .2);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 16px;
  background: rgba(127, 28, 27 ,0.9);
  border-radius: 10px 10px 10px 10px;
}
</style>