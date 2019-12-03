<template>
  <view :style="[style]">
    <div class="fixed-footer" :style="[style, { background: bgColor }]">
      <div id="footer" class="content"><slot/></div>
    </div>
  </view>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { uiStore } from '@/store'

  @Component
  export default class ButtonFixedBottom extends Vue {
    @Prop({ type: String, default: '#fff' }) bgColor
    uiStore = uiStore
    contentHeight = 0

    created() {
      uiStore.tryFetchData();
    }

    mounted() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#footer').boundingClientRect(data => {
        this.contentHeight = data.height;
      }).exec();
    }

    get style() {
      return {
        height: `${this.contentHeight}px`,
        paddingBottom: uiStore.isIphoneX ? '32rpx' : 0,
      }
    }
  }
</script>

<style lang="less" scoped>
  .fixed-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
  }
</style>
