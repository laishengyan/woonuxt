<script setup lang="ts">
const { locale, t } = useI18n();
const isPending = ref<Boolean>(false);
const form = reactive({
  email: '',
  firstName: ''
});
const successMessage = ref<string>('');
const errorMessage = ref<string>('');
const categories = inject('globalCategories');
const categoriesList = computed(() => {
  return categories.value?.productCategories?.nodes || []
})
const imageList = [
  { id: 1, name: '/images/detail/10001@2x.webp', alt: 'Image 1' },
  { id: 2, name: '/images/detail/10002@2x.webp', alt: 'Image 2' },
  { id: 3, name: '/images/detail/10003@2x.webp', alt: 'Image 3' },
  { id: 4, name: '/images/detail/10004@2x.webp', alt: 'Image 4' },
  { id: 5, name: '/images/detail/10005@2x.webp', alt: 'Image 5' },
  { id: 6, name: '/images/detail/10006@2x.webp', alt: 'Image 6' },
  { id: 7, name: '/images/detail/10007@2x.webp', alt: 'Image 7' },
  { id: 9, name: '/images/detail/10009@2x.webp', alt: 'Image 9' },
]
async function addSubscriber() {
   try {
      isPending.value = true;
      const { data } = await useAsyncGql('addsubri', {
        email: form.email,
        firstName: form.firstName
      })
      if (data?.value?.mailpoetSubscribe?.message?.includes('Subscriber added to lists')) {
        successMessage.value = t("messages.general.subscribing");
        setTimeout(() => {
          successMessage.value = '';
        }, 4000);
      } else {
        errorMessage.value = data?.value?.mailpoetSubscribe?.message;
        setTimeout(() => {
          errorMessage.value = '';
        }, 5000);
      }
   } catch (error) {
      errorMessage.value = error?.gqlErrors?.[0].message;
      setTimeout(() => {
        errorMessage.value = '';
      }, 5000);
   } finally {
      isPending.value = false;
   }
}
</script>

