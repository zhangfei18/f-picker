<template>
  <div class="list">
    <ul :style="ulStyle" ref="ul">
      <li v-for="(item, index) in column" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getClient } from "./util.js";
const DEFAULT_DURATION = 200; //默认的过渡间隔时间
const LIMIT_TIME = 300; //惯性滑动最小的间隔时间
const LIMIT_DISTANCE = 15; //惯性滑动最小的间隔距离

export default {
  props: {
    column: {
      type: Array,
      default: () => [],
    },
    boxHeight: {
      type: Number,
      default: 0,
    },
    rowNumber: {
      type: Number,
      default: 5,
    },
    itemHeight: {
      type: Number,
      default: 44,
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      ulStyle: {
        transform: `translate3d(0px, 0px, 0px)`,
        transitionDuration: `0ms`,
        transitionProperty: `none`,
        lineHeight: `${this.itemHeight}px`,
      },
      toBottomThreshold: 0,
      toTopThreshold: 0,
      startTop: 0, //开始时的偏移距离
      selectIndex: this.defaultIndex, //用户选择项的下标
      startY: 0,
      touchStartTime: 0,
      columnTop: 0,
      disY: 0,
    };
  },
  computed: {
    count() {
      //数据条数
      return this.column.length;
    },
    getHalfRowNumber() {
      //用于计算初始化时的偏移距离
      return Math.floor(this.rowNumber / 2);
    },
  },

  watch: {
    // 监听列表数据的变化
    column() {
      this.init();
    },
    // 监听默认的index的变化
    defaultIndex() {
      this.setTop(this.defaultIndex);
    },
  },
  mounted() {
    this.init();
    //   绑定事件
    this.$el.addEventListener("touchstart", this.fingerStart, false);
    this.$el.addEventListener("touchmove", this.fingerMove, false);
    this.$el.addEventListener("touchend", this.fingerEnd, false);
  },
  methods: {
    init() {
      const halfBoxHeight = (this.boxHeight - this.itemHeight) / 2; //盒子的一半距离
      this.toBottomThreshold = halfBoxHeight + this.itemHeight; //手指向下滑的最大距离
      this.toTopThreshold = halfBoxHeight - this.count * this.itemHeight; //手指向上滑的最大距离
      this.setTop(this.defaultIndex);
    },
    fingerStart(e) {
      // 记录手指按下的各种信息
      this.startY = getClient(e).y;
      this.touchStartTime = Date.now();
      this.columnTop = this.startTop; //记录列表初始化的位置
      this.ulStyle.transitionDuration = "0ms";
      this.ulStyle.transitionProperty = "none";
    },
    fingerMove(e) {
      e.stopPropagation();
      e.preventDefault();
      this.disY = getClient(e).y - this.startY; //手指移动时实时距离差
      this.startY = getClient(e).y;
      if (this.startTop >= this.toBottomThreshold) {
        this.startTop = this.toBottomThreshold;
      } else if (this.startTop <= this.toTopThreshold) {
        this.startTop = this.toTopThreshold;
      } else {
        this.startTop += this.disY;
      }
      this.ulStyle.transform = `translate3d(0px, ${this.startTop}px, 0px)`;
      const now = Date.now();
      //   滑动事件超过启动惯性滑动的时间，因此重新记录惯性滑动的初始值
      if (now - this.touchStartTime > LIMIT_TIME) {
        this.touchStartTime = now;
        this.columnTop = this.startTop;
      }
    },
    fingerEnd(e) {
      const distance = this.startTop - this.columnTop; //记录用户快速滑动的距离
      const duration = Date.now() - this.touchStartTime;
      const allowSliding =
        duration < LIMIT_TIME && Math.abs(distance) > LIMIT_DISTANCE;
      if (allowSliding) {
        this.toMove(distance, duration);
      } else {
        this.setTranfromTop();
      }
    },
    // 惯性滑动
    toMove(distance, duration) {
      // console.log('move')
      const speed = Math.abs(distance / duration);
      distance = this.startTop + (speed / 0.002) * (distance > 0 ? 1 : -1);
      this.ulStyle.transitionDuration = "1000ms";
      this.ulStyle.transitionProperty = "all";
      const minIndex = Math.max(Math.round(-distance / this.itemHeight), 0); //最小坐标
      const maxIndex = Math.min(minIndex, this.count - 1);
      this.setTop(maxIndex, true);
    },
    // 普通滑动
    setTranfromTop() {
      this.ulStyle.transitionDuration = `${DEFAULT_DURATION}ms`;
      this.ulStyle.transitionProperty = `all`;
      // 边界值处理
      if (this.startTop >= this.toBottomThreshold - this.itemHeight) {
        this.setTop(0, true);
      } else if (this.startTop <= this.toTopThreshold + this.itemHeight) {
        this.setTop(this.count - 1, true);
      } else {
        // 处理让每一项正好落在正中间
        // 四舍五入之后就可以很好地处理正中间问题
        let index = Math.round(this.startTop / this.itemHeight);
        this.startTop = index * this.itemHeight;
        // 边界值处理
        if (this.startTop > this.toBottomThreshold) {
          this.startTop = this.toBottomThreshold - this.itemHeight;
          index = -this.getHalfRowNumber; //为了下面可以正确的求出此项在column的下标
        } else if (this.startTop < this.toTopThreshold) {
          this.startTop = this.toTopThreshold + this.itemHeight;
          index = this.count + 1; //为了下面可以正确的求出此项在column的下标
        }
        // 更新视图
        this.ulStyle.transform = `translate3d(0px, ${this.startTop}px, 0px)`;
        index = this.getHalfRowNumber - index; //求出此项在column中正确的下标
        this.liScale(index);
        if (this.selectIndex !== index) {
          this.selectIndex = index;
          this.change();
        }
      }
    },
    // 根据index设置偏移的头部
    setTop(index = 0, isManual = false) {
      const { boxHeight, itemHeight } = this;
      // index = 0 时的偏移距离
      const firstTop = (boxHeight - itemHeight) / 2;
      this.startTop = firstTop - index * itemHeight;
      this.ulStyle.transform = `translate3d(0px, ${this.startTop}px, 0px)`;
      this.selectIndex = index;
      if (isManual) {
        this.change(index);
      }
      this.liScale(index);
    },
    liScale(index) {
      for (let i = 0; i < this.$refs["ul"].children.length; i++) {
        if (i !== index) {
          this.$refs["ul"].children[i].classList.remove("bool");
        } else {
          this.$refs["ul"].children[i].classList.add("bool");
        }
      }
    },
    // 用户选择，向外传递消息
    change(index) {
      // console.log(this.column,this.selectIndex,this.column[this.selectIndex],'list-change')
      this.$emit("change", this.column[this.selectIndex]);
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  flex: 2;
  overflow: hidden;
  ul {
    margin: 0;
    padding: 0;
    transition-timing-function: cubic-bezier(0.23, 1, 0.68, 1);
    line-height: 44px;
    li {
      font-family: PingFangSC;
      margin: 0;
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 5px;
      color: #b3b3b3;
      font-size: 13px;
      transition: all 0.3s;
      &.bool {
        font-size: 16px;
       
        color: #333333;
      }
    }
  }
}
</style>