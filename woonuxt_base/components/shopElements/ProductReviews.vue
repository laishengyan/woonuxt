<script setup>
const props = defineProps({
  product: { type: Object, default: null },
});
const productId = ref(props.product?.databaseId);
const reviews = ref(props.product?.reviews);
const hovered = ref(0);
const rating = ref(null);
const content = ref(null);
const authorEmail = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const isPending = ref(false);
const show = ref(false);
async function addComment() {
  const variables = {
    commentOn: productId.value,
    author: authorEmail.value.split('@')[0],
    content: content.value,
    rating: rating.value,
    authorEmail: authorEmail.value,
  };
  try {
    isPending.value = true;
    await GqlWriteReview(variables);
    successMessage.value = 'Your review is awaiting approval';
    setTimeout(() => {
      successMessage.value = '';
      show.value = false;
    }, 4000);
  } catch (error) {
    errorMessage.value = error?.gqlErrors?.[0].message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isPending.value = false;
  }
}

function setHovered(i) {
  hovered.value = i;
}

function resetHovered() {
  hovered.value = 0;
}

const handleChangeShow = () => {
  if (!props.product) return;
  show.value = !show.value;
}
</script>

<template>
  <div class="container max-w-[1200px] mt-[10px]">
    <div class="mb-[10px] flex justify-between items-center">
      <div class="review_btn_list flex items-center">
        <div class="site_review_btn mr-[20px] active">Product Reviews</div>
        <div class="site_review_btn">Site Reviews</div>
      </div>
      <div class="review_btn_right w-[240px] h-[44px] flex items-center justify-center" @click="handleChangeShow">Write A Reviews</div>
    </div>
    <transition class="ease-in-out transform transition-all" name="scale-y">
      <form v-if="show" @submit.prevent="addComment" class="writeReview">
        <div class="new_title">Write A Review</div>
        <div class="w-full col-span-full mt-3">
          <label for="content" class="text-sm mb-0.5 text_label"><span class="text-red-500">*</span>Score</label>
          <div class="gap-1 flex mt-2 relative">
            <label
              v-for="i in 5"
              :key="i"
              class="grid w-[14px] h-[14px]"
              :class="rating < i && i > hovered ? 'disable-star' : 'checked-star'"
              @mouseover="setHovered(i)"
              @mouseout="resetHovered">
              <input type="radio" class="overflow-hidden appearance-none opacity-0 absolute" name="rating" :value="i" v-model="rating" required />
              <Icon name="ion:star" :size="size + ''" />
            </label>
          </div>
        </div>
        <div class="w-full mt-[10px]">
          <label for="content" class="text-sm mb-0.5 text_label"><span class="text-red-500">*</span>Title</label>
          <input class="w-full mt-[10px]" id="content" placeholder="Enter title" v-model="content" required />
        </div>
        <div class="w-full col-span-full mt-[10px]">
          <label for="content" class="text-sm mb-0.5 text_label"><span class="text-red-500">*</span>Review </label>
          <textarea class="w-full mt-[10px]" id="content" placeholder="Enter review" v-model="content" required></textarea>
        </div>
        <div class="w-full col-span-full">
          <label for="content" class="text-sm mb-0.5 text_label">Photo</label>
          <div class="flex gap-[10px] mt-[10px]">
            <div class="add_upload">+</div>
          </div>
        </div>
        <div class="w-full flex gap-[10px] mt-[10px]">
        <div class="flex-1">
            <label for="content" class="text-sm mb-0.5"><span class="text-red-500">*</span>Your name</label>
            <input class="w-full mt-[10px]" placeholder="Enter your name" type="email" v-model="authorEmail" required />
          </div>
          <div class="flex-1">
            <label for="author" class="text-sm mb-0.5"><span class="text-red-500">*</span>Your email</label>
            <input class="w-full mt-[10px]" id="author" placeholder="Enter your email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" v-model="authorEmail" required />
          </div>
        </div>
        <Transition name="scale-y" mode="out-in">
          <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
        </Transition>
        <Transition name="scale-y" mode="out-in">
          <div v-if="successMessage" class="my-4 text-sm text-green-500" v-html="successMessage"></div>
        </Transition>
        <div class="flex justify-end mt-[20px]">
          <button class="review_btn_right w-[240px] h-[44px] flex items-center justify-center" type="submit">
            <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
            <span>post</span>
          </button>
        </div>
      </form>
    </transition>
    <StarRating :rating="5" :count="1025"/>
    <div class="review_list mt-[30px] pb-[80px]">
      <div class="review_item flex items-start pb-[20px] mb-[20px]" v-for="(item, i) in 10" :key="i">
        <div class="review_user w-[48px] h-[48px] flex items-center justify-center">J</div>
        <div class="review_content mt-[5px] ml-[10px] flex-1">
          <div class="review_content_title flex items-center justify-between">
            <div>
              <span class="title_name mr-[10px]">Jill F.</span><span>Verified Buyer</span>
            </div>
            <div class="review_date">08/12/23</div>
          </div>
          <StarRating :rating="5" hideCount/>
          <div class="review_title mt-[5px]">Gorgeous</div>
          <div class="review_text mt-[5px]">Heirloom quality . This handsome piece can be used in multiple locations in my home. It's beautiful with nothing in it as it's interior is painted as well. Small, potted orchids in will be excellent too. I love it.</div>
          <div class="mt-[10px] flex flex-wrap align-center gap-[10px]">
            <div class="w-[120px] h-[120px]">
              <img class="w-full h-full object-contain" src="" alt="">
            </div>
            <div class="w-[120px] h-[120px]">
              <img class="w-full h-full object-contain" src="" alt="">
            </div>
          </div>
          <div class="review_desc mt-[20px]">On White Lacquer Hand Painted Mother of Pearl Chest of Drawers</div>
          <div class="flex items-center justify-between mt-[10px]">
            <div class="share_btn flex items-center gap-[5px]">
              <img class="w-[16px] h-[16px]" src="/icons/share.png" alt="">
              <span>Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          font-size: 14px;
          color: #167EFF;
        }
        .review_date {
          font-family: HarmonyOS Sans-Regular;
          font-weight: 400;
          font-size: 13px;
          color: #686868;
        }
      }
      .review_title {
        font-family: HarmonyOS Sans-Medium;
        font-weight: 500;
        font-size: 14px;
        color: #292929;
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
  font-size: 16px;
  color: #686868;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: transparent;
  }
  &.active {
    font-family: HarmonyOS Sans-Medium;
    font-weight: 500;
    font-size: 16px;
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
.review_btn_right {
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
</style>
