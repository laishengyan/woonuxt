<script setup lang="ts">
const { fallbackImage } = useHelpers();
const { locale } = useI18n();
const props = defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'eager' },
});

const imageWidth = 129;
const ImageHeight = 129;
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/${locale}/category/${decodeURIComponent(node.slug)}`"
    class="relative flex justify-center overflow-hidden item max-w-[129px]" :title="node.image?.title || node.name" :key="node.id">
    <NuxtImg
      :width="imageWidth"
      :height="ImageHeight"
      class="absolute object-cover"
      :src="node.image?.sourceUrl || fallbackImage"
      sizes="100vw sm:50vw md:100px"
      :loading="imageLoading"
      :alt="node.image?.title || node.name"
      preload
      placeholder
      format="webp"
      placeholder-class="blur-xl"
      >
    </NuxtImg>
    <span class="relative z-10 mt-auto mb-0 capitalize" v-html="node.name" />
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.item {
  aspect-ratio: 4 / 5;
}
.item span {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.58rem;
  color: #292929;
}
@media (min-width: 640px) {
  .item span {
    font-size: 14px;
  }
}
</style>
