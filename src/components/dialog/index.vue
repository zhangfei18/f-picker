<template>
  <transition name="f-dialog-fade">
    <div class="f-dialog" v-if="dialogVisible">
      <div class="f-dialog-mask" @click="maskClick">
        <div class="f-dialog-main">
          <div class="f-dialog-content">{{text}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    text:{
        type: String,
        default: '我是内容'
    }
  },
  methods:{
      maskClick(){
          this.$emit('maskClose', false)
      }
  }
};
</script>

<style lang="less" scoped>
.f-dialog {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  .f-dialog-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .f-dialog-main {
      width: 80%;
      height: 40%;
      background-color: #ffffff;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      .f-dialog-content {
        width: 100%;
        height: 100%;
        display: flex;
      justify-content: center;
      align-items: center;
      }
    }
  }
}
.f-dialog-fade-enter-active {
  animation: dialog-fadein 0.4s;
  .f-dialog-main {
    animation: dialog-zoom 0.4s;
  }
}
@keyframes dialog-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes dialog-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>