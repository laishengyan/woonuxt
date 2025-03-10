<script lang="ts" setup>
const { locale } = useI18n();
</script>

<template>
  <nav>
    <NuxtLink :to="`/${locale}`">{{ $t('messages.general.home') }}</NuxtLink>
    <NuxtLink :to="`/${locale}/products`">{{ $t('messages.general.allProducts') }}</NuxtLink>
    <NuxtLink :to="`/${locale}/categories`">{{ $t('messages.shop.category', 2) }}</NuxtLink>
    <NuxtLink :to="`/${locale}/contact`">{{ $t('messages.general.contact') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="`/${locale}/wishlist`" :prefetch="false">{{ $t('messages.shop.wishlist') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="`/${locale}/my-account`" :prefetch="false">{{ $t('messages.my_account.3') }}</NuxtLink>
  </nav>
</template>
