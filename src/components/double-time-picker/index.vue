<template>
  <transition name="fade">
    <div
      ref="pickerBox"
      class="double-time-picker-box"
      v-show="visible"
      @click="maskClick"
    >
      <transition name="jump">
        <div class="picker" ref="picker" v-show="visible">
          <div class="header" v-show="headerTxt">
            {{ headerTxt }}
            <span @click="closeClick">×</span>
          </div>
          <div class="content" :style="{ height: boxHeight + 'px' }">
            <div class="column">
              <div class="left-time">
                <list
                  @change="change1"
                  :column="listDate1"
                  :rowNumber="getRowNumber"
                  :boxHeight="boxHeight"
                  :itemHeight="itemHeight"
                  :defaultIndex="dIndex1"
                ></list>
                <div class="colon">:</div>
                <list
                  @change="change2"
                  :column="listDate2"
                  :rowNumber="getRowNumber"
                  :boxHeight="boxHeight"
                  :itemHeight="itemHeight"
                  :defaultIndex="dIndex2"
                ></list>
              </div>
              <div class="divi-line">一</div>
              <div class="right-time">
                <list
                  @change="change3"
                  :column="listDate3"
                  :rowNumber="getRowNumber"
                  :boxHeight="boxHeight"
                  :itemHeight="itemHeight"
                  :defaultIndex="dIndex3"
                ></list>
                <div class="colon">:</div>
                <list
                  @change="change4"
                  :column="listDate4"
                  :rowNumber="getRowNumber"
                  :boxHeight="boxHeight"
                  :itemHeight="itemHeight"
                  :defaultIndex="dIndex4"
                ></list>
              </div>
            </div>
            <div class="mask" :style="maskStyle"></div>
            <div class="view-line"></div>
          </div>
          <div class="footer" v-show="confirmTxt && cancelTxt">
            <div class="cancel" @click="cancelClick">{{ cancelTxt }}</div>
            <div class="confirm" @click="confirmClick">{{ confirmTxt }}</div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import list from "./list";