<template>
  <footer class="bg-white order-last footer px-[0.63rem] sm:px-0">
    <div class="container flex flex-wrap justify-between max-w-[1200px]">
      <form class="mt-[2.19rem] footer-top text-center sm:flex align-center w-full sm:mt-[170px] justify-between" @submit.prevent="addSubscriber" method="POST">
        <span>{{ $t("messages.general.subscribingToNewsletter") }}</span>
        <div class="sm:flex items-center justify-center f-1">
          <div class="relative">
            <input type="text" :placeholder="$t('messages.billing.firstName')" class="w-full h-[2.5rem] sm:w-[289px] sm:h-[36px] border sm:mr-2 focus:outline-none" v-model="form.firstName" required>
            <img class="w-[1rem] h-[1rem] absolute top-[50%] left-[10px] -translate-y-1/2" src="/images/user.png" alt="" loading="lazy">
          </div>
          <div class="relative mt-[0.63rem] sm:mt-[0] flex items-center justify-between">
            <input type="email" :placeholder="$t('messages.billing.emailAddress')" class="flex-1 w-full h-[2.5rem] sm:w-[289px] sm:h-[36px] sm:mr-2 border focus:outline-none" v-model="form.email" required>
            <img class="w-[1rem] h-[1rem] absolute top-[50%] left-[10px] -translate-y-1/2" src="/images/email.png" alt="" loading="lazy">
            <button class="block sm:hidden w-[2.5rem] h-[2.5rem] flex items-center justify-center ml-[0.63rem]" style="background: rgba(255,255,255,0.95);" type="submit" :aria-labelledby="$t('messages.general.submitSubscription')" :title="$t('messages.general.submitSubscription')">
            <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
            <img v-else class="w-[1rem] h-[1rem]" src="/images/submit_btn.png" alt="" loading="lazy">
          </button>
          </div>
          <button class="hidden sm:flex w-[36px] h-[36px] items-center justify-center" style="background: rgba(255,255,255,0.95);" type="submit" :aria-labelledby="$t('messages.general.submitSubscription')" :title="$t('messages.general.submitSubscription')">
            <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
            <img v-else class="w-[20px] h-[20px]" src="/images/submit_btn.png" alt="" loading="lazy">
          </button>
        </div>
      </form>
      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="my-4 text-sm text-yellow-500 text-left sm:text-right w-full" v-html="errorMessage"></div>
      </Transition>
      <Transition name="scale-y" mode="out-in">
        <div v-if="successMessage" class="my-4 text-sm text-green-500 text-left sm:text-right w-full" v-html="successMessage"></div>
      </Transition>
      <div class="mt-[1rem] sm:mt-[50px] container sm:flex flex-wrap justify-between max-w-[1200px]">
        <div class="w-3/7 lg:w-auto">
          <div class="sm:mb-1 footer-title">
            {{ $t("messages.general.corpInfo") }}
          </div>
          <div class="text-sm footer-text-main sm:gap-[5px] flex sm:flex-col gap-[1.25rem]">
            <div>
              <NuxtLink :to="`/${locale}/corp-info`">{{ $t("messages.general.aboutUs") }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/${locale}/corp-info`">{{ $t("messages.general.contactUs") }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/${locale}/blog`">{{ $t("messages.general.ourBlog") }}</NuxtLink>
            </div>
          </div>
        </div>
        <div class="w-3/7 lg:w-auto mt-[1.25rem] sm:mt-[0]">
          <div class="sm:mb-1 footer-title">{{ $t("messages.general.proAndServices") }}</div>
          <client-only>
            <div class="text-sm footer-text-main sm:gap-[5px] sm:grid-cols-2 sm:grid transition-all flex gap-[1rem] flex-wrap" v-if="categoriesList && categoriesList.length">
              <div v-for="category in categoriesList" :key="category.id">
                <NuxtLink :to="`/${locale}/category/${decodeURIComponent(category.slug)}`">
                  <span v-html="category.name"></span>
                </NuxtLink>
              </div>
            </div>
          </client-only>
        </div>
        <div class="w-3/7 lg:w-auto mt-[1.25rem] sm:mt-[0]">
          <div class="sm:mb-1 footer-title">{{ $t("messages.general.ourGuarantee") }}</div>
          <div class="text-sm footer-text-main sm:gap-[5px] flex sm:flex-col gap-[1.25rem]">
            <div>
              <NuxtLink :to="`/${locale}/return_policy`">{{ $t("messages.general.returnPolicy") }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/${locale}/save_blog`">{{ $t("messages.general.saveUp") }}</NuxtLink>
            </div>
          </div>
        </div>
        <div class="w-3/7 lg:w-auto mt-[1.25rem] sm:mt-[0]">
          <div class="sm:mb-1 footer-title">{{ $t("messages.general.further_info") }}</div>
          <div class="text-sm footer-text-main sm:gap-[5px] flex sm:flex-col gap-[1.25rem]">
            <div>
              <NuxtLink :to="`/${locale}/further-info? slug=shipping-guide`">{{ $t("messages.further_info.js.1") }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/${locale}/further-info?slug=how-to-pay`">{{ $t("messages.general.howToPay") }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/${locale}/further-info?slug=faq`">{{ $t("messages.further_info.js.3") }}</NuxtLink>
            </div>
          </div>
        </div>
        <div class="sm:w-[180px] mt-[1.25rem] sm:mt-[0]">
          <div class="flex flex-wrap sm:justify-end gap-[0.63rem] sm:gap-[5px]">
            <div class="image-item hidden sm:block">
            </div>
            <div class="image-item" v-for="item in imageList" :key="item.id">
              <img :src="item.name" :alt="item.alt" width="100%" height="100%">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom flex items-center justify-center mb-[20px] mt-[1.03rem] pt-[0.75rem] sm:mt-[50px] sm:pt-[20px]">
      <div class="copywrite">
        <p class="text-xs text-center">
          {{ $t("messages.general.footerMain") }}, © 2024 oriental-art corp
        </p>
      </div>
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
.footer {
  background: url(/icons/footer.webp) no-repeat;
  background-size: contain;
  background-color: #7f1c1b;
}
.footer-top span{
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 0.84rem;
  color: rgba(255,255,255,0.95);
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 36px;
}
.footer-top input {
  padding-left: 36px;
}
.footer-top input::placeholder {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: #686868;
}
.footer-title {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 18px;
  color: rgba(255,255,255,0.95);
}
.footer-text-main {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  @apply mt-[0.94rem] sm:mt-[15px]
}
.image-item {
  @apply w-[3.75rem] h-[2.66rem] sm:w-[48px] sm:h-[34px]
}
.image-item:first-child {
  background: transparent;
}
.footer-bottom {
  border-top: 1px solid rgba(232, 232, 232, .2);
}
.copywrite {
  font-family: HarmonyOS Sans-Light;
  font-weight: 300;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}
@media (min-width: 640px) {
  .footer {
    background-size: 100% 100%;
  }
  .footer-top span{
    font-size: 18px;
    color: rgba(255,255,255,0.95);
  }
}
</style>
