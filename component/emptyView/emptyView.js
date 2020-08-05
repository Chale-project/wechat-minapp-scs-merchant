// component/emptyView/emptyView.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    emptycount: {
      type: Number,
      value: ''
    },
    salelistArr: {
      type: null,
      value: ''
    },
    picheight:{
      type: String,
      value:''
    },
    ischooseStore:{
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
