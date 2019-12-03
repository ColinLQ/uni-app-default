<template>
  <view class="component-action-sheet" @touchmove.stop="preventScroll">
  <view class="mask" v-if="value && mask" @click="handleClose" />
  <scroll-view scroll-y class="wrapper" :class="{ active: value }" :style="{ height, background: bgColor }">
    <view class="content" :style="{ paddingBottom }">
      <slot />
    </view>
  </scroll-view>
</view>

</template>

<script>
  import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator'
  import { uiStore } from '@/store';

  @Component
  export default class ActionSheet extends Vue {
    @Prop({ type: String, default: 'auto' }) height
    @Prop({ type: String, default: '#fff' }) bgColor
    @Prop({ type: Boolean, default: true }) mask
    @Model('input', { type: Boolean, default: false }) value

    uiStore = uiStore

    created() {
      uiStore.tryFetchData()
    }

    preventScroll() { /* 阻止滚动穿透 */ }

    @Emit('input')
    handleClose() {
      this.$emit('close', false);
      return false;
    }

    get paddingBottom() {
      return uiStore.isIphoneX ? '32rpx' : 0;
    }
  }
</script>

<style lang="less" scoped>
  .component-action-sheet {
    .mask {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .48);
      z-index: 990;
    }

    .wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: auto;
      max-height: 90vh;
      transform: translateY(100%);
      background: #fff;
      z-index: 999;
      transition: transform .3s;

      &.active {
        transform: translateY(0);
      }
    }

    .content {
      height: 100%;
    }
  }
</style>
