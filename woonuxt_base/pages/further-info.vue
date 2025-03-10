<template>
  <div class="container max-w-[1200px] px-[0.63rem] sm:px-0">
    <Breadcrumb :isFurtherInfo="true" />
    <div class="flex mt-[10px] flex-col sm:flex-row">
      <div class="left flex gap-[10px] flex-row sm:flex-col sm:w-[240px] mb-[0.63rem] sm:mb-0">
        <NuxtLink :to="`/${locale}/further-info?${item.id == 1 ? 'slug=shipping-guide' : item.id == 2 ?'slug=how-to-pay' :'slug=faq'}`" v-for="item in list" :key="item.id" class="flex-1 sm:flex-none">
          <div :class="activeId === item.id ? 'active' : ''" class="row">
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>
      <div class="right">
        <div v-show="activeId == 1" key="content1" class="first_block" v-html="content1">
        </div>
        <div  v-show="activeId == 2" key="content2" class="second_block pb-[2.5rem]" v-html="content2">
        </div>
        <div  v-show="activeId == 3" key="content3" class="third_block mb-[2.5rem] sm:mb-[80px]" v-html="content3" id="third_block">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n();
const { localNum } = useUtils();
const content1 = ref('')
const content2 = ref('')
const content3 = ref('')
const { data: shippingData } = await useAsyncGql('page', {
  pageId: 1128,
  language: localNum(locale.value)
})
const { data: payData } = await useAsyncGql('page', {
  pageId: 1172,
  language: localNum(locale.value)
})
const { data: FAQData } = await useAsyncGql('page', {
  pageId: 1204,
  language: localNum(locale.value)
})
const nowData1 = shippingData.value?.pageBy?.translation
content1.value = nowData1?.content

const nowData2 = payData.value?.pageBy?.translation
content2.value = nowData2?.content

const nowData3 = FAQData.value?.pageBy?.translation
content3.value = nowData3?.content
const list = computed(() => {
  return [
    { id: 1, name: t("messages.further_info.js.1") },
    { id: 2, name: t("messages.further_info.js.2") },
    { id: 3, name: t("messages.further_info.js.3") }
  ]
});
const route = useRoute();
const { scrollToTop } = useHelpers();
const activeId = computed(() => {
  const slug = route.query?.slug;
  if (window) {
    scrollToTop()
  }
  switch(slug) {
    case 'shipping-guide': {
      useHead({
        title: t('messages.further_info.js.1'),
        meta: [{
          hid: t('messages.further_info.js.1'), name: t('messages.further_info.js.1'), content: content1.value
        }]
      })
      return 1
    }
    case 'how-to-pay': {
      useHead({
        title: t('messages.further_info.js.2'),
        meta: [{
          hid: t('messages.further_info.js.2'), name: t('messages.further_info.js.2'), content: content2.value
        }]
      })
      return 2
    }
    case 'faq': {
      useHead({
        title: t('messages.further_info.js.3'),
        meta: [{
          hid: t('messages.further_info.js.3'), name: t('messages.further_info.js.3'), content: content3.value
        }]
      })
      return 3
    }
    default: {
      useHead({
        title: t('messages.further_info.js.1'),
        meta: [{
          hid: t('messages.further_info.js.1'), name: t('messages.further_info.js.1'), content: content1.value
        }],
      })
      return 1
    }
  }
})
onMounted(() => {
  const third_block = document.getElementById('third_block')
  const subtitleList = third_block.getElementsByClassName('subtitle')
  const check_list = third_block.getElementsByClassName('check_btn')
  for (let i = 0; i < check_list.length; i++) {
    check_list[i].addEventListener('click', () => {
      if (check_list[i].src == "https://b.oriental-art.net/wp-content/uploads/2025/03/minus.png") {
        check_list[i].src = "https://b.oriental-art.net/wp-content/uploads/2025/03/add.png"
        subtitleList[i].classList.add('hidden')
        return;
      }
      for (let j = 0; j < subtitleList.length; j++) {
        subtitleList[j].classList.add('hidden')
        check_list[j].src = "https://b.oriental-art.net/wp-content/uploads/2025/03/add.png"
      }
      subtitleList[i].classList.remove('hidden')
      check_list[i].src = "https://b.oriental-art.net/wp-content/uploads/2025/03/minus.png"
    })
  }
})
</script>

