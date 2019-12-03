<template>
  <div class="checkbox" @click="handleChange">
    <img v-show="value" src="@/static/icon-checked.png" class="icon" alt="">
    <div v-show="!value" class="icon default"></div>
  </div>
</template>

<script>
  import { Vue, Component, Emit, Model } from 'vue-property-decorator'

  @Component
  export default class CustomCheckbox extends Vue {
    @Model('input', { type: Boolean }) value

    @Emit('input')
    handleChange() {
      return !this.value;
    }
  }
</script>

<style lang="less" scoped>
  .checkbox {
    width: 32px;
    height: 32px;

    .icon {
      width: 100%;
      height: 100%;
      vertical-align: top;

      &.default {
        box-sizing: border-box;
        border-radius: 50%;
        border: 1PX solid #DAD9D4;
      }
    }
  }
</style>
