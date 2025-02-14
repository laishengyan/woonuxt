<script lang="ts" setup>
import { StockStatusEnum } from '~/.nuxt/gql/default';
import type { AddToCartInput } from '#gql';
const { fallbackImage } = useHelpers();
const route = useRoute();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const slug = route.params.slug as string;
const changeSize = ref('1')
const { data } = (await useAsyncGql('getProduct', { slug })) as { data: { value: { product: Product } } };
const product = ref<Product>(data?.value?.product);

const quantity = ref(1);
const activeVariation = ref(null) as Ref<Variation | null>;
const variation = ref([]) as Ref<Variation[]>;
const indexOfTypeAny = [] as number[];
const attrValues = ref();
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
  if (!product.value.image) return []
  return [{
    sourceUrl: product.value.image.sourceUrl || fallbackImage,
    title: product.value.image.title,
    altText: product.value.image.altText,
    databaseId: product.value.image.databaseId,
  }, ...product.value.galleryImages.nodes].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

const imageToShow = ref(product.value.image)
const changeImage = (image: any) => {
  if (image) imageToShow.value = image;
}

onMounted(async () => {
  try {
    const { product } = (await GqlGetStockStatus({ slug })) as { product: Product };
    mergeLiveStockStatus(product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }
  if (product.value.variations) indexOfTypeAny.push(...checkForVariationTypeOfAny(product.value));
});

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
</script>

<template>
  <main class="container relative max-w-[1200px]" v-if="product">
    <SEOHead :info="product" />
    <Breadcrumb :product class="mb-6" />

    <div class="flex flex-col gap-[50px] md:flex-row md:justify-between">
      <ProductImageGallery
        v-if="imageToShow"
        class="relative w-[600px]"
        :main-image="imageToShow"
        :gallery="product.galleryImages!"
        :node="type"
        :activeVariation="activeVariation || {}" />
      <img v-else class="relative w-[600px] skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />

      <div class="flex-1 flex flex-col items-start justify-between">
        <h1 class="detail_title">
          {{ type.name }}
        </h1>
        <div class="detail_title_litter">Multiple sizes</div>
        <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" />
        <div class="form_label"><span>*</span>Size</div>
        <div class="select_box">
          <select v-model="changeSize">
            <option value="1" disabled>Please choose an option to add this product to your cart</option>
          </select>
        </div>
        <ProductPrice class="text_price" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
        <div class="w-full flex">
          <AddToCartButton class="flex-1 w-full" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
        </div>
        <div class="special_features">Special Features：</div>
        <div class="special_features_list">
          <div class="special_features_item">
            <div class="h-[80px] w-full">
              <img class="w-full h-full" src="/images/detail/1.png" />
            </div>
            <span>Manual guarantee</span>
          </div>
          <div class="special_features_item">
            <div class="h-[80px] w-full">
              <img class="w-full h-full" src="/images/detail/2.png" />
            </div>
            <span>Money back guarantee</span>
          </div>
          <div class="special_features_item">
            <div class="h-[80px] w-full">
              <img class="w-full h-full" src="/images/detail/3.png" />
            </div>
            <span>Why choose us? Ten reasons!</span>
          </div>
          <div class="special_features_item">
            <div class="h-[80px] w-full">
              <img class="w-full h-full" src="/images/detail/4.png" />
            </div>
            <span>PayPal Verified</span>
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
        <div class="flex flex-wrap justify-between w-full">
          <WishlistButton :product />
          <ShareButton :product />
        </div>
      </div>
    </div>
    <div v-if="product.galleryImages.nodes.length" class="mt-[20px] gallery-images">
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
    <div class="description mt-[10px]">Description</div>
    <div v-if="product.description" class="description_detail  mt-[15px]" v-html="product.description" />
    <div v-else class="description_detail">no Description</div>
    <!-- <div v-if="product.description || product.reviews" class="my-32">
      <ProductTabs :product />
    </div> -->
    <div class="little_title relative min-h-[44px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png" alt="">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">Pruduct Reviews</span>
    </div>
    <ProductReviews :product="product" />
    <div class="little_title relative min-h-[44px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" src="/icons/title_bg.png" alt="">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">Related Products</span>
    </div>
    <div v-if="product.related">
      <ProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
    </div>
  </main>
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
  font-size: 28px;
  color: #292929;
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
  font-size: 42px;
  align-items: flex-end;
  @apply mt-[20px];
  line-height: initial;
  ::v-deep span:not(:first-child) {
    font-size: 28px;
  }
}
.special_features {
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 15px;
  color: #292929;
  @apply mt-[20px];
}
.special_features_list {
  @apply mt-[10px] w-full flex justify-between;
  .special_features_item {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 13px;
    color: #292929;
    @apply w-[80px] text-center cursor-pointer;
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
  margin: 20px 0;
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 16px;
  color: #7F1C1B;
}
</style>
