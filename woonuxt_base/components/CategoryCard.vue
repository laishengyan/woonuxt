<script setup lang="ts">
const { fallbackImage } = useHelpers();
const { locale } = useI18n();
const props = defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
});

const imageWidth = 129;
const ImageHeight = 129;
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/${locale}/product-category/${decodeURIComponent(node.slug)}`"
    class="relative flex justify-center overflow-hidden item max-w-[129px]">
    <img
      :width="imageWidth"
      :height="ImageHeight"
      class="absolute object-cover"
      :src="node.image?.sourceUrl || fallbackImage"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="imageLoading"
      placeholder
      />
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
  font-size: 14px;
  color: #292929;
}
</style>
