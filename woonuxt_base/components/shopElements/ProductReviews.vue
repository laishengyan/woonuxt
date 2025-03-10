<script setup>
const props = defineProps({
  product: { type: Object, default: null },
  indexShow: { type: Boolean, default: false },
  isPost: { type: Boolean, default: false },
  post: { type: Object, default: null }
});
const productId = ref(props.product?.databaseId);
const { locale, t } = useI18n();
const allReviews = ref([])
const postAllReviews = ref([])
const productAllReviews = ref([])
const productReviewsPage = ref([])
const productReviewTotal = ref(0)
const reviewAverage = ref(0)
const hovered = ref(0);
const rating = ref(null);
const active = ref(0);
const currentPage = ref(1);
if (props.isPost) {
  active.value = 1
}
const changePage = () => {
  getList()
}
const getList = () => {
  productReviewsPage.value = allReviews.value.slice((currentPage.value - 1) * 10, currentPage.value * 10)
}
const promiseList = []
if (props.indexShow) {
  const newPromise = new Promise(async (resolve, reject) => {
    const { data: productsReviews } = await useAsyncGql('GetAllProductReviews')
    productAllReviews.value = productsReviews.value?.allProductReviews || []
    
    resolve()
  })
  const newPromise2 = new Promise(async (resolve, reject) => {
    const { data: postsReviews } = await useAsyncGql('GetComments');
    postAllReviews.value = postsReviews.value?.getComments || []
    for (const iterator of postAllReviews.value) {
      iterator.images = iterator.images.map(item => {
        return {
          sourceUrl: item,
          altText: item
        }
      })
    }
    resolve()
  })
  promiseList.push(newPromise, newPromise2)
}else {
  if (active.value == 1) {
    const newPromise = new Promise(async (resolve, reject) => {
      const { data: postsReviews } = await useAsyncGql('GetComments', {
        postId: props.post.databaseId,
      });
      postAllReviews.value = postsReviews.value?.getComments || []
      for (const iterator of postAllReviews.value) {
        iterator.images = iterator.images.map(item => {
          return {
            sourceUrl: item,
            altText: item
          }
        })
      }
      resolve()
    })
    promiseList.push(newPromise)
  }
}
Promise.all(promiseList).then(res => {
  if (active.value == 1) {
    allReviews.value = postAllReviews.value
  } else {
    if (props.product) {
      allReviews.value = props.product.productReviews || []
    } else {
      allReviews.value = productAllReviews.value
    }
    reviewAverage.value = allReviews.value.map(item => {
      return item.rating
    }).reduce((acc, cur) => {
      return acc + cur
    }, 0) / allReviews.value.length || 0
  }
  productReviewTotal.value = allReviews.value.length || 0
  getList()
})
const authorName = ref(null);
const content = ref(null);
const email = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const isPending = ref(false);
const show = ref(false);
const imageUrlList = ref([]);
const { openLoading, hideLoading, getNowLanguage, getNowLanguageSlug } = useUtils();
const handleClickImage = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', handleFileChange);
  fileInput.click();
}
async function addComment() {
  const variables = {
    productId: productId.value,
    authorName: authorName.value,
    content: content.value,
    rating: rating.value,
    email: email.value,
    images: imageUrlList.value,
  };
  try {
    isPending.value = true;
    if (!props.isPost) {
      const { data } = await useAsyncGql('submitPhotoReview', variables);
      if (data.value.submitPhotoReview.success) {
        successMessage.value = t("messages.product.11");
        setTimeout(() => {
          successMessage.value = '';
          show.value = false;
        }, 4000);
      } else {
        errorMessage.value = data.value.submitPhotoReview.message;
        setTimeout(() => {
          errorMessage.value = '';
        }, 5000);
      }
    } else {
      const { data } = await useAsyncGql('CreatePhotoReview', {
        postId: props.post.databaseId,
        content: content.value,
        author: authorName.value,
        authorEmail: email.value,
        photos: imageUrlList.value,
      });
      if (data.value.createPhotoReview.success) {
        successMessage.value = t("messages.product.11");
        setTimeout(() => {
          successMessage.value = '';
          show.value = false;
        }, 4000);
      } else {
        errorMessage.value = data.value.createPhotoReview.message;
        setTimeout(() => {
          errorMessage.value = '';
        }, 5000);
      }
    }
  } catch (error) {
    errorMessage.value = error?.gqlErrors?.[0].message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isPending.value = false;
  }
}

