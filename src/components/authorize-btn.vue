<template>
  <div class="relative" @click="handleClick">
    <slot/>
    <button
      :open-type="authorizeStore.scopeAuthorize[openType]"
      class="open-type-btn"
      @error="$emit('error', $event)"
      @opensetting="handleOpensetting"
      v-if="authorizeStore.scopeAuthorize[openType]"
    >open type</button>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { authorizeStore } from '@/store'
  import { autoLoading } from '@/utils'

  @Component
  export default class AuthorizeBtn extends Vue {
    @Prop({ type: String }) openType
    @Prop({ type: Object, default: () => ({}) }) params
    @Prop({ type: Boolean | String, default: false }) autoLoading
    @Prop({ type: Boolean, default: true }) showErrorInfo
    @Prop({ type: Boolean, default: false }) autoCheckScope

    authorizeStore = authorizeStore

    created() {
      this.autoCheckScope && authorizeStore.checkScope(this.openType)
    }

    async handleOpensetting(e) {
      const scope = authorizeStore.getScope(this.openType);
      if (e.detail.authSetting[scope]) {
        const res = await this.autoLoadingUni();
        authorizeStore.updateScopeAuthorize(this.openType, false)
        this.$emit('success', res);
      }
    }

    async handleClick() {
      try {
        const res = await this.autoLoadingUni();
        this.$emit('success', res);
      } catch (e) {
        this.$emit('error', e);
        authorizeStore.checkList[this.openType] = false;
        authorizeStore.checkScope(this.openType);
      }
    }

    async autoLoadingUni() {
      if (!this.autoLoading) {
        return uni[this.openType](this.params);
      }
      if (this.showErrorInfo) {
        if (typeof this.autoLoading === 'boolean') {
          return autoLoading(uni[this.openType](this.params))
        } else {
          return autoLoading(uni[this.openType](this.params), this.autoLoading);
        }
      } else {
        const title = typeof this.autoLoading === 'boolean' ? '加载中...' : this.autoLoading;
        uni.showLoading({
          title, mask: true
        })
        return uni[this.openType](this.params)
          .finally(() => {
            try {
              uni.hideLoading()
            } catch (e) {
              // uni.hideLoading 有时候会报错
            }
          });
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
