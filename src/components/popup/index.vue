<template>
  <div class="f-popup">
      <div class="f-popup-mask"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.f-popup{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    pointer-events: none;
    .f-popup-mask{
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>