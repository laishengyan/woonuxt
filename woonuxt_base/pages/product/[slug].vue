<script lang="ts" setup>
import { StockStatusEnum } from '~/.nuxt/gql/default';
import type { AddToCartInput } from '#gql';
const { fallbackImage, arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { localNum } = useUtils();
const route = useRoute();
const { locale, t } = useI18n();
const { addToCart, isUpdatingCart } = useCart();
const slug = route.params.slug as string;
const changeSize = ref('121ed121')
const product = ref<Product>(null);
const quantity = ref(1);
const activeVariation = ref(null) as Ref<Variation | null>;
const variation = ref([]) as Ref<Variation[]>;
const indexOfTypeAny = [] as number[];
const attrValues = ref();
const sizeList = ref([])
const isLoading = ref(false)
const isSimpleProduct = computed(() => product.value.type === 'SIMPLE');
const isVariableProduct = computed(() => product.value.type === 'VARIABLE');

const type = computed(() => (activeVariation.value ? activeVariation.value : product.value));
const selectProductInput = computed(() => ({ productId: type.value.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;
const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value.stockStatus;

  payload.variations?.nodes.forEach((variation: Variation, index: number) => {
    if (product.value.variations?.nodes[index]) {
      // @ts-ignore
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};


const galleryImages = computed(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  if (!product.value?.image) return []
  return [{
    sourceUrl: product.value?.image.sourceUrl || fallbackImage,
    title: product.value?.image.title,
    altText: product.value?.image.altText,
    databaseId: product.value?.image.databaseId,
  }, ...product.value.galleryImages.nodes].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

const imageToShow = ref("")
const changeImage = (image: any) => {
  if (image) imageToShow.value = image;
}


const updateSelectedVariations = (variations: Attribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const cloneArray = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      indexOfTypeAny.forEach((index) => (cloneArray[index].value = ''));
      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray));
    }
  });

  activeVariation.value = getActiveVariation[0];
  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});
const disabledAddToCart = computed(() => {
  if (isSimpleProduct.value) return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || isUpdatingCart.value;
  return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || !activeVariation.value || isUpdatingCart.value;
});
watch(locale, (to: any) => {
  if (product.value) {
    const slugLang = product.value.allLanguageSlugs.find((item: any) => item.code === to)?.slug
    if (slugLang) {
      route.params.slug = slugLang
      navigateTo({ path: `/${to}/product/${slugLang}`, replace: true })
    } else {
      alert(t("messages.product.productNotFound"))
      navigateTo({ path: `/${to}`, replace: true })
    }
  }
})
const { data } = (await useAsyncGql('getProduct', { slug, language: localNum(locale.value) })) as { data: { value: { product: Product } } };

product.value = data?.value?.product
sizeList.value = product.value?.attributes?.nodes[0]?.terms?.nodes || []
imageToShow.value = product.value?.image
try {
  mergeLiveStockStatus(product.value.stockStatus);
} catch (error: any) {
  const errorMessage = error?.gqlErrors?.[0].message;
  if (errorMessage) console.error(errorMessage);
}
if (product.value?.variations) indexOfTypeAny.push(...checkForVariationTypeOfAny(product.value));
const handleCheck = () => {
  isLoading.value = true
  if (sizeList.value.length > 1 && changeSize.value == "121ed121") {
    isLoading.value = false
    return alert("Please select a size")
  }
  if (sizeList.value.length == 0) {
    isLoading.value = false
    return alert("This product doesn't have any size")
  }
  let object = null
  if (sizeList.value.length == 1) {
    object = sizeList.value[0]
  }else {
    object = sizeList.value.find((variation: any) => variation.slug === changeSize.value)
  }
  addToCart({
    ...selectProductInput.value,
    variation: [
      {
        attributeName: object.taxonomyName,
        attributeValue: object.slug
      }
    ]
    // variationId: activeVariation.value?.databaseId ?? null
  })
  isLoading.value = false
}
useHead({
  title: product.value.name || 'Product',
  meta: [{ hid: product.value.shortDescription || 'description', name: product.value.name || 'Product', content: product.value.shortDescription || 'description' }, { name: 'keywords', content: slug || 'description' }]
});
</script>

<template>
  <div>
    <main class="container relative max-w-[1200px] min-h-[500px] px-[0.63rem] sm:px-[0]" v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb :product class="mb-[4] sm:mb-6" />
  
      <div class="flex flex-col sm:gap-[50px] md:flex-row md:justify-between">
        <ProductImageGallery
          v-if="imageToShow"
          class="relative bg-[#f8f8f8] w-full h-[22.19rem] sm:h-[600px] sm:w-[600px]"
          :main-image="imageToShow"
          :gallery="product.galleryImages!"
          :node="type"
          :activeVariation="activeVariation || {}" />
        <img v-else class="relative w-full h-[22.19rem] sm:h-[600px] sm:w-[600px] skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" loading="lazy" />
  
        <div class="flex-1 flex flex-col items-start justify-between mt-[0.63rem]">
          <h1 class="detail_title">
            {{ type.name }}
          </h1>
          <div class="detail_title_litter">{{ sizeList.length > 1 ? $t("messages.general.multipleSizes") : $t("messages.general.singleSize") }}</div>
          <div class="flex items-center justify-between w-full mt-[0.63rem] sm:mt-[0]">
            <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" />
            <ShareButton :product class="sm:hidden mt-[0]" />
          </div>
          <div class="form_label"><span>*</span>{{ $t("messages.product.size") }}</div>
          <div class="select_box" v-if="sizeList.length > 1">
            <select v-model="changeSize">
              <option value="121ed121" disabled>{{ $t("messages.product.1") }}</option>
              <option :value="item.slug" v-for="item in sizeList" :key="item.slug">{{ item.name }}</option>
            </select>
          </div>
          <div class="select_box" v-else>
            <span>{{ sizeList[0]?.name || $t("messages.general.noSizeTip") }}</span>
          </div>
          <ProductPrice class="text_price" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
          <div class="w-full flex items-center mt-[0.63rem] gap-[0.63rem] sm:mt-[0]">
            <WishlistButton :product class="sm:hidden" />
            <AddToCartButton class="flex-1" :disabled="disabledAddToCart" isProduct @click="handleCheck" :loading="isLoading" />
          </div>
          <div class="special_features mt-[1.25rem] sm:mt-[20px]">{{ $t("messages.product.2") }}</div>
          <div class="special_features_list">
            <div class="special_features_item">
              <div class="h-[80px] w-full">
                <img class="w-full h-full" src="/images/detail/1.png" loading="lazy" :alt="$t('messages.product.3')" />
              </div>
              <span>{{ $t("messages.product.3") }}</span>
            </div>
            <div class="special_features_item">
              <div class="h-[80px] w-full">
                <img class="w-full h-full" src="/images/detail/2.png" loading="lazy" :alt="$t('messages.product.4')"/>
              </div>
              <span>{{ $t("messages.product.4") }}</span>
            </div>
            <div class="special_features_item">
              <div class="h-[80px] w-full">
                <img class="w-full h-full" src="/images/detail/3.png" loading="lazy" :alt="$t('messages.product.5')" />
              </div>
              <span>{{ $t("messages.product.5") }}</span>
            </div>
            <div class="special_features_item">
              <div class="h-[80px] w-full">
                <img class="w-full h-full" src="/images/detail/4.png" loading="lazy" :alt="$t('messages.product.6')" />
              </div>
              <span>{{ $t("messages.product.6") }}</span>
            </div>
          </div>
          <!-- <form @submit.prevent="addToCart(selectProductInput)">
            <AttributeSelections
              v-if="product.type == 'VARIABLE' && product.attributes && product.variations"
              class="mt-4 mb-8"
              :attributes="product.attributes.nodes"
              :defaultAttributes="product.defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations" />
            <div class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 bg-white md:static md:bg-transparent bg-opacity-90 md:p-0">
              <input
                v-model="quantity"
                type="number"
                min="1"
                aria-label="Quantity"
                class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
            </div>
          </form> -->
          <div class="flex-wrap justify-between w-full hidden sm:flex">
            <WishlistButton :product />
            <ShareButton :product />
          </div>
        </div>
      </div>
      <div v-if="product.galleryImages?.nodes?.length" class="mt-[20px] gallery-images">
        <img
          v-for="galleryImg in galleryImages"
          :key="galleryImg.databaseId"
          class="cursor-pointer w-[150px] h-[150px]"
          :class="{
            'active': galleryImg.databaseId === imageToShow.databaseId
          }"
          width="600"
          height="600"
          :src="galleryImg.sourceUrl"
          :alt="galleryImg.altText || product.name"
          :title="galleryImg.title || product.name"
          @click.native="changeImage(galleryImg)"
          placeholder
          placeholder-class="blur-xl"
          loading="lazy" />
      </div>
      <div class="description mt-[10px]">{{ $t("messages.product.7") }}</div>
      <div v-if="product.description" class="description_detail mt-[15px]" v-html="product.description" />
      <div v-else class="description_detail">{{ $t("messages.product.8") }}</div>
      <!-- <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product />
      </div> -->
      <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
        <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
        <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
        <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.product.9") }}</span>
      </div>
      <ProductReviews :product="product" class="px-0" v-if="product"/>
      <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
        <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
        <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
        <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.product.10") }}</span>
      </div>
      <div v-if="product.related">
        <ProductRow :products="product.related.nodes" class="mb-[2.5rem] grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:mb-[0]" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss">
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
.detail_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1.19rem;
  color: #1A1A1A;
  @apply line-clamp-3 overflow-hidden whitespace-normal
}
.detail_title_litter {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: #8B8B8B;
  @apply pt-[4px]
}
.form_label {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #292929;
  @apply mt-[10px];
  span {
    color: #7F1C1B;
  }
}
.select_box {
  @apply mt-[5px] w-full;
  select {
    border: 1px solid #CBCBCB;
    border-radius: 0;
    width: 100%;
  }
}
.text_price {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1.69rem;
  align-items: flex-end;
  @apply mt-[0.63rem] sm:mt-[20px];
  line-height: initial;
  :deep(span):not(:first-child) {
    font-family: HarmonyOS Sans-Regular;
    font-weight: 400;
    font-size: 0.94rem;
  }
}
.special_features {
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 15px;
  color: #292929;
}
.special_features_list {
  @apply mt-[10px] w-full flex justify-between;
  .special_features_item {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 13px;
    color: #292929;
    @apply w-[80px] text-center;
  }
}
.gallery-images {
  display: flex;
  overflow: auto;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
  .active {
    border: 1px solid #7F1C1B;
  }
  img {
    border: 1px solid transparent;
  }
}

@media (min-width: 768px) {
  .gallery-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

    img {
      width: 100%;
    }
  }
}
.description {
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 20px;
  color: #292929;
}
.description_detail {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #292929;
  padding-bottom: 20px;
  overflow: hidden;
  word-break: break-all;
}
.little_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.94rem;
  color: #7F1C1B;
}
.loading {
  width: 30px;
  height: 30px;
  border: 2px solid #000;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}
.description_detail > :deep(p) {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
}
.description_detail > :deep(h3) {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  unicode-bidi: isolate;
}
.description_detail > :deep(ul) {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
  unicode-bidi: isolate;
}
.description_detail > :deep(ol) {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
  unicode-bidi: isolate;
}
@media (min-width: 640px) {
  little_title {
    font-family: HarmonyOS Sans-Bold;
    font-weight: bold;
    font-size: 16px;
    color: #7F1C1B;
  }
  .detail_title {
    font-size: 28px;
    color: #292929;
  }
  .text_price {
    font-size: 42px;
    :deep(span):not(:first-child) {
      font-size: 28px;
    }
  }
}
</style>
