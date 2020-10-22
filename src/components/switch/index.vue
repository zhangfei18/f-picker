<template>
  <div class="f-switch">
    <input
      class="f-switch-input"
      type="checkbox"
      v-model="checkboxValue"
      :style="
        `--switch-width:${switchW + 'px'}; --switch-height:${switchH +
          'px'}; --bg-color:${bgColor}`
      "
    />
    <i
      class="f-switch-ui"
      :style="
        `--switch-width:${switchW + 'px'}; --switch-height:${switchH +
          'px'}; --bg-color:${bgColor}`
      "
    ></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkboxValue: this.value
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    switchW: {
      type: Number,
      default: 48
    },
    switchH: {
      type: Number,
      default: 28
    },
    bgColor: {
      type: String,
      default: "#fc9153"
    }
  },
  watch: {
    value(newVal) {
        console.log('value:',newVal)
      this.checkboxValue = newVal;
    },
    checkboxValue(newVal) {
      this.$emit("input", newVal);
    }
  }
};
</script>

<style lang="less" scoped>
.f-switch {
  position: relative;
  display: flex;
  align-items: center;
  .f-switch-input {
    position: absolute;
    z-index: 1;
    width: var(--switch-width);
    height: var(--switch-height);
    opacity: 0;
    &:checked + .f-switch-ui {
        --x:calc(var(--switch-width) - var(--switch-height));
      border-color: var(--bg-color);
      background-color: var(--bg-color);
      &::before {
        transform: scale(0);
      }
      &::after {
        transform: translateX(var(--x));
      }
    }
  }
  .f-switch-ui {
    position: relative;
    display: block;
    width: var(--switch-width);
    height: var(--switch-height);
    box-sizing: content-box;
    border: 1px solid #e4e4e4;
    background-color: #e4e4e4;
    border-radius: 28px;
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--switch-height);
      background-color: #ffffff;
      transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.28);
    }
    &::after {
      width: var(--switch-height);
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>