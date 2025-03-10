<script setup>
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { localNum } = useUtils();
const { locale, t } = useI18n();
const route = useRoute();
const slug = route.params.slug;
const description = ref("")
const productCategory = ref(null)
const textContent = ref(null);
const isExpanded = ref(false);
const showReadMore = ref(false);
const toggleReadMore = () => {
  isExpanded.value = !isExpanded.value;
};

const checkTextOverflow = () => {
  if (textContent.value) {
    showReadMore.value = textContent.value.scrollHeight > textContent.value.clientHeight;
  }
};
onMounted(() => {
  checkTextOverflow();
})
const { data: productsData } = await useAsyncGql('getProducts', { slug, language: localNum(locale.value) });
setProducts(productsData.value?.products?.nodes || []);

const { data: categoryData } = await useAsyncGql('productCategory', { slug, language: localNum(locale.value) });
description.value = categoryData.value?.productCategory?.translation.description || "";
productCategory.value = categoryData.value?.productCategory?.translation;
onMounted(async () => {
  if (!isQueryEmpty.value) updateProductList();
});
watch(locale, (to) => {
  if (productCategory.value) {
    const slugLang = productCategory.value.allLanguageSlugs.find(item => item.code === to)?.slug
    if (slugLang) {
      route.params.slug = slugLang
      navigateTo({ path: `/${to}/category/${slugLang}`, replace: true });
    } else {
      alert(t("messages.product.productCategoryNotFound"))
      navigateTo({ path: `/${to}`, replace: true })
    }
  }
})
watch(
  () => route.query,
  () => {
    if (route.name !== 'category-slug') return;
    updateProductList();
  },
);

useHead({
  title:  slug || t('messages.general.allProducts'),
  meta: [{ hid: slug || t('messages.description'), name:slug || t('messages.description'), content: description.value || t('messages.general.allProducts') }],
});
</script>

<template>
  <div class="container max-w-[1200px] px-[0.63rem] sm:px-[0]">
    <Breadcrumb class="mb-4 sm:mb-6" :slug />
    <div class="content_desc text-container">
      <p ref="textContent" :class="['text-content', { expanded: isExpanded }]">
        <button v-if="showReadMore && !isExpanded" @click="toggleReadMore" class="read-more-btn" :class="{
          '!mr-[0px]': isExpanded
        }">
          {{ isExpanded ? 'read less' : 'read more' }}
          <Icon name="ion:chevron-down-outline" class="transform" :class="isExpanded ? 'rotate-180' : ''" />
        </button>
        {{ description }}
        <button v-if="showReadMore && isExpanded" @click="toggleReadMore" class="read-more-btn" style="float: none;" :class="{
          '!mr-[0px]': isExpanded
        }">
          {{ isExpanded ? 'read less' : 'read more' }}
          <Icon name="ion:chevron-down-outline" class="transform" :class="isExpanded ? 'rotate-180' : ''" />
        </button>
      </p>
    </div>
    <div class="flex items-start gap-16">
      <Filters :hide-categories="true" />
  
      <div class="w-full">
        <div class="flex items-center justify-between w-full mt-[0.63rem] mb-[0.63rem] gap-4 sm:mb-[0] sm:mt-8 md:gap-8   sticky z-30 top-[6rem] sm:top-[155px]">
          <OrderByDropdown class="hidden md:inline-flex" />
          <ShowFilterTrigger class="md:hidden" />
        </div>
        <ProductGrid :isCategory="true" />
      </div>
    </div>
    <ScrollTop></ScrollTop>
  </div>
</template>

<style scoped lang="postcss">
.content_desc {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #292929;
}
.text-container {
  display: flex;
}

.text-content {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5; /* 调整行高 */
  &::before{
    content: '';
    float: right;
    width: 0;
    height: calc(100% - 21px);/*先随便设置一个高度*/
    background: red
  }  
}

.text-content.expanded {
  -webkit-line-clamp: 9999; /* 取消行数限制 */
}

.read-more-btn {
  float: right;
  clear: both;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #167EFF;
  @apply mr-[0] sm:mr-[200px];
}

@media (min-width: 640px) {
  .content_desc {
    font-family: HarmonyOS Sans-Regular;
    font-weight: 400;
    font-size: 15px;
    color: #292929;  
  }
  .read-more-btn:hover {
    text-decoration: underline;
  }
  .read-more-btn {
    font-family: HarmonyOS Sans-Regular;
    font-weight: 400;
    font-size: 15px;
    color: #167EFF;
  }
}
</style>
