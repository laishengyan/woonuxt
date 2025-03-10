<script setup lang="ts">
const { isShowingSearch } = useSearching();
const { cart } = useCart();
const { viewer } = useAuth();
const { locale, locales, setLocaleCookie, setLocale } = useI18n();
const isShowLanguage = ref(false)
const { isShowTopOrFooter } = defineProps({
  isShowTopOrFooter: {
    type: Boolean,
    default: true
  }
})
const isShowMenu = ref(false)
const generalSettings = inject('generalSettings');
const logoTitle = computed(() => {
  return generalSettings?.value?.generalSettings?.title || "oriental-art.net"
})

const categories = inject('globalCategories');
const categoriesList = computed(() => {
  return categories.value?.productCategories?.nodes || []
})
const localName = computed(() => {
  return locales.value.find((item: any) => item.code === locale.value)?.name || "English"
})
const handleClickMenu = (flag: any) => {
  isShowMenu.value = flag
}
const handleOpenChangeLanguage = (flag: boolean) => {
  isShowLanguage.value = flag
}
const handleLocalChange = (code: string) => {
  setLocaleCookie(code)
  setLocale(code)
  handleOpenChangeLanguage(false)
  handleClickMenu(false)
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm shadow-light-500" style="background: #650708;">
    <NuxtImg  class="w-[340px] h-[240px] absolute top-0 left-0 hidden xl:block" src="/icons/top_icon.webp" alt="" v-if="isShowTopOrFooter" loading="lazy" preload width="340" height="240" placeholder placeholder-class="blur-xl" :modifiers="{ f: 'webp', q: '75' }" sizes="100vw sm:50vw md:340px">
    </NuxtImg>
    <div class="container items-center justify-between max-w-[1200px] hidden lg:flex">
      <div class="flex items-center" v-if="isShowTopOrFooter">
        <LangSwitcher />
        <!-- <MenuTrigger class="lg:hidden" />
        <Logo class="md:w-[160px]" /> -->
      </div>
      <div class="flex items-center back_btn" v-if="!isShowTopOrFooter">
        <NuxtLink :to="`/${locale}`">{{ $t("messages.cart.6") }}</NuxtLink>
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
          <img src="/icons/phone.png" alt="" class="w-4 h-4 mr-2" loading="lazy">
          <span>+86 189 7088 8044</span>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/user.png" alt="" class="w-4 h-4 mr-2" loading="lazy">
          <NuxtLink :to="`/${locale}/my-account`"><span>{{viewer ? viewer.email : $t("messages.general.loginAndRegister")}}</span></NuxtLink>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/blog.png" alt="" class="w-4 h-4 mr-2" loading="lazy">
          <NuxtLink :to="`/${locale}/blog`"><span>{{ $t("messages.general.ourBlog") }}</span></NuxtLink>
        </div>
        <div class="header_item flex items-center">
          <img src="/icons/wolist.png" alt="" class="w-4 h-4 mr-2" loading="lazy">
          <NuxtLink :to="`/${locale}/wishlist`"><span>{{ $t("messages.shop.wishlist") }}</span></NuxtLink>
        </div>
        <!-- <SearchTrigger /> -->
        <CartTrigger />
      </div>
    </div>
    <div class="con_bottom hidden lg:block" v-show="isShowTopOrFooter">
      <div class="container max-w-[1200px]">
        <div class="flex items-center justify-between w-full pt-4">
          <span class="logo">
            <NuxtLink :to="`/${locale}`">{{ logoTitle || "Oriental Art" }}</NuxtLink>
          </span>
          <ProductSearch class="hidden sm:inline-flex max-w-[240px] w-[60%]" />
        </div>
        <div class="flex items-center justify-end w-full mt-3" v-memo="[locale, categoriesList]">
          <div class="main_item pl-5 pr-5 pt-3 pb-3">
            <NuxtLink :to="`/${locale}`">{{ $t("messages.general.home") }}</NuxtLink>
          </div>
          <section v-if="categoriesList && categoriesList.length" class="flex items-center">
            <div class="main_item pl-5 pr-5 pt-3 pb-3" v-for="(category, i) in categoriesList" :key="i">
              <NuxtLink :to="`/${locale}/category/${decodeURIComponent(category.slug)}`">
                <span v-html="category.name"></span>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div class="model_main block lg:hidden">
      <div class="menu_or_title flex justify-between items-center">
        <div class="flex items-center">
          <div class="menu_item w-[2.75rem] h-[2.75rem] flex justify-center items-center" @click="handleClickMenu(true)">
            <img src="/modile/menu.png" alt="" class="w-[1.5rem] h-[1.5rem]">
          </div>
          <div class="menu_item w-[2.75rem] h-[2.75rem] flex justify-center items-center">
            <NuxtLink :to="`/${locale}/my-account`" class="flex items-center">
              <img src="/modile/user.png" :alt="viewer ? viewer.email : $t('messages.general.loginAndRegister')" class="w-[1.5rem] h-[1.5rem]">
            </NuxtLink>
          </div>
          <div class="menu_item w-[2.75rem] h-[2.75rem] flex justify-center items-center">
            <NuxtLink :to="`/${locale}/wishlist`" class="flex items-center">  
            <img src="/modile/wishlist.png" :alt="$t('messages.shop.wishlist')" class="w-[1.5rem] h-[1.5rem]">
            </NuxtLink>
          </div>
          <div class="menu_item w-[2.75rem] h-[2.75rem] flex justify-center items-center relative">
            <NuxtLink :to="`/${locale}/addCart`" class="flex items-center">  
              <img src="/modile/cat.png" :alt="$t('messages.myCart')" class="w-[1.5rem] h-[1.5rem]">
            </NuxtLink>
            <ClientOnly>
              <Transition name="popIn" mode="out-in">
                <span
                  v-if="cart?.contents?.itemCount > 0"
                  class="bg-primary rounded-full text-white leading-none min-w-[16px] p-[3px] top-0 right-0 text-[10px] absolute inline-flex justify-center items-center"
                  >{{ cart?.contents?.itemCount }}</span
                >
              </Transition>
            </ClientOnly>
          </div>
        </div>
        <div class="menu_title mr-[0.63rem]">
          <NuxtLink :to="`/${locale}`">{{ logoTitle }}</NuxtLink>
        </div>
      </div>
      <ProductSearch class="m-[0.63rem] mt-[0.31rem] flex" />
    </div>
    <div class="model_menu fixed top-0 left-0 w-full h-full bg-white flex flex-col justify-between pb-[2.5rem] overflow-hidden lg:hidden" v-if="isShowMenu">
      <div class="w-[2.75rem] h-[2.75rem]" @click="handleClickMenu(false)">
        <img src="/modile/close.webp" alt="close" width="100%" height="100%">
      </div>
      <div class="flex-1">
        <div class="mx-[0.63rem] model_menu_item">
          <NuxtLink :to="`/${locale}`" @click="handleClickMenu(false)">{{ $t("messages.general.home") }}</NuxtLink>
        </div>
        <section v-if="categoriesList && categoriesList.length" class="mx-[0.63rem]">
          <div class="model_menu_item" v-for="(category, i) in categoriesList" :key="i">
            <NuxtLink :to="`/${locale}/category/${decodeURIComponent(category.slug)}`" @click="handleClickMenu(false)">
              <span v-html="category.name"></span>
            </NuxtLink>
          </div>
        </section>
      </div>
      <div class="mt-[2.5rem] w-full h-[3.13rem] flex justify-center items-center bg-white">
        <img src="/modile/whats_app.webp" alt="whats_app" class="w-[1.25rem] h-[1.25rem] mr-[0.31rem]">
        <span class="header_item_mobile">+86 189 7088 8044</span>
      </div>
      <div class="w-full h-[3.13rem] flex justify-center items-center bg-white" @click="handleOpenChangeLanguage(true)">
        <img src="/modile/lang.webp" alt="lang" class="w-[1.25rem] h-[1.25rem] mr-[0.31rem]">
        <span class="header_item_mobile">{{ localName }}</span>
      </div>
    </div>
    <div class="lang_model fixed top-0 left-0 w-full h-full flex flex-col justify-end sm:hidden" v-if="isShowLanguage">
      <div class="main_box pb-[2.5rem] bg-white max-h-[100%] flex flex-col">
        <div class="main_box_title flex justify-between items-center pl-[0.63rem]">
          <span>language</span>
            <div class="w-[3.13rem] h-[3.13rem]"  @click="handleOpenChangeLanguage(false)">
              <img src="/modile/close.webp" alt="close" width="100%" height="100%">
            </div>
        </div>
        <div class="flex-1 overflow-auto px-[0.63rem]">
          <div class="select_item h-[3.13rem] flex items-center" v-for="item in locales" :key="item" v-html="item.name" @click="handleLocalChange(item.code)"></div>
        </div>
        <div class="cancel_btn mt-[0.63rem] h-[3.13rem] mx-[0.63rem] flex justify-center items-center"  @click="handleOpenChangeLanguage(false)">
          Cancel
        </div>
      </div>
    </div>
  </header>
</template>
<style scoped lang="postcss">
.header_item {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  color: rgba(255,255,255,0.95);
  font-size: 13px;
}
header_item_mobile {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1rem;
  color: #292929;
}
.model_main {
  background-image: url("/modile/header_bg.webp");
  background-size: cover;
  background-repeat: no-repeat;
}
.con_bottom {
  background-image: url('/images/top_bg.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
.menu_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1.41rem;
  color: rgba(255,255,255,0.95);
}
.model_menu {
  z-index: 999;
}
.lang_model {
  z-index: 1000;
  background-color: rgba(0,0,0,0.5);
}
.model_menu_item {
  font-family: HHarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 1rem;
  color: #292929;
  border-bottom: 0.03rem solid rgba(0,0,0,0.1);
  @apply pl-[0.31rem] pt-[0.87rem] pb-[0.91rem];
}
.main_box {
  border-radius: 0.5rem 0.5rem 0 0;
  .main_box_title {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 1.19rem;
    color: #1A1A1A;
  }
  .select_item {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 1rem;
    color: #292929;
    border-bottom: 0.03rem solid rgba(0,0,0,0.1);
  }
  .cancel_btn {
    background-image: url("/modile/wishlist_btn.webp");
    background-size: 100% 100%;
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 0.88rem;
    color: #292929;
  }
}
</style>
