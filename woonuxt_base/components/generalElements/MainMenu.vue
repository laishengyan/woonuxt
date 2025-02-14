<script lang="ts" setup>
const { locale } = useI18n();
</script>

<template>
  <nav>
    <NuxtLink to="/">{{ $t('messages.general.home') }}</NuxtLink>
    <NuxtLink :to="`/${locale}/products`">{{ $t('messages.general.allProducts') }}</NuxtLink>
    <NuxtLink :to="`/${locale}/categories`">{{ $t('messages.shop.category', 2) }}</NuxtLink>
    <NuxtLink :to="`/${locale}/contact`">{{ $t('messages.general.contact') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="`/${locale}/wishlist`" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" :to="`/${locale}/my-account`" :prefetch="false">My Account</NuxtLink>
  </nav>
</template>
