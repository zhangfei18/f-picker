# self-vue-picker2

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

<!-- picker使用说明 -->

##传递的参数：
visiblePicker:[Boolean] 控制 picker 展示
pickData: [Array] picker 要展示的数据，（注意一定要是二维数组的形式，因为会涉及多列 picker）
showHeadBar:[Boolean] 是否展示头部 header
defaultIndex:[Number] 默认选中项的下标
title: [String] 标题文案
cancelTxt: [String] 取消按钮文案
confirmTxt: [String] 确定按钮文案
headerTxtColor: [String] 头部按钮文案内文字的颜色

##事件
change:[Function] 用户选择了
confirm:[Function] 用户点击了确认
cancel:[Function] 用户点击了取消
