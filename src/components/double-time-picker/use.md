###使用：
`import dTimePicker from "....../double-time-picker/index";`
`<dTimePicker       
      :visible.sync="visible"        
      :itemHeight="itemHeight"       
      :confirmTxt="confirmTxt"
      :cancelTxt="cancelTxt"
      :headerTxt="headerTxt"
      @closeClick="closeClick"
      @confirmClick="confirmClick"
      @cancelClick="cancelClick"
    ></dTimePicker>`
    
###属性：
visible[Boolean]:控制显隐(注意用法【visible.sync】)
itemHeight[Number]：每一行的高度 默认44px
confirmTxt[String]：确认按钮的文字（确认按钮文字和取消按钮的文字都不传为不展示底部）
cancelTxt[String]：取消按钮的文字（确认按钮文字和取消按钮的文字都不传为不展示底部）
headerTxt[Sring]：头部中的文字（空字符串或不传即不显示头部）
###事件
closeClick：点击头部叉号（和点击蒙版关闭时）触发的事件
confirmClick：点击确认按钮触发的事件
cancelClick： 点击取消按钮触发的事件
###方法：
getSelTime: 直接获取选择的时间区间