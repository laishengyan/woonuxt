<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const isPending = ref<Boolean>(false);
const form = reactive({
  email: '',
  firstName: ''
});
const successMessage = ref<string>('');
const errorMessage = ref<string>('');

async function addSubscriber() {
   try {
      isPending.value = true;
      const { data } = await useAsyncGql('addsubri', {
        email: form.email,
        firstName: form.firstName
      })
      if (data?.value?.mailpoetSubscribe?.message?.includes('Subscriber added to lists')) {
        successMessage.value = 'Thank you for subscribing to our newsletter!';
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
  <footer class="bg-white order-last footer">
    <div class="container flex flex-wrap justify-between max-w-[1200px]">
      <!-- <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div> -->
      <form class="footer-top flex align-center w-full mt-[170px] justify-between" @submit.prevent="addSubscriber" method="POST">
        <span style="line-height: 36px;">{{ 'Sign  up  for  our  newsletter  and  promotions ' }}</span>
        <div class="flex items-center justify-center f-1">
          <div class="relative">
            <input type="text" placeholder="First Name" class="w-[289px] h-[36px] border mr-2 focus:outline-none" v-model="form.firstName" required>
            <img class="w-[16px] h-[16px] absolute top-[10px] left-[10px]" src="/images/user.png" alt="">
          </div>
          <div class="relative">
            <input type="email" placeholder="Email Address" class="w-[289px] h-[36px] mr-2 border focus:outline-none" v-model="form.email" required>
            <img class="w-[16px] h-[16px] absolute top-[10px] left-[10px]" src="/images/email.png" alt="">
          </div>
          <button class="w-[36px] h-[36px] flex items-center justify-center" style="background: rgba(255,255,255,0.95);" type="submit">
            <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
            <img v-else class="w-[20px] h-[20px]" src="/images/submit_btn.png" alt="">
          </button>
        </div>
      </form>
      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="my-4 text-sm text-white-500" v-html="errorMessage"></div>
      </Transition>
      <Transition name="scale-y" mode="out-in">
        <div v-if="successMessage" class="my-4 text-sm text-green-500" v-html="successMessage"></div>
      </Transition>
      <div class="mt-[50px] container flex flex-wrap justify-between max-w-[1200px]">
        <div class="w-3/7 lg:w-auto">
          <div class="mb-1 footer-title">corp info</div>
          <div class="text-sm footer-text-main">
            <a class="py-[5px] block" target="_blank">about us</a>
            <a href="/" class="py-[5px] block">contact us</a>
            <a href="/" class="py-[5px] block">our blog</a>
          </div>
        </div>
        <div class="w-3/7 lg:w-auto">
          <div class="mb-1 footer-title">products & service</div>
          <div class="text-sm footer-text-main flex">
            <div class="text-sm">
              <a class="py-[5px] block" target="_blank">Landscape</a>
              <a href="/" class="py-[5px] block">animals</a>
              <a href="/" class="py-[5px] block">figure</a>
              <a href="/" class="py-[5px] block">flower & trees</a>
            </div>
            <div class="text-sm ml-4">
              <a class="py-[5px] block" target="_blank">fish & birds</a>
              <a href="/" class="py-[5px] block">grass & insects</a>
              <a href="/" class="py-[5px] block">melons & fruits</a>
              <a href="/" class="py-[5px] block">calligraphy</a>
            </div>
          </div>
        </div>
        <div class="w-3/7 lg:w-auto">
          <div class="mb-1 footer-title">Our Guarantee</div>
          <div class="text-sm footer-text-main">
            <a class="py-[5px] block" target="_blank">Return Policy</a>
            <a href="/" class="py-[5px] block">save up to 80%</a>
          </div>
        </div>
        <div class="w-3/7 lg:w-auto">
          <div class="mb-1 footer-title">Further Info</div>
          <div class="text-sm footer-text-main">
            <a class="py-[5px] block" target="_blank">Shipping Guide</a>
            <a href="/" class="py-[5px] block">How to pay</a>
            <a href="/" class="py-[5px] block">FAQ</a>
          </div>
        </div>
        <div class="w-[180px]">
          <div class="flex flex-wrap justify-end">
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
            <div class="image-item"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom flex items-center justify-center mb-[20px] mt-[50px] pt-[20px]">
      <div class="copywrite">
        <p class="text-xs text-center">
          Terms of Use, Privacy Policy, Sitemap, © 2024 oriental-art corp
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
  background: url("/icons/footer.png") no-repeat;
  background-size: 100% 100%;
}
.footer-top span{
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 18px;
  color: rgba(255,255,255,0.95);
  white-space: pre;
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
  margin-top: 15px;
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
}
.image-item {
  width: 48px;
  height: 34px;
  margin-left: 5px;
  margin-bottom: 5px;
  background: black;
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
</style>