<style lang='postcss' scoped>
  :deep(p) {
    display: block;
    margin-block-start: 0;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    unicode-bidi: isolate;
  }
  /* 展开收缩专用过渡 */
  .collapse-enter-active,
  .collapse-leave-active {
    transition: 
      max-height 0.5s ease-in-out,
      opacity 0.3s ease-in-out; /* 可选配合透明度 */
    overflow: hidden;
  }

  .collapse-enter-from,
  .collapse-leave-to {
    max-height: 0 !important;
    opacity: 0; /* 可选配合透明度 */
  }

  .collapse-enter-to,
  .collapse-leave-from {
    max-height: 500px; /* 大于实际最大高度即可 */
    opacity: 1;
  }
  .fade-box-enter-active {
    transition: opacity 0.5s;
  }
  .fade-box-leave-active {
    transition: opacity 0.3s;
  }
  .fade-box-enter, .fade-box-leave-to {
    opacity: 0;
  }

  /* 添加一些样式以确保元素在展开和收缩时不会跳动 */
  .row {
    overflow: hidden;
  }
  .container {
    .left {
      .row {
        font-family: HarmonyOS Sans-Medium;
        font-weight: 500;
        font-size: 14px;
        color: #292929;
        background: url('/images/no_select.png') no-repeat;
        background-size: 100% 100%;
        @apply flex items-center justify-center h-[60px] cursor-pointer;
        &.active {
          color: #FFFFFF;
          background: url('/images/select.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .right {
      @apply flex-1 sm:ml-[20px] overflow-hidden;
      :deep(.first_block) {
        .title {
          margin-bottom: 10px;
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 16px;
          color: #1A1A1A;
        }
        p {
          padding-bottom: 24px;
          font-family: HarmonyOS Sans-Regular;
          font-weight: 400;
          font-size: 14px;
          color: rgba(26,26,26,0.95);
        }
        .table {
          margin: 6px 0 80px;
          width: 100%;
          border-collapse: collapse;
          tr {
            height: 50px;
            font-family: HarmonyOS Sans-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #1A1A1A;
            &:nth-child(odd) {
              background: #FFFFFF;
            }
            &:nth-child(even) {
              background: #F7F7F7;
            }
            th {
              font-family: HarmonyOS Sans-Medium;
              font-weight: 500;
              font-size: 14px;
              color: rgba(26,26,26,0.95);
              background: #E8E8E8;
              border: 1px solid #8B8B8B;
            }
            td {
              width: 180px;
              text-align: center;
              border: 1px solid #8B8B8B;
            }
          }
        }
      }
      :deep(.third_block) {
        .top_title {
          font-family: HarmonyOS Sans-Bold;
          font-weight: bold;
          font-size: 18px;
          color: #292929;
          border-bottom: 1px solid #E8E8E8;
          @apply flex items-center h-[3.13rem] sm:px-[10px] sm:h-[70px];
        }
        .row {
          border-bottom: 1px solid #E8E8E8;
          @apply py-[0.63rem] sm:p-[15px];
          .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: HarmonyOS Sans-Medium;
            font-weight: 500;
            font-size: 16px;
            color: #292929;
            img {
              cursor: pointer;
            }
          }
          .subtitle {
            font-family: HarmonyOS Sans-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #686868;
            @apply mt-[0.63rem] sm:mt-[10px];
          }
          .hidden {
            display: none;
          }
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        }
      }
    }
  }
</style>