<template>
  <div class="container max-w-[1200px] mt-[10px] px-[0.63rem] sm:px-0">
    <span v-html="title"></span>
    <br/><br/>
    <div v-html="content" class="content mb-[1.25rem]">
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const { localNum } = useUtils();
const title = ref('')
const content = ref('')
const { data } = await useAsyncGql('page', {
  pageId: 1098,
  language: localNum(locale.value)
})
const nowData = data.value?.pageBy?.translation
title.value = nowData?.title
content.value = nowData?.content
useHead({
  title: title.value,
  meta: [{
    hid: title.value, name: title.value, content: content.value
  }],
})
</script>

<style scoped>
.container > span {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 28px;
  color: #292929;
}
:deep(p) {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
}
</style>