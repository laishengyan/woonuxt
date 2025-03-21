<script setup lang="ts">
const { viewer, avatar, logoutUser, isPending } = useAuth();
const { locale, t } = useI18n();
const linkTitle = computed<string>(() => viewer.value?.username || t("messages.my_account.1"));
</script>

<template>
  <NuxtLink :to="`/${locale}/my-account`" :title="linkTitle" class="hidden sm:inline-flex aspect-square items-center">
    <Transition name="pop-in" mode="out-in">
      <span v-if="avatar" class="relative avatar">
        <img :src="avatar" class="rounded-full transform scale-125 shadow-md overflow-hidden border border-white my-auto" width="22" height="22" :alt="linkTitle" loading="lazy" />
        <div class="account-dropdown">
          <NuxtLink :to="`/${locale}/wishlist`" class="hover:bg-gray-100"><Icon name="ion:heart-outline" size="16" /><span>{{ $t("messages.my_account.2") }}</span></NuxtLink>
          <NuxtLink :to="`/${locale}/my-account`" class="hover:bg-gray-100"><Icon name="ion:person-outline" size="16" /><span>{{ $t("messages.my_account.3") }}</span></NuxtLink>
          <button class="text-red-600 hover:bg-red-50" @click.prevent="logoutUser">
            <LoadingIcon v-if="isPending" size="16" />
            <Icon v-else name="ion:log-out-outline" size="16" />
            <span>{{ $t("messages.my_account.4") }}</span>
          </button>
        </div>
      </span>
      <Icon v-else name="ion:person-outline" size="22" class="border border-transparent" />
    </Transition>
  </NuxtLink>
</template>

<style scoped lang="postcss">
.pop-in-enter-active,
.pop-in-leave-active {
  transition: transform 0.3s;
}

.pop-in-enter-from,
.pop-in-leave-to {
  transform: scale(0);
}

.avatar {
  .account-dropdown {
    @apply absolute gap-2 top-6 -right-2  z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 hidden;

    a,
    button {
      @apply flex gap-2 items-center p-2 rounded whitespace-nowrap min-w-[200px];
    }
  }

  &:hover .account-dropdown {
    @apply grid;
  }
}
</style>
