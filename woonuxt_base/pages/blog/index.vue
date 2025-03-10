<script setup lang="ts">
const { locale, t } = useI18n();
const { fallbackImage } = useHelpers();
const { localNum } = useUtils();
const blogList = ref([])
const blogPage = ref([])
const total = ref(0)
const changePage = (page: number) => {
  blogPage.value = blogList.value.slice((page - 1) * 10, page * 10)
}
const currentPage = ref<number>(1)
useAsyncGql('GetAllPosts', {
  languages: localNum(locale.value)
}).then((res:any) => {
  blogList.value = res.data.value?.posts?.nodes || []
  blogPage.value = blogList.value.slice(0, 10)
  total.value = blogList.value.length
})

useHead({
  title: t('messages.blog.title'),
  meta: [{ hid: t('messages.blog.title'), name: t('messages.blog.title'), content: blogList.value?.map((item: any) => item.title)?.join(',') || t('messages.blog.title') }],
});
</script>
<template>
  <div class="container max-w-[1200px] px-[0.63rem] sm:px-0 sm:mt-[10px] flex flex-col sm:flex-row">
    <div class="left min-h-[400px] flex-1 sm:mr-[20px]">
      <Breadcrumb isPost></Breadcrumb>
      <span class="h-[60px] hidden sm:block" style="line-height: 60px;">{{ $t("messages.blog.title") }}</span>
      <div class="content mt-[10px] grid grid-cols-1 gap-[20px] sm:grid-cols-2">
        <NuxtLink :to="`/${locale}/blog/${decodeURIComponent(item.slug)}`" class="block cursor-pointer pb-[1.5rem] sm:pb-[40px]" v-for="item in blogPage" :key="item.id">
          <img :src="item.featuredImage ? item.featuredImage.node.sourceUrl : fallbackImage" alt="" loading="lazy" class="w-[460px] h-[244px] object-cover bg-[#f8f8f8]">
          <div class="title my-[0.63rem] sm:my-[18px] sm:text-center">{{ item.title }}</div>
          <div class="desc sm:text-center" v-html="item.excerpt"></div>
        </NuxtLink>
      </div>
      <GeneralPagination :total="total" @pagination="changePage" v-model:current="currentPage" v-if="total > 10"></GeneralPagination>
    </div>
    <PostLike></PostLike>
  </div>
</template>

<style lang='postcss' scoped>
  .container {
    .left {
      > span {
        font-family: HarmonyOS Sans-Medium;
        font-weight: 500;
        font-size: 28px;
        color: #292929;
      }
      .content {
        .block {
          .title {
            font-family: HarmonyOS Sans-Medium;
            font-weight: 500;
            font-size: 18px;
            color: rgba(26,26,26,0.95);
          }
          .desc {
            font-family: HarmonyOS Sans-Regular;
            font-weight: 500;
            font-size: 13px;
            color: #686868;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 5;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
</style>