const handleFileChange = async (event) => {
  openLoading()
  const file = event.target.files[0]; // 获取文件
  // 允许的图片类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  // 最大文件大小（例如 5MB）
  const maxSize = 2 * 1024 * 1024; // 2MB

  // 判断图片类型
  if (!allowedTypes.includes(file.type)) {
      alert('只允许上传 JPG、PNG 或 GIF 格式的图片！');
      hideLoading()
      return;
  }

  // 判断图片大小
  if (file.size > maxSize) {
      alert('图片大小不能超过 2MB！');
      hideLoading()
      return;
  }
  uploadImageToWordPress(file).then(source_url => {
    if (source_url) {
      imageUrlList.value.push(source_url);
    }
    hideLoading()
  })
  // const reader = new FileReader();

  // reader.onload = async () => {
  //   const base64File = reader.result.split(',')[1]; // 获取 Base64 数据
  //   try {
  //     const { data } = await useAsyncGql('uploadImage', {
  //       file: base64File
  //     });
  //     if (data.value.uploadImage.success) {
  //       imageUrlList.value.push(data.value.uploadImage.url);
  //       hideLoading()
  //     }
  //   } catch (error) {
  //     hideLoading()
  //     alert(t("messages.product.12"));
  //   }
  // };

  // reader.readAsDataURL(file); // 读取文件为 Base64
}

const uploadImageToWordPress = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await $fetch('https://b.oriental-art.net/wp-json/wp/v2/media', {
      method: 'POST',
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJvcmllbnRhbC1hcnQiLCJpYXQiOjE3NDE0MDMyMzgsImV4cCI6MTg5OTA4MzIzOH0.LqS8hJ250z905izavK-2F0JUZIjhWG_1Ds29_N7jufU"
      },
      body: formData,
    });
    // console.log(response);
    // 返回上传图片的 URL
    return response.source_url;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};


function handleDeleteImage(i) {
  imageUrlList.value.splice(i, 1);
}

function setHovered(i) {
  hovered.value = i;
}

function resetHovered() {
  hovered.value = 0;
}

async function handleChangeClick(val) {
  currentPage.value = 1;
  active.value = val;
  if (val == 1) {
    allReviews.value = postAllReviews.value
  } else {
    allReviews.value = productAllReviews.value
  }
  getList()
}

const handleChangeShow = () => {
  if (!props.product && !props.isPost) return;
  show.value = !show.value;
}
watch(() => props.post, async (val) => {
  const { data } = await useAsyncGql('GetComments', {
    postId: props.post.databaseId
  })
  allReviews.value = data.value?.getComments || []
})
</script>

