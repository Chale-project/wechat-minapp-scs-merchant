// pages/mainClass/ShopBusinessDetail/ShopBusinessDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popshow: false,
    multiIndex: [0, 0, 0, 0, 0],
    multiArray: [],
    guigeInputArr: ['休业中', '24小时营业', '08:00至21:30营业', '自定义营业时间'],
    businesstitle: '',
    timePickershow: false,
    businessdata: '',
    chooseShopType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //获取列表
    this.getshopbusinessdata()
    //00-23
    var timeOneArr = []
    var timeTwoArr = []
    for (var i = 0; i < 3; i++) {
      if (i == 2) {
        for (var j = 0; j < 4; j++) {
          timeOneArr.push(i.toString() + j.toString())
        }
      } else {
        for (var j = 0; j < 10; j++) {
          timeOneArr.push(i.toString() + j.toString())
        }
      }
    }
    //00-59
    for (var a = 0; a < 6; a++) {
      for (var b = 0; b < 10; b++) {
        timeTwoArr.push(a.toString() + b.toString())
      }
    }
    var temparr = [timeOneArr, timeTwoArr, ["--"], timeOneArr, timeTwoArr]
    this.setData({
      multiArray: temparr
    })
  },


  getshopbusinessdata: function() {
    // var param = { "shopId": wx.getStorageSync("chooseshopid")}
    wx.showLoading({
      title: '加载中',
    })
    urlApi.getInfo(rootUrls.shopbusinessUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        console.log('list', res)
        //时间转化
        var businessState = this.shownewbusinessState(res.businessState)
        var deliveryState = this.shownewbusinessState(res.deliveryState)
        this.setData({
          businessdata: {
            'businessState': businessState,
            'deliveryState': deliveryState,
            'waitReceivingCount': res.waitReceivingCount,
            'waitSendingCount': res.waitSendingCount,
            'shopWaitReceivingCount': res.shopWaitReceivingCount,
            'shopWaitSendingCount': res.shopWaitSendingCount
          }
        })
      })
  },


  shownewbusinessState: function(curstate) {
    if (curstate == 'disabled') {
      return '休业中';
    } else if (curstate == 'enabled') {
      return '24小时营业';
    } else {
      var timehourarr = curstate.split(",")
      if (timehourarr[0] == '08:00' && timehourarr[1] == '21:30') {
        return '08:00至21:30营业'
      } else {
        return timehourarr[0] + '--' + timehourarr[1]
      }
    }
  },


  modifybusinessState: function(curstate) {
    if (curstate == '休业中') {
      return 'disabled';
    } else if (curstate == '24小时营业') {
      return 'enabled';
    } else if (curstate == '08:00至21:30营业') {
      return '08:00,21:30';
    } else {
      var timehourarr = curstate.split("--")
      return timehourarr[0] + ',' + timehourarr[1]
    }
  },


  modifyshopbusinessdata: function(businesstitle) {

    if (businesstitle == '休业中') {
      this.setData({
        popshow: false
      })
      //判断是否是店铺整体营业状态
      if (this.data.chooseShopType == 'businessState') {

        if (this.data.businessdata.waitReceivingCount > 0 && this.data.businessdata.waitSendingCount > 0) {
          this.choosestate('您还有[' + (this.data.businessdata.waitReceivingCount + this.data.businessdata.shopWaitReceivingCount) + ']个订单未取货,' + '有[' + (this.data.businessdata.waitSendingCount + this.data.businessdata.shopWaitSendingCount) + ']个订单未发货,是否转为休业状态', businesstitle)
          return;
        } else {

          if (this.data.businessdata.waitReceivingCount > 0) {
            this.choosestate('您还有[' + (this.data.businessdata.waitReceivingCount + this.data.businessdata.shopWaitReceivingCount)+ ']个订单未取货,是否转为休业状态', businesstitle)
            return;
          } else if (this.data.businessdata.waitSendingCount > 0) {
            this.choosestate('您还有[' + (this.data.businessdata.waitSendingCount + this.data.businessdata.shopWaitSendingCount) + ']个订单未发货,是否转为休业状态', businesstitle)
            return;
          }
        }

      } else {

        if (this.data.businessdata.waitReceivingCount > 0 && this.data.businessdata.waitSendingCount > 0) {
          this.choosestate('您还有[' + this.data.businessdata.waitReceivingCount + ']个订单未取货,' + '有[' + this.data.businessdata.waitSendingCount + ']个订单未发货,是否转为休业状态', businesstitle)
          return;
        } else {

          if (this.data.businessdata.waitReceivingCount > 0) {
            this.choosestate('您还有[' + this.data.businessdata.waitReceivingCount + ']个订单未取货,是否转为休业状态', businesstitle)
            return;
          } else if (this.data.businessdata.waitSendingCount > 0) {
            this.choosestate('您还有[' + this.data.businessdata.waitSendingCount + ']个订单未发货,是否转为休业状态', businesstitle)
            return;
          }
        }

      }
      
    }

    this.modifydata(businesstitle)

  },


  modifydata: function(businesstitle) {
    wx.showLoading({
      title: '修改中',
    })
    var para = {}
    if (this.data.chooseShopType == 'businessState') {
      para = {
        "shopId": wx.getStorageSync("chooseshopid"),
        'businessState': this.modifybusinessState(businesstitle),
        'deliveryState': this.modifybusinessState(this.data.businessdata.deliveryState)
      }
    } else {
      para = {
        "shopId": wx.getStorageSync("chooseshopid"),
        'businessState': this.modifybusinessState(this.data.businessdata.businessState),
        'deliveryState': this.modifybusinessState(businesstitle)
      }
    }
    console.log('save', para)
    urlApi.getInfo(rootUrls.shopModifyBusinessUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        var temdata = this.data.businessdata
        if (this.data.chooseShopType == 'businessState') {
          temdata.businessState = businesstitle
        } else {
          temdata.deliveryState = businesstitle
        }
        if (temdata.businessState == '休业中') {
          temdata.deliveryState = '休业中'
        }
        this.setData({
          businessdata: temdata
        })
        wx.showToast({
          icon: 'none',
          title: '修改成功',
        })
      })
  },



  choosestate: function(toast, businesstitle) {
    let that = this
    wx.showModal({
      title: '提示',
      content: toast,
      showCancel: true, //是否显示取消按钮
      cancelText: "否", //默认是“取消”
      cancelColor: '#000000', //取消文字的颜色
      confirmText: "是", //默认是“确定”
      confirmColor: '#ff4444', //确定文字的颜色
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          that.modifydata(businesstitle)
        }
      }
    })
  },


  popshowtap: function() {
    this.setData({
      chooseShopType: 'businessState',
      popshow: true
    })
  },


  popshowtaptwo: function() {
    //判断店铺营业状态是否是休业中，是休业中就不让修改外卖营业状态
    //点击的是店铺营业状态

    if (this.data.businessdata.businessState == '休业中') {
      wx.showToast({
        icon: 'none',
        title: '您当前店铺营业状态为休业中',
      })
    } else {
      this.setData({
        chooseShopType: 'deliveryState',
        popshow: true
      })
    }
  },


  onClose: function() {
    this.setData({
      popshow: false
    })
  },


  onClosetwo: function() {
    this.setData({
      timePickershow: false
    })

  },


  guigenumviewtap: function(e) {
    var idx = e.currentTarget.dataset.idx
    console.log(idx)
    var temtitle = ''
    if (idx < 3) {
      temtitle = this.data.guigeInputArr[idx]
      this.setData({
        popshow: false,
        timePickershow: false
      })
      //调用修改营业状态接口,判断是修改店铺整体的还是外卖的
      this.modifyshopbusinessdata(temtitle)
    } else {
      console.log("打开自定义时间")
      this.setData({
        popshow: false,
        timePickershow: true
      })
    }
  },



  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    var temparr = e.detail.value
    var one = this.data.multiArray[0][temparr[0]].toString()
    var two = this.data.multiArray[1][temparr[1]].toString()
    var three = this.data.multiArray[3][temparr[3]].toString()
    var four = this.data.multiArray[4][temparr[4]].toString()
    var five = one + ':' + two + '--' + three + ':' + four
    this.setData({
      multiIndex: e.detail.value
    })
    this.modifyshopbusinessdata(five)
    // var timehourarr = this.data.hourdata.split("--")
    //   var yingyetime = timehourarr[0] + ',' + timehourarr[1]营业时间传递

  },




})