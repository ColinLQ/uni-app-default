<template>
  <div class="relative" @click="handleClick">
    <slot/>
    <button
      :open-type="staticOpenType"
      class="open-type-btn"
      @error="$emit('error', $event)"
      @opensetting="handleOpensetting"
      v-if="staticOpenType"
    >open type</button>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator'

  // scope 对照表
  const scopeList = {
    getLocation: 'scope.userLocation',
    chooseLocation: 'scope.userLocation',
    startLocationBackground: 'scope.userLocationBackground',
    chooseAddress: 'scope.address',
    chooseInvoiceTitle: 'scope.invoiceTitle',
    chooseInvoice: 'scope.invoice',
    getWeRunData: 'scope.werun',
    startRecord: 'scope.record',
    saveVideoToPhotosAlbum: 'scope.writePhotosAlbum',
    saveImageToPhotosAlbum: 'scope.writePhotosAlbum',
  }

  @Component
  export default class AuthorizeBtn extends Vue {
    @Prop({ type: String }) openType
    @Prop({ type: Object, default: () => ({}) }) params

    staticOpenType = null;

    created() {
      this.checkScope()
    }

    // 检查是否打开对应权限
    async checkScope() {
      const scope = scopeList[this.openType];
      if (scope) {
        try {
          await uni.authorize({
            scope: scope
          });
        } catch (e) {
          this.staticOpenType = 'openSetting';
        }
      }
    }

    async handleOpensetting(e) {
      const scope = scopeList[this.openType];
      if (e.detail.authSetting[scope]) {
        const res = await uni[this.openType](this.params);
        this.staticOpenType = null;
        this.$emit('success', res);
      }
    }

    async handleClick() {
      try {
        const res = await uni[this.openType](this.params);
        this.$emit('success', res);
      } catch (e) {
        this.checkScope();
      }
    }
  }
</script>

<style lang="less" scoped>
  .open-type-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