<template>
  <div class="container max-w-[1200px] mt-[0.63rem] px-[0.63rem] sm:mt-[10px] sm:px-0">
    <div class="mb-[10px] flex justify-between sm:items-center flex-col sm:flex-row">
      <div class="review_btn_list flex items-center">
        <div class="site_review_btn mr-[1.25rem] sm:mr-[20px]" :class="{active: active == 0}" v-if="!props.isPost" @click="handleChangeClick(0)">{{ $t("messages.product.9") }}</div>
        <div class="site_review_btn" :class="{active: active == 1}" v-if="props.indexShow || props.isPost" @click="handleChangeClick(1)">{{ $t("messages.product.14") }}</div>
      </div>
      <StarRating style="justify-content: flex-start;" :rating="reviewAverage" :count="productReviewTotal" v-if="active != 1" class="mt-[0.63rem] sm:hidden"/>
      <div class="review_btn_right2 w-full h-[3.13rem] sm:w-[240px] sm:h-[44px] flex items-center justify-center mt-[0.63rem] sm:mt-[0]" @click="handleChangeShow" v-if="!props.indexShow">{{ $t("messages.product.15") }}</div>
    </div>
    <transition class="ease-in-out transform transition-all" name="scale-y">
      <form v-if="show" @submit.prevent="addComment" class="writeReview">
        <div class="new_title">{{ $t("messages.product.15") }}</div>
        <div class="w-full col-span-full mt-3" v-if="!props.isPost">
          <label for="content" class="text-sm mb-0.5 text_label mb-2"><span class="text-red-500">*</span>{{ $t("messages.product.16") }}</label>
          <div class="gap-1 flex mt-2 relative">
            <label
              v-for="i in 5"
              :key="i"
              class="grid w-[14px] h-[14px]"
              :class="rating < i && i > hovered ? 'disable-star' : 'checked-star'"
              @mouseover="setHovered(i)"
              @mouseout="resetHovered">
              <input type="radio" class="overflow-hidden appearance-none opacity-0 absolute" name="rating" :value="i" v-model="rating" required />
              <Icon name="ion:star" :size="14 + ''" />
            </label>
          </div>
        </div>
        <div class="w-full col-span-full mt-[10px]">
          <label for="content" class="text-sm mb-0.5 text_label"><span class="text-red-500">*</span>{{ $t("messages.product.17") }} </label>
          <textarea class="w-full mt-[10px]" id="content" :placeholder="$t('messages.account.EnterReview')" v-model="content" required></textarea>
        </div>
        <div class="w-full col-span-full">
          <label for="content" class="text-sm mb-0.5 text_label">{{ $t("messages.product.18") }}</label>
          <div class="flex gap-[10px] mt-[10px] flex-wrap">
            <div class="add_upload" @click="handleClickImage" v-if="imageUrlList.length < 10">+</div>
            <div class="w-[80px] h-[80px] cursor-pointer image_item" v-for="item in imageUrlList" :key="item + '_' + i">
              <img class="w-full h-full" :src="item" alt="" loading="lazy">
              <div class="close_icon">
                <img @click="handleDeleteImage(i)" src="/images/delete2.png" class="w-[16px] h-[16px]" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex gap-[10px] mt-[10px] flex-col sm:flex-row">
          <div class="flex-1">
            <label for="content" class="text-sm mb-0.5"><span class="text-red-500">*</span>{{ $t("messages.product.19") }}</label>
            <input class="w-full mt-[10px]" :placeholder="$t('messages.account.EnterYourName')" v-model="authorName" required />
          </div>
          <div class="flex-1">
            <label for="author" class="text-sm mb-0.5"><span class="text-red-500">*</span>{{ $t("messages.product.20") }}</label>
            <input class="w-full mt-[10px]" id="author" :placeholder="$t('messages.account.EnterYourEmail')"  type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" v-model="email" required />
          </div>
        </div>
        <Transition name="scale-y" mode="out-in">
          <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
        </Transition>
        <Transition name="scale-y" mode="out-in">
          <div v-if="successMessage" class="my-4 text-sm text-green-500" v-html="successMessage"></div>
        </Transition>
        <div class="flex justify-end mb-[0.63rem] mt-[0.63rem] sm:mt-[20px] sm:mb-[0]">
          <button class="review_btn_right w-full h-[3.13rem] sm:w-[240px] sm:h-[44px] flex items-center justify-center" type="submit">
            <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
            <span>{{ $t("messages.product.21") }}</span>
          </button>
        </div>
      </form>
    </transition>
    <client-only>
      <StarRating style="justify-content: flex-start;" :rating="reviewAverage" :count="productReviewTotal" v-if="active != 1" class="hidden sm:inline-flex"/>
    </client-only>
    <client-only>
      <div class="review_list mt-[0.63rem] sm:mt-[30px] sm:pb-[80px]">
        <div class="review_item flex items-start pb-[20px] mb-[20px]" v-for="item in productReviewsPage" :key="item.id">
          <div class="review_user w-[2.5rem] h-[2.5rem] sm:w-[48px] sm:h-[48px] flex items-center justify-center">{{ item.authorName.charAt(0) }}</div>
          <div class="review_content sm:mt-[5px] ml-[10px] flex-1">
            <div class="review_content_title flex items-center justify-between">
              <div>
                <span class="title_name">{{ item.authorName }}</span>
              </div>
              <div class="review_date">{{ item.date }}</div>
            </div>
            <StarRating :rating="item.rating" hideCount v-if="!props.isPost && active != 1"/>
            <div class="review_text mt-[0.25rem] sm:mt-[5px]" v-html="item.content"></div>
            <div class="mt-[10px] flex flex-wrap align-center gap-[10px]" v-if="item.images.length > 0">
              <div class="w-[120px] h-[120px]" v-for="(item1, i) in item.images" :key="i">
                <img class="w-full h-full object-contain object-cover" :src="item1.sourceUrl" alt="" loading="lazy">
              </div>
            </div>
            <div class="flex items-start justify-between mt-[10px]">
              <!-- <div class="share_btn flex items-center gap-[5px]"> -->
                <!-- <img class="w-[16px] h-[16px]" src="/icons/share.png" alt="" loading="lazy">
                <span>Share</span> -->
                <ShareButton class="mt-[0]" :product="{}" :productReview="item"></ShareButton>
              <!-- </div> -->
              <NuxtLink :to="`/${locale}/product/${getNowLanguageSlug(item.product?.allLanguageSlugs || [], locale)}`" class="review_desc flex-1 inline-block ml-[0.5rem] text-right" v-if="props.indexShow && active == 0">
                {{ item.product ? getNowLanguage(item.product?.allLanguageSlugs, locale) : '' }}
              </NuxtLink>
              <NuxtLink :to="`/${locale}/blog/${getNowLanguageSlug(item.post?.allLanguageSlugs || [], locale)}`" class="review_desc flex-1 inline-block ml-[0.5rem] text-right" v-if="props.indexShow && active == 1 && item.post">
                {{ item.post ? getNowLanguage(item.post.allLanguageSlugs, locale) : '' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </client-only>
    <GeneralPagination :total="productReviewTotal" @pagination="changePage" v-model:current="currentPage" v-if="productReviewTotal > 10"></GeneralPagination>
  </div>
</template>

<style lang="postcss" scoped>
.review_list {
  .review_item {
    border-bottom: 1px solid #E8E8E8;
    .review_user {
      background: #A7CEFF;
      border-radius: 50%;
      font-family: Source Han Serif CN-Medium;
      font-weight: 500;
      font-size: 20px;
      color: #FFFFFF;
    }
    .review_content {
      .review_content_title {
        font-family: HarmonyOS Sans-Medium;
        font-weight: 500;
        font-size: 14px;
        color: #292929;
        .title_name {
          font-family: HarmonyOS Sans-Medium;
          font-weight: 500;
          font-size: 0.88rem;
          color: #167EFF;
        }
        .review_date {
          font-family: HarmonyOS Sans-Regular;
          font-weight: 400;
          font-size: 0.81rem;
          color: #686868;
        }
      }
      .review_text {
        font-family: HarmonyOS Sans-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #686868;
      }
      .review_desc {
        font-family: HarmonyOS Sans-Regular;
        font-weight: 400;
        font-size: 12px;
        color: #686868;
        &:hover {
          color: #7F1C1B;
        }
      }
      .share_btn {
        cursor: pointer;
        font-family: HarmonyOS Sans-Regular;
        font-weight: 400;
        font-size: 12px;
        color: #686868;
      }
    }
  }
}
.site_review_btn {
  font-family: HarmonyOS Sans-Regular;
  font-weight: 400;
  font-size: 0.94rem;
  color: #686868;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 0.19rem;
    background: transparent;
  }
  &.active {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    color: #292929;
    &::after {
      background: #7F1C1B;
    }
  }
}
.disable-star {
  @apply text-gray-300;
  transition: 0.15s ease-in-out;
}
.checked-star {
  @apply text-amber-400;
  transition: 0.15s ease-in-out;
}
.writeReview input,
.writeReview textarea {
  @apply border w-full py-2 px-4;
}
.image_item {
  position: relative;
  .close_icon {
    display: none;
    background: rgba(0, 0, 0, .4);
    color: #FFFFFF;
    font-size: 12px;
    @apply absolute right-0 top-0 w-full h-full justify-center items-center;
  }
  &:hover {
    .close_icon {
      @apply flex;
    }
  }
}
.new_title {
  font-family: HarmonyOS Sans-Bold;
  font-weight: bold;
  font-size: 20px;
  color: #292929;
}
.text_label {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 15px;
  color: #292929;
}
.add_upload {
  width: 80px;
  height: 80px;
  background: #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px dashed #CBCBCB;
  color: #8B8B8B;
  @apply flex justify-center items-center cursor-pointer;
}
.review_btn_right2 {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 13px;
  background-image: url("/icons/write_btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  color: #292929;
  &:hover {
    color: #7F1C1B;
    background-image: url("/icons/write_btn_hover.png");
  }
}
.review_btn_right {
  background-image: url("/modile/btn_master2.webp");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 0.88rem;
  color: #FFFFFF;
}
@media (min-width: 640px) {
  .site_review_btn {
    font-size: 16px;
    &::after {
      height: 2px;
    }
  }
  .review_btn_right {
    font-size: 13px;
    background-image: url("/icons/write_btn.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    color: #292929;
    &:hover {
      color: #7F1C1B;
      background-image: url("/icons/write_btn_hover.png");
    }
  }
}
</style>
