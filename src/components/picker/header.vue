<template>
  <div class="picker-header" >
    <slot name="header">
      <div class="left" >
        <span class="btn" @click="cancel" :style="headerStyle">{{ cancelTxt }}</span>
      </div>
      <span class="title">{{ title }}</span>
      <div class="right" >
        <span class="btn" @click="confirm" :style="headerStyle">{{ confirmTxt }}</span>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "我是标题"
    },
    confirmTxt: {
      type: String
    },
    cancelTxt: {
      type: String
    },
    headerTxtColor: {
      type: String
    }
  },
  computed: {
    headerStyle() {
      return {
        color: `${this.headerTxtColor}`
      };
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="less" scoped>
.picker-header {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  height: 44px;
  position: relative;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    border: 0 solid #ebedf0;
    transform: scale(.5);
    border-width: 1px 0;
  }

  .left {
  }
  .title {
    max-width: 50%;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000000;
  }
  .btn {
    padding: 0 16px;
    color: #1989fa;
    font-size: 14px;
    background-color: transparent;
    display: inline-block;
  }
  .right {
  }
}
</style>