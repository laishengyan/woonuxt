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
const magnifier = ref(null);
const container_box = ref(null);
const image = ref(null);
const zoomLevel = 3; // 放大倍数

const handleMousemove = (e: any) => {
  const rect = container_box.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 获取图片的实际显示尺寸
  const naturalWidth = image.value.naturalWidth; // 图片原始宽度
  const naturalHeight = image.value.naturalHeight; // 图片原始高度
  const containerWidth = container_box.value.offsetWidth; // 容器宽度
  const containerHeight = container_box.value.offsetHeight; // 容器高度

  // 计算图片的实际显示尺寸（保持宽高比）
  const ratio = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight);
  const displayedWidth = naturalWidth * ratio;
  const displayedHeight = naturalHeight * ratio;

  // 计算图片在容器中的偏移量（居中显示）
  const offsetX = (containerWidth - displayedWidth) / 2;
  const offsetY = (containerHeight - displayedHeight) / 2;
  // 判断鼠标是否在图片范围内
  if (x < offsetX || x > offsetX + displayedWidth || y < offsetY || y > offsetY + displayedHeight) {
      magnifier.value.style.display = 'none'; // 鼠标不在图片范围内，隐藏放大镜
      return;
  }

  // 显示放大镜
  magnifier.value.style.display = 'block';

  // 设置放大镜的位置
  magnifier.value.style.left = `${x - magnifier.value.offsetWidth / 2}px`;
  magnifier.value.style.top = `${y - magnifier.value.offsetHeight / 2}px`;

  // 计算背景图片的尺寸
  const bgWidth = naturalWidth * zoomLevel;
  const bgHeight = naturalHeight * zoomLevel;
  magnifier.value.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

  // 计算背景图片的位置
  const bgX = ((x - offsetX) / displayedWidth) * 100;
  const bgY = ((y - offsetY) / displayedHeight) * 100;
  magnifier.value.style.backgroundPosition = `${bgX}% ${bgY}%`;

  // 设置放大镜的背景图片
  magnifier.value.style.backgroundImage = `url('${imageToShow.value.sourceUrl || fallbackImage}')`;
}
const handleMouseleave = () => {
  magnifier.value.style.display = 'none';
}
</script>

<template>
  <div ref="container_box" @mousemove="handleMousemove" @mouseleave ="handleMouseleave" class="mt-[0.63rem] sm:mt-[0]">
    <!-- <SaleBadge :node="node" class="absolute text-base top-4 right-4" /> -->
    <img
      ref="image"
      class="rounded-xl object-contain w-[100%] h-[100%] sm:w-[600px] sm:h-[600px] min-w-[350px]"
      width="100%"
      height="100%"
      :alt="imageToShow.altText || node.name"
      :title="imageToShow.title || node.name"
      :src="imageToShow.sourceUrl || fallbackImage"
      fetchpriority="high"
      placeholder
      placeholder-class="blur-xl" 
      loading="lazy"
      />
      <div ref="magnifier" class="magnifier"></div>
  </div>
</template>

<style scoped>
.magnifier {
  position: absolute;
  width: 200px; /* 放大镜的宽度 */
  height: 200px; /* 放大镜的高度 */
  border: 2px solid #fff;
  border-radius: 50%;
  background-repeat: no-repeat;
  pointer-events: none;
  display: none;
}
@media (max-width: 640px) {
  .magnifier {
    display: none !important;
  }
}
</style>
