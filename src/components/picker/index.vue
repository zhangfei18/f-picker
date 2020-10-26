<template>
  <transition name="fade">
    <div class="picker-box" v-show="visible" @click="clickMask">
      <transition name="jump">
        <div class="picker" ref="picker" v-show="visible">
          <!-- 头部区域 -->
          <slot name="header">
            <Header
              v-show="showHeadBar"
              :title="title"
              :cancelTxt="cancelTxt"
              :confirmTxt="confirmTxt"
              :headerTxtColor="headerTxtColor"
              @confirm="confirm"
              @cancel="cancel"
            >
            </Header>
          </slot>
          <!-- 主选择区域 -->
          <div class="content" :style="{ height: boxHeight + 'px' }">
            <!--  -->
            <div class="column">
              <List
                v-if="column1.length > 0"
                :column="column1"
                :boxHeight="boxHeight"
                :rowNumber="getRowNumber"
                :itemHeight="itemHeight"
                :defaultIndex="dIndex1"
                :alias="alias"
                @change="change1"
              />
              <List
                v-if="column2.length > 0"
                :column="column2"
                :boxHeight="boxHeight"
                :rowNumber="getRowNumber"
                :itemHeight="itemHeight"
                :defaultIndex="dIndex2"
                :alias="alias"
                @change="change2"
              />
              <List
                v-if="column3.length > 0"
                :column="column3"
                :boxHeight="boxHeight"
                :rowNumber="getRowNumber"
                :itemHeight="itemHeight"
                :defaultIndex="dIndex3"
                :alias="alias"
                @change="change3"
              />
              <List
                v-if="column4.length > 0"
                :column="column4"
                :boxHeight="boxHeight"
                :rowNumber="getRowNumber"
                :itemHeight="itemHeight"
                :defaultIndex="dIndex4"
                :alias="alias"
                @change="change4"
              />
              <List
                v-if="column5.length > 0"
                :column="column5"
                :boxHeight="boxHeight"
                :rowNumber="getRowNumber"
                :itemHeight="itemHeight"
                :defaultIndex="dIndex5"
                :alias="alias"
                @change="change5"
              />
            </div>
            <!-- 蒙版 -->
            <div class="mask" :style="maskStyle"></div>
            <!-- 已选择项的分界线 -->
            <div class="view-line"></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
