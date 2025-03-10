<script setup lang="ts">
const route = useRoute();
const { isCategory } = defineProps({
  isCategory: { type: Boolean, default: false },
})
const { productsPerPage } = useHelpers();
const { products } = useProducts();
const page = ref(parseInt((route.params.pageNumber) as string) || 1);
const productsToShow = computed(() => {
  return products.value.slice(0, page.value * productsPerPage)
  
});
onMounted(() => {
  const footer = document.querySelector('footer');
  let isLoading = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading) {
        isLoading = true;
        loadNextPage().finally(() => {
          isLoading = false;
        });
      }
    });
  }, {
    root: null, // 监听视口
    rootMargin: '0px 0px 300px 0px', // 提前 200px 触发（可调整）
    threshold: 0.1,
  });

  if (footer) observer.observe(footer);

  async function loadNextPage() {
    if ((page.value - 1) * productsPerPage >= products.value.length) return;
    page.value++;
  }
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <section v-if="!!products?.length" class="relative w-full mb-[2.5rem] sm:mb-[20px]">
      <TransitionGroup name="shrink" tag="div" mode="in-out" class="product-grid gap-[0.63rem] sm:gap-[20px]">
        <ProductCard v-for="(node, i) in productsToShow" :key="node.id || i" :node="node" :index="i" />
      </TransitionGroup>
      <!-- <Pagination :isCategory="isCategory" /> -->
    </section>
    <NoProductsFound v-else />
  </Transition>
</template>

<style lang="postcss" scoped>
.product-grid {
  @apply min-h-[200px] grid transition-all lg:my-8;

  grid-template-columns: repeat(2, 1fr);
}
.product-grid:empty {
  display: none;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.shrink-move {
  transition: all 400ms;
}

.shrink-leave-active {
  transition: transform 300ms;
  position: absolute;
  opacity: 0;
}

.shrink-enter-active {
  transition:
    opacity 400ms ease-out 200ms,
    transform 400ms ease-out;
  will-change: opacity, transform;
}

.shrink-enter,
.shrink-leave-to,
.shrink-enter-from {
  opacity: 0;
  transform: scale(0.75) translateY(25%);
}
</style>
