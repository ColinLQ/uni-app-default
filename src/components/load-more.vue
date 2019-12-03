<template>
  <div class="component-load-more" v-if="status">
    <img
      src="@/static/icon-loading.svg"
      class="icon-loading"
      v-if="showIcon && status === 'loading'"
    />
    <text>{{ text }}</text>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator'

  @Component
  export default class LoadMore extends Vue {
    @Prop({ type: String, default: 'more' }) status // more（loading前）、loading（loading中）、noMore（没有更多了）、empty（没有数据）
    @Prop({ type: Boolean, default: true }) showIcon
    @Prop({ type: Object, default: () => ({}) }) contentText

    defaultText = {
      more: '上拉显示更多',
      loading: '正在加载...',
      noMore: '没有更多数据了',
      empty: '暂无数据',
    }

    get text() {
      return { ...this.defaultText, ...this.contentText }[this.status];
    }
  }
</script>

<style lang="less" scoped>
  .component-load-more {
    padding: 50px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #777;

    @keyframes rotate {
      from { transform: rotate(0); }
      to { transform: rotate(360deg) }
    }

    .icon-loading {
      width: 36px;
      height: 36px;
      margin-right: 10px;
      animation: rotate 2s linear infinite;
    }
  }
</style>
