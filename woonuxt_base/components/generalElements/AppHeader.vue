<script setup lang="ts">
const { isShowingSearch } = useSearching();
const { locale } = useI18n();
const { isShowTopOrFooter } = defineProps({
  isShowTopOrFooter: {
    type: Boolean,
    default: true
  }
})
const ProductCategoriesData = await useAsyncGql('getProductCategories', { first: 8 });
const productCategories = ProductCategoriesData?.data.value?.productCategories?.nodes || [];
const logoTitle = ref<String>('woonuxt')
onMounted(() => {
  logoTitle.value = window?.location?.host;
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm shadow-light-500" style="background: #650708;">
    <img class="w-[340px] h-[240px] absolute top-0 left-0" src="/icons/top_icon.png" alt="" v-if="isShowTopOrFooter">
    <div class="container flex items-center justify-between max-w-[1200px]">
      <div class="flex items-center" v-if="isShowTopOrFooter">
        <LangSwitcher />
        <!-- <MenuTrigger class="lg:hidden" />
        <Logo class="md:w-[160px]" /> -->
      </div>
      <div class="flex items-center back_btn" v-if="!isShowTopOrFooter">
        Continue Browsing
      </div>
      <!-- <MainMenu class="items-center hidden gap-6 text-sm text-gray-500 lg:flex lg:px-4" /> -->
      <div class="flex justify-end items-center md:w-[160px] flex-1 ml-auto gap-4 md:gap-6">
        <div class="flex items-center" v-if="!isShowTopOrFooter">
          <LangSwitcher />
          <!-- <MenuTrigger class="lg:hidden" />
          <Logo class="md:w-[160px]" /> -->
        </div>
        <!-- <ProductSearch class="hidden sm:inline-flex max-w-[320px] w-[60%]" /> -->
        <div class="header_item flex items-center">
          <img src="/icons/phone.png" alt="" class="w-4 h-4 mr-2">
          <span>+86 189 7088 8044</span>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/user.png" alt="" class="w-4 h-4 mr-2">
          <span><a href="/my-account">Log In / Register</a></span>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/blog.png" alt="" class="w-4 h-4 mr-2">
          <span>Our Blog</span>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/wolist.png" alt="" class="w-4 h-4 mr-2">
          <span>Wishlist</span>
        </div>
        <!-- <SearchTrigger /> -->
        <CartTrigger />
      </div>
    </div>
    <div class="con_bottom" v-if="isShowTopOrFooter">
      <div class="container max-w-[1200px]">
        <div class="flex items-center justify-between w-full pt-4">
          <span class="logo">
            {{ logoTitle }}
          </span>
           <ProductSearch class="hidden sm:inline-flex max-w-[240px] w-[60%]" />
        </div>
        <div class="flex items-center justify-end w-full mt-3">
          <div class="main_item pl-5 pr-5 pt-3 pb-3">
            <a href="/">Home</a>
          </div>
          <div class="main_item pl-5 pr-5 pt-3 pb-3" v-for="(category, i) in productCategories" :key="i">
            <NuxtLink :to="`/${locale}/product-category/${decodeURIComponent(category.slug)}`">
              <span v-html="category.name"></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!-- <Transition name="scale-y" mode="out-in">
      <div class="container mb-3 -mt-1 sm:hidden" v-if="isShowingSearch">
        <ProductSearch class="flex w-full" />
      </div>
    </Transition> -->
  </header>
</template>
<style scoped>
.header_item {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  color: rgba(255,255,255,0.95);
  font-size: 13px;
}
.con_bottom {
  background: #53080b;
}
.con_bottom .logo {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 35px;
  color: rgba(255,255,255,0.95);
}
.con_bottom .main_item {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 15px;
  color: rgba(255,255,255,0.95);
  cursor: pointer;
}
.back_btn {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
  cursor: pointer;
}
</style>
