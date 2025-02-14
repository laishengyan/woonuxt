<script setup lang="ts">
const { fallbackImage } = useHelpers();

const props = defineProps({
  mainImage: { type: Object, required: true },
  gallery: { type: Object, required: true },
  node: { type: Object, required: true },
  activeVariation: { type: Object, required: false },
});

const primaryImage = computed(() => ({
  sourceUrl: props.mainImage.sourceUrl || fallbackImage,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

const imageToShow = ref(primaryImage.value);

const galleryImages = computed(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  return [primaryImage.value, ...props.gallery.nodes].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

const changeImage = (image: any) => {
  if (image) imageToShow.value = image;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    if (newVal?.image) {
      const foundImage = galleryImages.value.find((img) => img.databaseId === newVal.image?.databaseId);
      if (foundImage) imageToShow.value = foundImage;
    }
  },
);
watch(
  () => props.mainImage,
  (newVal) => {
    if (newVal) imageToShow.value = primaryImage.value;
  },
)
</script>

<template>
  <div>
    <!-- <SaleBadge :node="node" class="absolute text-base top-4 right-4" /> -->
    <img
      class="rounded-xl object-contain w-[600px] h-[600px] min-w-[350px]"
      width="600"
      height="600"
      :alt="imageToShow.altText || node.name"
      :title="imageToShow.title || node.name"
      :src="imageToShow.sourceUrl || fallbackImage"
      fetchpriority="high"
      placeholder
      placeholder-class="blur-xl" />
  </div>
</template>
