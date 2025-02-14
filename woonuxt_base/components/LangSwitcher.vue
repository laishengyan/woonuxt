<script setup>
const { locales, locale, setLocaleCookie, setLocale } = useI18n();
const router = useRouter();
watch(locale, (newLocale) => {
  if (newLocale) {
    setLocaleCookie(newLocale)
    setLocale(newLocale)
  }
});
</script>

<template>
  <img class="w-4 h-4 mr-2" src="/icons/lang.png" alt="">
  <select v-model="locale" aria-label="Language switcher" class="p-0 lang_select">
    <option v-for="locale in locales" :key="locale" :value="locale.code" v-html="locale.name" />
  </select>
</template>
<style scoped>
.lang_select {
  background: transparent;
  border: none;
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 13px;
  color: rgba(255,255,255,0.95);
}
.lang_select:focus {
  outline: none;
}
.lang_select option {
  color: black;
}
</style>
