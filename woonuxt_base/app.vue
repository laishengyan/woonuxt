<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const { localNum } = useUtils();
const { viewer } = useAuth();
const { data, refresh } = await useAsyncData(
  'global-data',
  async () => {
    const { data: categories } = await useAsyncGql('getProductCategories', { first: 8, languages: localNum(locale.value) })
    return categories.value
  },
  {
    server: true, // 强制服务端执行
    watch: [locale] // 监听语言变化
  }
)
// 提供全局可响应数据
provide('globalCategories', data)
const { isShowingCart, toggleCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu } = useHelpers();
const { addBodyClass, removeBodyClass } = useHelpers();
const closeCartAndMenu = () => {
  toggleCart(false);
  toggleMobileMenu(false);
};

watch([isShowingCart, isShowingMobileMenu], () => {
  isShowingCart.value || isShowingMobileMenu.value ? addBodyClass('overflow-hidden') : removeBodyClass('overflow-hidden');
});
const isShowTopOrFooter = computed(() => !route.path.includes('/my-account') || viewer.value)
watch(
  () => route.path,
  () => closeCartAndMenu(),
);
const { data: generalSettings } = await useAsyncGql('generalSettings')
provide('generalSettings', generalSettings)
useHead({
  titleTemplate: (title: any) => 
    `${title} | ${generalSettings.value?.generalSettings?.title || 'oriental-art.net'}`
});
</script>

<template>
  <NuxtLoadingIndicator />
  <div class="flex flex-col min-h-screen bg-[#ffffff]">
    <AppHeader :isShowTopOrFooter :class="{
      'hidden sm:block': route.path.includes('/my-account')
    }" />

    <Transition name="slide-from-right">
      <LazyCart v-if="isShowingCart" />
    </Transition>

    <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition>

    <NuxtPage />

    <Transition name="fade">
      <div v-if="isShowingCart || isShowingMobileMenu" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeCartAndMenu" />
    </Transition>

    <LazyAppFooter v-if="isShowTopOrFooter" />
    <!-- 全屏 Loading -->
    <div id="loading" class="hide">
      <div></div>
    </div>
  </div>
</template>

<style lang="postcss">
html,
body {
  @apply bg-gray-100 text-gray-900;
  scroll-behavior: smooth;
}

img {
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

pre {
  @apply rounded bg-gray-800 my-8 text-xs text-white p-4 whitespace-pre-wrap overflow-auto;
}

select {
  @apply bg-white border rounded-md font-medium border-gray-300 flex-1 text-sm p-1.5 pr-12 pl-4 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-20 py-2 px-4 appearance-none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
    center right 10px no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Slide-from-right & Slide-from-left */
.slide-from-right-leave-active,
.slide-from-right-enter-active,
.slide-from-left-leave-active,
.slide-from-left-enter-active {
  transition: transform 300ms ease-in-out;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(500px);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-500px);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Y */
.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 500ms linear;
  will-change: max-height, opacity;
  max-height: 9999px;
  overflow: hidden;
  opacity: 1;
}

.scale-y-enter-from,
.scale-y-leave-to {
  max-height: 0;
  opacity: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.custom-scrollbar::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar {
  @apply rounded bg-gray-100 w-1.5;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply rounded bg-gray-400;
}

@keyframes fadeIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeDisabledIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 0.7;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.001;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 20ms;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.page-enter-active {
  animation-duration: 200ms;
  animation-name: fadeIn;
  animation-timing-function: linear;
  backface-visibility: hidden;
}

.page-leave-active {
  animation-name: fadeOut;
  animation-duration: 200ms;
}

@keyframes skelaton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

img.skeleton {
  animation: skelaton 2000ms infinite cubic-bezier(0.4, 0, 0.2, 1);
  background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

/* 全屏覆盖样式 */
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保在最上层 */
}

/* 隐藏 Loading */
#loading.hide {
  display: none;
}

#loading > div{
  width: 30px;
  height: 30px;
  border: 2px solid #000;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* 在 app.css 添加 */
.product-grid .product-card {
  contain: layout;
}
</style>
