<template>
  <div class="container max-w-[1200px] px-[0.63rem] sm:px-0">
    <Breadcrumb :isCorpInfo="true" />
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ title }}</span>
    </div>
    <div class="img_text pb-[20px] flex flex-col sm:flex-row" v-html="content">
    </div>
    <div class="little_title relative min-h-[1.88rem] mt-[1.25rem] mb-[1.25rem] sm:min-h-[44px] sm:mt-[20px] sm:mb-[20px]">
      <img class="max-h-[44px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block" src="/icons/title_bg.webp" alt="" loading="lazy">
      <img class="max-h-[1.88rem] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 block sm:hidden" src="/modile/title_bg.webp" alt="" loading="lazy">
      <span class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0">{{ $t("messages.corp_info.5") }}</span>
    </div>
    <div class="contact_info flex justify-between mb-[80px] flex-col sm:flex-row">
      <div class="left w-full sm:w-[374px]">
        <div class="email">
          <span>{{ $t("messages.corp_info.6") }}</span>
          <div>onlyartforyou@outlook.com</div>
        </div>
        <div class="phone">
          <span>{{ $t("messages.corp_info.7") }}</span>
          <div>+86 189 7088 8044</div>
        </div>
        <div class="address">
          <span>{{ $t("messages.corp_info.8") }}</span>
          <div>
            <div>{{ $t("messages.corp_info.9") }}</div>
            <div>{{ $t("messages.corp_info.10") }},</div>
            <div>{{ $t("messages.corp_info.11") }},</div>
            <div>{{ $t("messages.corp_info.12") }},</div>
            <div>{{ $t("messages.corp_info.13") }}</div>
          </div>
        </div>
      </div>
      <div class="right mt-[0.63rem] sm:mt-[0] sm:ml-[90px] flex-1">
        <div class="two_input">
          <input v-model="name" placeholder="Name*" type="text" required />
          <input v-model="email" placeholder="Email*" type="text" required class="mt-[0.63rem] sm:mt-0" />
        </div>
        <div class="two_input">
          <input v-model="phone" placeholder="Phone/WhatsApp*" type="text" required />
          <input v-model="country" placeholder="Country*" type="text" required class="mt-[0.63rem] sm:mt-0" />
        </div>
        <div class="two_input">
          <input v-model="companyName" placeholder="company Name" type="text" required />
        </div>
        <div class="two_input">
          <textarea placeholder="Content*"></textarea>
        </div>
        <div class="send">{{ $t("messages.corp_info.14") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  const name = ref('')
  const email = ref('')
  const phone = ref('')
  const country = ref('')
  const companyName = ref('')
  const { locale } = useI18n();
  const { localNum } = useUtils();
  const title = ref('')
  const content = ref('')
  const { data } = await useAsyncGql('page', {
    pageId: 1300,
    language: localNum(locale.value)
  })
  const nowData = data.value?.pageBy?.translation
  title.value = nowData?.title
  content.value = nowData?.content
  useHead({
    title: title.value,
    meta: [{
      hid: title.value, name: title.value, content: content.value
    }]
  })
</script>

<style lang='postcss' scoped>
.little_title {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.94rem;
  color: #7F1C1B;
}
@media (min-width: 640px) {
  .little_title {
    font-family: HarmonyOS Sans-Bold;
    font-weight: bold;
    font-size: 16px;
    color: #7F1C1B;
  }
}
.container {
  :deep(.img_text) {
    .text {
      font-family: HarmonyOS Sans-Medium;
      font-weight: 500;
      font-size: 14px;
      color: rgba(26,26,26,0.95);
    }
  }
  .contact_info {
    .left {
      .email, .phone, .address {
        span {
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 14px;
          color: #686868;
          @apply mb-[5px];
        }
        div {
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 1rem;
          color: #1A1A1A;
        }
      }
      .phone, .address {
        @apply mt-[0.63rem] sm:mt-[40px];
      }
    }
    .right {
      .two_input {
        @apply sm:flex;
        & + .two_input {
          @apply mt-[0.63rem] sm:mt-[18px];
        }
        input {
          border: 1px solid #CBCBCB;
          @apply w-full sm:flex-1 px-[16px] h-[40px];
          & + input {
            @apply sm:ml-[18px];
          }
          &::placeholder {
            font-family: HarmonyOS Sans-Regular;
            font-weight: 400;
            font-size: 13px;
            color: #8A8A8A;
          }
        }
        textarea {
          border: 1px solid #CBCBCB;
          resize: none;
          @apply w-full flex-1 h-[100px] px-[16px] py-[12px];
        }
      }
      .send {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 44px;
        background: url('/images/btn_concat.png') no-repeat;
        background-size: 100% 100%;
        font-family: HarmonyOS Sans-Regular;
        font-weight: 400;
        font-size: 13px;
        color: rgba(255,255,255,0.95);
        cursor: pointer;
      }
    }
  }
}
</style>