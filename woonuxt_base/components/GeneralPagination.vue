<!-- 通用分页 -->
<template>
  <div class="general_pagination_container">
    <div class="prev" @click="handlePrev" :class="current == 1 ? 'cursor-not-allowed' : 'cursor-pointer'">
      <img :src="current == 1 ? '/images/prev_disabled.png' : '/images/prev.png'" alt="" loading="lazy">
    </div>
    <div :class="current == item ? 'active' : ''" class="page" v-for="(item, index) in allPage" :key="index" @click="handClick(item)">{{ item }}</div>
    <div class="next" :class="current == allPage ? 'cursor-not-allowed' : 'cursor-pointer'" @click="handleNext">
      <img :src="current == allPage ? '/images/next_disabled.png' : '/images/next.png'" alt="" loading="lazy">
    </div>
  </div>
</template>

<script setup>
  const { total, current } = defineProps({
    total: { type: Number, default: 0 },
    current: { type: Number, default: 1 }
  })
  const allPage = ref(0)
  watch(() => total, (newVal) => {
    allPage.value = Math.ceil(newVal / 10)
  })
  onMounted(() => {
    allPage.value = Math.ceil(total / 10)
  })
  const emit = defineEmits(['pagination', 'update:current'])
  const handlePrev = () => {
    if(current == 1) {
      return
    } else {
      emit('update:current', current - 1)
      emit('pagination', current - 1)
    }
  }
  const handleNext = () => {
    if(current == allPage.value) {
      return
    } else {
      emit('update:current', current + 1)
      emit('pagination', current + 1)
    }
  }
  const handClick = (item) => {
    emit('update:current', item)
    emit('pagination', item)
  }
</script>

<style lang='postcss' scoped>
  .general_pagination_container {
    margin: 20px 0 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .prev, .next {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background: #F2F3F5;
    }
    .page {
      margin: 0 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background: #F2F3F5;
      font-family: HarmonyOS Sans-Regular;
      font-weight: 400;
      font-size: 13px;
      color: #686868;
      cursor: pointer;
      &.active {
        background: #7F1C1B;
        color: #FFFFFF;
      }
    }
  }
</style>
