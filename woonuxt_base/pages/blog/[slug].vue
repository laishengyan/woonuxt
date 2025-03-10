<template>
  <div class="container max-w-[1200px] flex px-[0.63rem] sm:px-0 sm:mt-[10px] flex-col sm:flex-row">
    <div class="left flex-1 sm:mr-[20px]">
      <Breadcrumb :post="post" isPost v-if="post"></Breadcrumb>
      <span>{{ title }}</span>
      <div class="subtitle">{{ subtitle }}</div>
      <div v-html="content" class="mb-[20px] min-h-[200px] content"></div>
      <ProductReviews class="flex-col px-0" isPost :post="post" v-if="post"></ProductReviews>
    </div>
    <PostLike></PostLike>
  </div>
</template>

<script setup lang='ts'>
const route = useRoute()
const title = ref('')
const subtitle = ref('')
const content = ref('')
const slug = route.params.slug
const post = ref(null)
const { locale, t } = useI18n();
const { localNum } = useUtils();
const { data } = await useAsyncGql('getPostData', {
  id: slug,
  language: localNum(locale.value)
})
const nowData = data.value?.post?.translation
title.value = nowData?.title
subtitle.value = t("messages.blog.subtitle", { name: nowData?.author.node.name, date: nowData?.date })
content.value = nowData?.content
post.value = nowData

watch(locale, (to: any) => {
  if (post.value) {
    const slugLang = post.value.allLanguageSlugs.find((item: any) => item.code === to)?.slug
    if (slugLang) {
      route.params.slug = slugLang
      navigateTo({ path: `/${to}/blog/${slugLang}`, replace: true })
    } else {
      alert(t("messages.product.postNotFound"))
      navigateTo({ path: `/${to}`, replace: true })
    }
  }
})

useHead({
  title: title.value,
  meta: [{ hid: title.value, name: title.value, content: content.value }],
});
</script>

<style lang='postcss' scoped>
.container {
  .left {
    > span {
      height: 60px;
      line-height: 60px;
      font-family: HarmonyOS Sans-Medium;
      font-weight: 500;
      font-size: 28px;
      color: #292929;
    }
    .subtitle {
      margin-bottom: 25px;
      font-family: HarmonyOS Sans-Regular;
      font-weight: 400;
      font-size: 13px;
      color: #8B8B8B;
    }
    p {
      & + p {
        margin-top: 30px;
      }
    }
    .middle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0;
      img:first-child {
        width: 278px;
        height: 200px;
      }
      img:last-child {
        margin-left: 80px;
        width: 200px;
        height: 200px;
      }
    }
  }
}
.content > :deep(p) {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
}
</style>