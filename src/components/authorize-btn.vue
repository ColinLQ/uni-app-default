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

  @Component
  export default class AuthorizeBtn extends Vue {
    @Prop({ type: String }) openType
    @Prop({ type: Object, default: () => ({}) }) params

    authorizeStore = authorizeStore

    created() {
      authorizeStore.checkScope(this.openType)
    }

    async handleOpensetting(e) {
      const scope = authorizeStore.getScope(this.openType);
      if (e.detail.authSetting[scope]) {
        const res = await uni[this.openType](this.params);
        authorizeStore.updateScopeAuthorize(this.openType, false)
        this.$emit('success', res);
      }
    }

    async handleClick() {
      try {
        const res = await uni[this.openType](this.params);
        this.$emit('success', res);
      } catch (e) {
        authorizeStore.checkList[this.openType] = false;
        authorizeStore.checkScope(this.openType);
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