import { padZero } from "./util";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemHeight: {
      type: Number,
      default: 44,
    },
    rowNumber: {
      type: Number,
      default: 5,
    },
    confirmTxt: {
      type: String,
      default: "确定",
    },
    cancelTxt: {
      type: String,
      default: "取消",
    },
    headerTxt: {
      type: String,
      default: "",
    },
    // minDate: {
    //   type: Date,
    //   default: () => {
    //     return new Date(new Date().getFullYear() - 10, 0, 1);
    //   },
    // },
    // maxDate: {
    //   type: Date,
    //   default: () => {
    //     return new Date(new Date().getFullYear() + 10, 11, 31);
    //   },
    // },
    // curDate: {
    //   type: Date,
    //   default: () => {
    //     return new Date();
    //   },
    // },
    // pType: {
    //   type: String,
    //   default: "H-M",
    // },
  },
  data() {
    return {
      listDate1: [],
      listDate2: [],
      listDate3: [],
      listDate4: [],
      dIndex1: 0,
      dIndex2: 0,
      dIndex3: 0,
      dIndex4: 0,
      startTime: [0, 0],
      endTime: [0, 0],
    };
  },
  components: {
    list,
  },
  computed: {
    getRowNumber() {
      if (this.rowNumber < 3) {
        return 3;
      }
      return this.rowNumber % 2 === 0 ? this.rowNumber + 1 : this.rowNumber;
    },
    boxHeight() {
      let itemHeight = parseInt(this.itemHeight);
      itemHeight = itemHeight ? itemHeight : 44;
      return this.getRowNumber * itemHeight;
    },
    maskStyle() {
      let style = { backgroundSize: `100% ${this.itemHeight * 2}px` };
      if (this.getRowNumber === 3) {
        style = { backgroundSize: `100% 44px` };
      }
      return style;
    },
  },
  created() {
    this.initDate();
  },
  mounted() {
    // 防止picker上的click事件的事件冒泡
    this.$refs["picker"].addEventListener("click", this.stopPropa);
    // 将picker追加到body上
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    // 移除click事件的阻止事件冒泡的机制
    this.$refs["picker"].removeEventListener("click", this.stopPropa);
    // document.body.removeChild(this.$el);
  },
  methods: {
    //  初始化数据
    initDate() {
      for (let i = 0; i < 24; i++) {
        this.listDate1[i] = padZero(i, 2);
        this.listDate3[i] = padZero(i, 2);
      }
      for (let i = 0; i < 60; i++) {
        this.listDate2[i] = padZero(i, 2);
        this.listDate4[i] = padZero(i, 2);
      }
    },
    maskClick() {
      this.$emit("update:visible", false);
      this.$emit("closeClick");
    },
    change1(index) {
      console.log(index, "change1");
      this.startTime[0] = Number(index);
      this.comSTime();
    },
    change2(index) {
      console.log(index, "change2");
      this.startTime[1] = Number(index);
      this.comSTime();
    },
    change3(index) {
      console.log(index, "change3");
      this.endTime[0] = Number(index);
      this.comETime();
    },
    change4(index) {
      console.log(index, "change4");
      this.endTime[1] = Number(index);
      this.comETime();
    },
    // 起止时间改变
    comSTime() {
      console.log(this.startTime, this.endTime);
      if (this.startTime[0] > this.endTime[0]) {
        // 将截止时分调至开始时分
        this.dIndex3 = this.startTime[0];
        this.endTime[0] = this.startTime[0];
        this.dIndex4 = this.startTime[1];
        this.endTime[1] = this.startTime[1];
      }
      if (this.startTime[0] === this.endTime[0]) {
        if (this.startTime[1] > this.endTime[1]) {
          this.dIndex4 = this.startTime[1];
          this.endTime[1] = this.startTime[1];
        }
      }
    },
    // 截止时间改变
    comETime() {
      if (this.startTime[0] > this.endTime[0]) {
        this.dIndex1 = this.endTime[0];
        this.startTime[0] = this.endTime[0];
        this.dIndex2 = this.endTime[1];
        this.startTime[1] = this.endTime[1];
      }
      if (this.startTime[0] === this.endTime[0]) {
        if (this.startTime[1] > this.endTime[1]) {
          this.dIndex2 = this.endTime[1];
          this.startTime[1] = this.endTime[1];
        }
      }
    },
    closeClick() {
      // let arr = this.startTime.join(":") + "-" + this.endTime.join(":");
      this.$emit("update:visible", false);
      this.$emit("closeClick");
    },
    confirmClick() {
      let arr = this.startTime.join(":") + "-" + this.endTime.join(":");
      this.$emit("update:visible", false);
      this.$emit("confirmClick", arr);
    },
    cancelClick() {
      this.$emit("update:visible", false);
      this.$emit("cancelClick");
    },
    getSelTime() {
      let arr = this.startTime.join(":") + "-" + this.endTime.join(":");
      return arr;
    },
    stopPropa(e) {
      e.stopPropagation();
    },
  },
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.jump-enter-active,
.jump-leave-active {
  transition: transform 0.3s;
}
.jump-enter,
.jump-leave-to {
  transform: translate3d(0, 100px, 0);
}
.double-time-picker-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  .picker {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;

    user-select: none;
    -webkit-text-size-adjust: 100%; //文字适配
    -webkit-tap-highlight-color: transparent;
    .header {
      background-color: #ffffff;
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 50px;
      padding: 0 20px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      border-radius: 15px 15px 0 0;
      color: #333333;
      font-size: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      text-align: center;
      line-height: 50px;
      span {
        display: block;
        transform: scale(1.5);
        float: right;
      }
    }
    .content {
      background-color: #ffffff;
      box-sizing: border-box;
      position: relative;
      display: flex;
      // width: 100%;
      height: 220px;
      overflow: hidden;
      padding: 0 20px;

      .column {
        display: flex;
        flex: 1;
        overflow: hidden;
        font-size: 16px;
        text-align: center;
        .left-time {
          box-sizing: border-box;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          .colon {
            flex: 0.5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        }
        .divi-line {
          flex: 0.5;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .right-time {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          .colon {
            flex: 0.5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        }
      }
      // picker区域蒙版
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0.9),
            hsla(0, 0%, 100%, 0.4)
          ),
          linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
        background-repeat: no-repeat;
        background-position: top, bottom;
        backface-visibility: hidden;
        pointer-events: none;
        background-size: 100% 88px;
      }
      // 刻度线
      .view-line {
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 3;
        transform: translateY(-50%);
        width: 100%;
        height: 44px;
        pointer-events: none;
        &::after {
          box-sizing: border-box;
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          bottom: -50%;
          left: -50%;
          border: 1px solid #ebedf0;
          transform: scale(0.5);
          -webkit-transform: scale(0.5);
        }
      }
    }
    .footer {
      width: 100%;
      height: 48px;
      display: flex;
      .cancel {
        flex: 1;
        text-align: center;
        line-height: 48px;
        background-color: #f5f5f5;
        color: #494949;
      }
      .confirm {
        flex: 1;
        text-align: center;
        line-height: 48px;
        background-color: #6182f5;
        color: #ffffff;
      }
    }
  }
}
</style>