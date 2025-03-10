<template>
  <button class="scroll-top" :title="$t('messages.goUp')" :aria-label="$t('messages.goUp')" @click="handleClick">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      <path d="M5 15.5L12 8.5L19 15.5"/>
    </svg>
  </button>
</template>
<script setup>
const { scrollToTop } = useHelpers();
const handleClick = () => {
  scrollToTop()
}
onMounted(() => {
  const scrollBtn = document.querySelector('.scroll-top');
  // 显示/隐藏按钮
  window.addEventListener('scroll', () => {
    const showHeight = 200; // 滚动超过200px显示
    scrollBtn.classList.toggle('show', window.scrollY > showHeight);
  });
})
</script>
<style scoped lang='postcss'>
  .scroll-top {
    /* 视觉设计 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    visibility: hidden;
    transition: all 0.3s ease;

    @apply fixed bottom-[0.63rem] right-[0.63rem] sm:bottom-[30px] sm:right-[30px] w-[42px] h-[42px] bg-white rounded-[50%] cursor-pointer border-[1px_solid_#eee] opacity-0 flex items-center justify-center;
  }

  /* 显示按钮 */
  .scroll-top.show {
    opacity: 1;
    visibility: visible;
  }
  /* 箭头图标 */
  .scroll-top svg {
    width: 50%;
    stroke: #666;
    transition: all 0.2s ease;
  }
  @media (min-width: 640px) {
    .scroll-top:hover svg {
      stroke: white;
    }
    /* 悬停效果 */
    .scroll-top:hover {
      background: #4a90e2;
      box-shadow: 0 4px 12px rgba(74,144,226,0.25);
    }
  }
</style>