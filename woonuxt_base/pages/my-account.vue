<script lang="ts" setup>
const { logoutUser, viewer, customer, isPending } = useAuth();
const { locale, t } = useI18n();
const { cart } = useCart();
const route = useRoute();

const activeTab = computed(() => route.query.tab || 'my-details');
const showLoader = computed(() => !viewer && !customer);
const activeId = ref(1);
useHead({
  title:  t('messages.account.loginToAccount'),
  meta: [{ hid: t('messages.account.loginToAccount'), name:t('messages.account.loginToAccount'), content: t('messages.account.loginToAccount')}],
})
</script>

<template>
  <div class="flex-1 flex sm:block flex-col justify-between" :class="viewer ? '' : 'login_bg'">
    <div class="sticky flex items-center justify-center sm:hidden title_top h-[2.75rem] top-0 bg-white z-40">
      <span class="absolute top-[50%] left-0 transform -translate-y-1/2">
        <NuxtLink :to="`/${locale}`">
          <Icon name="ion:chevron-down-outline" class="transform rotate-90" size="24"/>
        </NuxtLink>
      </span>
      <span>login</span>
    </div>
    <div v-if="showLoader" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
    <template v-else>
      <LazyLoginAndRegister v-if="!viewer" />
      <div class="w-full lg:gap-8 bg-[#F9F9F9] flex-1 sm:flex-none" v-if="viewer">
        <div class="personal_infomation_container container flex flex-col items-start lg:flex-row max-w-[1200px]">
          <nav class=" flex px-[0.63rem] sm:px-0 lg:grid flex-wrap w-full gap-1 py-[0.63rem] sm:pt-0 sm:my-8 text-gray-600 min-w-[240px] top-24 lg:w-auto sm:mr-[20px]">
            <div :class="activeTab == 'my-details' && 'active'" class="row">
              <NuxtLink
                :to="`/${locale}/my-account?tab=my-details`"
                class="flex items-center gap-4 p-3 px-[0.63rem] sm:px-4 rounded-lg hover:text-primary"
                :class="{ active: activeTab == 'my-details' }">
                {{ $t('messages.general.myDetails') }}
              </NuxtLink>
            </div>
            <div :class="activeTab == 'orders' && 'active'" class="row">
              <NuxtLink :to="`/${locale}/my-account?tab=orders`" class="flex items-center gap-4 p-3 px-[0.63rem] sm:px-4 rounded-lg hover:text-primary" :class="{ active: activeTab == 'orders' }">
                {{ $t('messages.shop.order', 2) }}
              </NuxtLink>
            </div>
            <div :class="activeTab == 'changePassword' && 'active'" class="row">
              <NuxtLink
                :to="`/${locale}/my-account?tab=changePassword`"
                class="flex items-center gap-4 p-3 px-[0.63rem] sm:px-4 rounded-lg hover:text-primary"
                :class="{ active: activeTab == 'changePassword' }">
                {{ $t('messages.account.changePassword') }}
              </NuxtLink>
            </div>
            <div class="row">
              <button class="flex items-center gap-4 p-3 px-[0.63rem] sm:px-4 rounded-lg hover:text-primary" @click="logoutUser">
                <LoadingIcon v-if="isPending" size="22" />
                {{ $t('messages.account.logout') }}
              </button>
            </div>
          </nav>
          <main class="flex-1 w-full lg:my-8 rounded-lg">
            <AccountMyDetails v-if="activeTab === 'my-details'" :user="viewer" />
            <OrderList v-else-if="activeTab === 'orders'" />
            <ChangePassword v-else-if="activeTab === 'changePassword'" />
          </main>
        </div>
      </div>
      <div class="text_footer mt-[2.5rem] sm:hidden pb-[1.25rem] text-center">{{ $t("messages.general.footerMain") }}, © 2024 oriental-art corp</div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
a.active {
  @apply text-primary;
}
.login_bg {
  background-color: #FFFFFF;
}
.personal_infomation_container {
  overflow-y: auto;
  min-height: 100%;
}
.row {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #292929;
  background: url('/images/no_select.png') no-repeat;
  background-size: 100% 100%;
  @apply flex items-center justify-center h-[60px] cursor-pointer flex-1 sm:flex-none;
  &.active {
    color: #FFFFFF;
    background: url('/images/select.png') no-repeat;
    background-size: 100% 100%;
    >a {
      color: #FFFFFF;
    }
  }
}
.title_top {
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 1rem;
  color: #1A1A1A;
}
.text_footer {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 0.69rem;
  color: #686868;
}
@media (min-width: 640px) {
  .login_bg {
    background-image: url("/images/login-back.webp");
    background-size: 100% 100%;
  }
}
</style>