// 头部组件
import Header from "./header.vue";
// list组件
import List from "./list.vue";
import { DEFAULT_ITEM_HEIGHT, padZero, getMounthEndDay } from "./utils.js";
export default {
  props: {
    //   控制picker的显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 数据
    pickData: {
      type: Array,
      default: () => []
    },
    layer: {
      type: [Number, String],
      default: 0
    },
    // 每一项的头部
    itemHeight: {
      type: [Number, String],
      default: DEFAULT_ITEM_HEIGHT
    },
    // 默认展示项的下标
    defaultIndex: {
      type: [Number, Array],
      default: 0
    },
    // 头部取消展示的文案
    cancelText: {
      type: String,
      default: "取消"
    },
    // 头部确认展示的文案
    confirmText: {
      type: String,
      default: "确认"
    },
    // 头部的标题
    title: {
      type: String,
      default: ""
    },
    confirmTxt: {
      type: String,
      default: "确认"
    },
    cancelTxt: {
      type: String,
      default: "取消"
    },
    headerTxtColor: {
      type: String,
      default: "#4063d5"
    },
    // 是否展示头部
    showHeadBar: {
      type: Boolean,
      default: false
    },
    // 点击遮罩层是否关闭picker
    maskClick: {
      type: Boolean,
      default: false
    },
    // 视区内展示的行数
    rowNumber: {
      type: Number,
      default: 5
    },
    alias: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 是否追加到body内
    appendToBody: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "all-picker"
    },
    minDate: {
      type: Date,
      default: () => {
        return new Date(new Date().getFullYear() - 10, 0, 1);
      }
    },
    maxDate: {
      type: Date,
      default: () => {
        return new Date(new Date().getFullYear() + 10, 11, 31);
      }
    },
    curDate: {
      type: Date,
      default: () => {
        return new Date();
      }
    }
  },
  data() {
    return {
      column1: [],
      column2: [],
      column3: [],
      column4: [],
      column5: [],
      dIndex1: 0,
      dIndex2: 0,
      dIndex3: 0,
      dIndex4: 0,
      dIndex5: 0,
      result: [],
      indexArr: [],
      innerValue: ""
      // innerDateArr: [
      //   padZero(this.minDate.getFullYear(), 2),
      //   padZero(this.minDate.getMonth() + 1, 2),
      //   padZero(this.minDate.getDate(), 2),
      //   padZero(this.minDate.getHours(), 2),
      //   padZero(this.minDate.getMinutes(), 2)
      // ]
    };
  },
  components: {
    Header,
    List
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
      itemHeight = itemHeight ? itemHeight : DEFAULT_ITEM_HEIGHT;
      return this.getRowNumber * itemHeight;
    },
    maskStyle() {
      let style = { backgroundSize: `100% ${this.itemHeight * 2}px` };
      if (this.getRowNumber === 3) {
        style = { backgroundSize: "100% 44px" };
      }
      return style;
    }
  },
  watch: {
    pickData() {
      this.init();
    },
    defaultIndex() {
      this.init();
    },
    type(newVal) {
      this.type = newVal;
      this.resolveDate();
    }
  },
  created() {
    Date.prototype._clone = function _clone() {
      return new Date(this.valueOf());
    };
    if (
      this.type === "all-picker" ||
      this.type === "date-picker" ||
      this.type === "time-picker"
    ) {
      // 初始化 innerValue
      this.innerValue = this.curDate._clone();
      this.resolveDate();
      return;
    }
    this.init();
  },
  mounted() {
    this.$refs.picker.addEventListener(
      "click",
      e => {
        e.stopPropagation();
      },
      false
    );
    if (this.appendToBody) {
      document.body.appendChild(this.$el); //插入到body中
    }
  },
  methods: {
    init() {
      console.log("init");
      this.result = [];
      this.indexArr = [
        () => (this.dIndex1 = this.defaultIndex[0] || 0),
        () => (this.dIndex2 = this.defaultIndex[1] || 0),
        () => (this.dIndex3 = this.defaultIndex[2] || 0),
        () => (this.dIndex4 = this.defaultIndex[3] || 0)
      ];
      this.formateData();
    },
    // 当前日期的边界值
    ranges() {
      // 监视innerValue,只要innerValue更新就会重新求一次边界值
      let { minYear, minMonth, minDate, minHour, minMinute } = this.getBoundary(
        "min",
        this.innerValue
      );
      let { maxYear, maxMonth, maxDate, maxHour, maxMinute } = this.getBoundary(
        "max",
        this.innerValue
      );

      let result = [
        {
          type: "year",
          range: [minYear, maxYear]
        },
        {
          type: "month",
          range: [minMonth, maxMonth]
        },
        {
          type: "day",
          range: [minDate, maxDate]
        },
        {
          type: "hour",
          range: [minHour, maxHour]
        },
        {
          type: "minute",
          range: [minMinute, maxMinute]
        }
      ];

      if (this.type === "date-picker") {
        result.splice(3, 2);
      }
      if (this.type === "time-picker") {
        result.splice(0, 3);
      }
      return result;
    },
    // 时间picker处理
    resolveDate() {
      this.$nextTick(() => {
        let result = this.ranges(); //获取到边界值
        this.clearColumn();

        result.forEach((item, index) => {
          let { type, range } = item;
          for (let i = range[0] - 1; i < range[1]; i++) {
            this[`column${index + 1}`].push({ label: padZero(range[0]++, 2) });
          }
        });

        this.comActiveIndex();
      });
      // 计算默认选中值
    },
    clearColumn() {
      for (let index = 0; index < 5; index++) {
        this[`column${index + 1}`] = [];
      }
    },
    //实时调取的方法： 计算默认的index, 默认是curDate
    comActiveIndex() {
      let result = []; //存放激活项的值
      this.result = []; //存放用户选择的结果
      // console.log(this.innerValue, "innerValue---");
      result.push(padZero(this.innerValue.getFullYear(), 2));
      this.result.push(padZero(this.innerValue.getFullYear(), 2));
      result.push(padZero(this.innerValue.getMonth() + 1, 2));
      this.result.push(padZero(this.innerValue.getMonth() + 1, 2));
      result.push(padZero(this.innerValue.getDate(), 2));
      this.result.push(padZero(this.innerValue.getDate(), 2));
      result.push(padZero(this.innerValue.getHours(), 2));
      this.result.push(padZero(this.innerValue.getHours(), 2));
      result.push(padZero(this.innerValue.getMinutes(), 2));
      this.result.push(padZero(this.innerValue.getMinutes(), 2));
      // this.$nextTick(() => {
      if (this.type === "date-picker") result.splice(3, 2);
      if (this.type === "time-picker") result.splice(0, 3);
      result.forEach((item1, index1) => {
        let index = this[`column${index1 + 1}`].findIndex((item2, index2) => {
          return item2.label == item1;
        });
        index = index < 0 ? 0 : index;
        this[`dIndex${index1 + 1}`] = index;
      });
      // });
    },
    // 求出最大/最小值
    getBoundary(type, value) {
      const boundary = this[`${type}Date`]; //边界值
      const year = boundary.getFullYear(); //边界值得年份
      let mounth = 1;
      let date = 1;
      let hour = 0;
      let minutes = 0;
      if (type === "max") {
        mounth = 12;
        date = getMounthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minutes = 59;
      }
      // 说明求得是用户输入的边界值
      if (year === value.getFullYear()) {
        // 如果value的年份和边界值的年份相同，那么value的mounth只能和边界值的mounth为边界，以此类推...
        mounth = boundary.getMonth() + 1;
        console.log(mounth, "mounth");
        if (mounth === value.getMonth() + 1) {
          date = boundary.getDate();
          if (date === value.getDate()) {
            hour = boundary.getMinutes();
            if (hour === value.getHours()) {
              minutes = boundary.getMinutes();
            }
          }
        }
      }
      let res = {
        [`${type}Year`]: year,
        [`${type}Month`]: mounth,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minutes
      };
      return res;
    },

    // 求出年月日
    getTimeArr(time) {
      let arr = [];
      arr.push(time.getFullYear());
      arr.push(time.getMonth());
      arr.push(time.getDate());
      arr.push(time.getHours());
      arr.push(time.getMinutes());
      return arr;
    },
    // 格式化column中的数据
    formateData() {
      // 联动
      if (this.layer > 1) {
        this.setLinkColumn();
      } else {
        //普通选择
        this.column1 = this.pickData[0] || [];
        this.column2 = this.pickData[1] || [];
        this.column3 = this.pickData[2] || [];
        this.column4 = this.pickData[3] || [];
        this.setNormalIndex();
      }
    },
    // 设置index
    setNormalIndex() {
      let { defaultIndex } = this;
      if (Array.isArray(defaultIndex)) {
        this.setDefaultIndex();
      } else {
        this.dIndex1 = Number(defaultIndex);
      }
    },
    // 用来处理defaultIndex是个数组的情况
    setDefaultIndex() {
      let index = 0;
      let { indexArr } = this;
      while (index < this.pickData.length) {
        indexArr[index]();
        index++;
      }
    },
    // 设置多列联动的方法
    setLinkColumn() {
      if (this.layer == 2) {
        this.setLinkLayer2();
        return;
      }
      if (this.layer == 3) {
        this.setLinkLayer2();
        this.setLinkLayer3();
        return;
      }
      if (this.layer == 4) {
        this.setLinkLayer2();
        this.setLinkLayer3();
        this.setLinkLayer4();
        return;
      }
    },
    setLinkLayer2() {
      const { defaultIndex } = this;

      this.column1 = this.pickData || [];
      if (typeof defaultIndex === "number") {
        this.dIndex1 = defaultIndex;
        this.dIndex2 = 0;
        if (this.column1.length > 1 && this.column1[0].children) {
          this.column2 = this.column1[0].children || [];
        }
      } else if (Array.isArray(defaultIndex)) {
        this.dIndex1 = defaultIndex[0] || 0;
        this.column2 = this.column1[this.dIndex1].children || [];
        // this.$nextTick(() => {
        // 设置dINndex
        if (this.column2.length - 1 < defaultIndex[1]) {
          this.dIndex2 = this.column2.length - 1;
        } else {
          this.dIndex2 = defaultIndex[1] || 0;
          console.log("这里2", defaultIndex[1]);
        }
        // });
      }
      console.log(this.dIndex1, this.dIndex2, "setLinkLayer中的dIndex1+2");
    },
    setLinkLayer3() {
      const { defaultIndex } = this;

      if (typeof defaultIndex == "number") {
        this.dIndex3 = 0;
        if (this.column2.length > 1 && this.column2[0].children) {
          this.column3 = this.column2[0].children || [];
        }
      } else if (Array.isArray(defaultIndex)) {
        // this.$nextTick(() => {
        this.column3 = this.column2[this.dIndex2].children || [];
        //   this.$nextTick(() => {
        if (this.column3.length - 1 < defaultIndex[2]) {
          this.dIndex3 = this.column3.length - 1;
        } else {
          this.dIndex3 = defaultIndex[2] || 0;
        }
        //   });
        // });
      }
      console.log(this.dIndex3, "setLinkLayer中的dIndex3");
    },
    setLinkLayer4() {
      const { defaultIndex } = this;

      if (typeof defaultIndex == "number") {
        this.dIndex4 = 0;
        if (this.column3.length > 1 && this.column3[0].children) {
          this.column4 = this.column3[0].children || [];
        }
      } else if (Array.isArray(defaultIndex)) {
        this.$nextTick(() => {
          this.column4 = this.column3[this.dIndex3].children || [];
          this.$nextTick(() => {
            if (this.column4.length - 1 < defaultIndex[3]) {
              this.dIndex4 = this.column4.length - 1;
            } else {
              this.dIndex4 = defaultIndex[3] || 0;
            }
          });
        });
      }
    },
    change1(val) {
      console.log("change1", val);
      if (val) {
        if (this.type == "all-picker" || this.type == "date-picker") {
          this.value = this.innerValue._clone();
          this.value.setYear(Number(val.label));
          if (this.value.valueOf() !== this.innerValue.valueOf()) {
            this.innerValue = this.value;
            this.setColumnValue(0);
            this.change(0, val.label);
          }
          return;
        }
        if (this.type === "time-picker") {
          this.change(3, val.label);
          return;
        }
        this.change(0, val);
        // 联动调用
        if (this.layer > 1) {
          this.dIndex2 = 0; //让column2List组件watch生效，进而更新后面的List列中的数据
          this.changLink("column2", val);
        }
      }
    },
    change2(val) {
      console.log("change2", val);
      if (val) {
        if (this.type == "all-picker" || this.type == "date-picker") {
          this.value = this.innerValue._clone();
          this.value.setMonth(Number(val.label) - 1);
          if (this.value.valueOf() !== this.innerValue.valueOf()) {
            this.innerValue = this.value;
            this.setColumnValue(1);
            this.change(1, val.label);
          }
          return;
        }
        if (this.type === "time-picker") {
          this.change(4, val.label);
          return;
        }
        this.change(1, val);
        if (this.layer > 2) {
          this.dIndex3 = 0; //让column3List组件watch生效，进而更新后面的List列中的数据
          this.changLink("column3", val);
        }
      }
    },
    change3(val) {
      console.log("change3", val);

      if (val) {
        // 时间拾取器
        if (this.type == "all-picker" || this.type == "date-picker") {
          this.value = this.innerValue._clone();
          this.value.setDate(Number(val.label));
          this.innerValue = this.value;
          this.change(2, val.label);
          return;
        }
        this.change(2, val);
        if (this.layer > 3) {
          this.dIndex4 = 0; //让column4List组件watch生效，进而更新后面的List列中的数据
          this.changLink("column4", val);
        }
      }
    },
    change4(val) {
      console.log("change4", val);
      if (val) {
        // 时间拾取器
        if (this.type == "all-picker" || this.type == "date-picker") {
          this.value = this.innerValue._clone();
          this.value.setHours(Number(val.label));
          this.innerValue = this.value;
          this.change(3, val.label);
          return;
        }
        this.change(3, val);
      }
    },
    // 普通选择器最多只有四列，时间选择器最多有五列
    change5(val) {
      console.log("change5", val);
      if (val) {
        // 时间拾取器
        if (this.type == "all-picker" || this.type == "date-picker") {
          this.value = this.innerValue._clone();
          this.value.setMinutes(Number(val.label));
          this.innerValue = this.value;
          this.change(4, val.label);
          return;
        }
        this.change(4, val);
      }
    },
    change(index, res) {
      // this.result为存储结果的用户选择结果的数组
      this.result[index] = res;
      this.$emit("change", this.result);
    },
    // 联动时修改数据
    changLink(key, res) {
      if (this.layer) {
        let linkTimer = setTimeout(() => {
          this[key] = res.children || [];
        }, 1000 / 60);
      }
    },
    confirm(res) {
      let result = this.result.slice(0); //长度是5
      if (this.type === "date-picker") {
        this.$emit("confirm", result.splice(3, 2));
      } else if (this.type === "time-picker") {
        this.$emit("confirm", result.splice(0, 3));
      } else {
        this.$emit("confirm", result);
      }
      // this.$emit("update:visible", false);
      // return res.result;
    },
    cancel(res) {
      // this.$emit("cancel", this.result);
      this.$emit("update:visible", false);
    },
    clickMask() {
      console.log("mask");
      if (this.maskClick) {
        this.looseBody();
        this.$emit("update:visible", false);
      }
    },
    // 供外部调用的可获取’已选值‘
    getSelVal() {
      // this.$nextTick(() => {
      let result = this.result.slice(0); //长度是5
        if (this.type === "date-picker") {
          return result.slice(0, 3);
        } else if (this.type === "time-picker") {
          return result.splice(3);
        } else {
          return this.result;
        }
      // });
    },
    //  设置每列的数据
    setColumnValue(start) {
      let result = this.ranges();
      result = result.slice(start, 3);
      result.forEach((item, index) => {
        start += 1;
        let { type, range } = item;
        let len = range[1] - range[0];
        this[`column${start}`] = [];
        for (let i = 0; i <= len; i++) {
          this[`column${start}`].push({
            label: start > 1 ? padZero(range[0] + i, 2) : range[0] + i
          });
        }
      });
      // 重新计算激活项的index-即dIndex;
      this.comActiveIndex();
    },
    fixedBody() {},
    looseBody() {}
  }
};
</script>

<style lang="less">
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
.picker-box {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;

  .picker {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    user-select: none;
    -webkit-text-size-adjust: 100%; //文字适配
    -webkit-tap-highlight-color: transparent;
    .header {
      width: 100%;
      height: 66px;
      background-color: #f90;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 50px;
        height: 30px;
        background-color: #ffffff;
        border-radius: 5px;
        color: #000;
      }
      .right {
        width: 50px;
        height: 30px;
        background-color: #ffffff;
        border-radius: 5px;
        color: #000;
      }
    }
    .content {
      overflow: hidden;
      height: 220px;
      position: relative;
      display: flex;
      .column {
        display: flex;
        overflow: hidden;
        flex: 1;
        font-size: 16px;
        text-align: center;
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
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
      .view-line {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 3;
        transform: translateY(-50%);
        pointer-events: none;
        width: 100%;
        height: 44px;
        &::after {
          content: "";
          position: absolute;
          box-sizing: border-box;
          pointer-events: none;
          top: -50%;
          right: -50%;
          bottom: -50%;
          left: -50%;
          border: 0 solid #ebedf0;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          border-width: 1px 0;
        }
      }
    }
  }
}
</style>