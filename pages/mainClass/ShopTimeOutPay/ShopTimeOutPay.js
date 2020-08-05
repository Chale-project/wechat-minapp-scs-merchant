// pages/mainClass/ShopTimeOutPay/ShopTimeOutPay.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placenamearr:[],
    toastshow:"",
    curtitle:"",
    chooselvalue:"",
    shopinfodetail:{},
    currentchooseidx:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temshopinfodetail = wx.getStorageSync('shopinfodetail')
    var temcurrentchooseidx = 0
    this.data.curtitle = options.placename
    wx.setNavigationBarTitle({
      title: options.placename
    })
    var tempname = []
    var temvaluearr = []
    var tempshowtitle = ""
    if (options.placename =="支付超时时间"){
      tempname = ["30分钟","60分钟","24小时"]
      let tempnametwo = ["30","60","1440"]
      temvaluearr = [30, 60, 24 * 60]
      tempshowtitle = '提示'+'：'+'支付超时时间设置是指买家下单后'+'，'+'超过指定支付时间'+ '，'+'则该订单自动取消'
      if (temshopinfodetail.cancelTime > 0) {
        for (let i = 0; i < tempnametwo.length; i++) {
          if (tempnametwo[i] == temshopinfodetail.cancelTime) {
            temcurrentchooseidx = i
          }
        }
      }
    } else if (options.placename == "自动确认收货时间") {
      temvaluearr = [7, 10, 15, 20, 25, 30]
      tempname = ["7天", "10天", "15天", "20天", "25天", "30天"]
      tempshowtitle = '提示' + '：' + '自动确认收货时间是指卖家发货后' + '，' + '买家如果不确认收货系统会自动确认收货的时间'
      if (temshopinfodetail.receiptedTime > 0) {
        for (let i = 0; i < tempname.length; i++) {
          if (tempname[i] == temshopinfodetail.receiptedTime + '天') {
            temcurrentchooseidx = i
          }
        }
      }
    } else if (options.placename == "评价超时时间") {
      temvaluearr = [7, 10, 15, 20, 25, 30]
      tempname = ["7天", "10天", "15天", "20天", "25天", "30天"]
      tempshowtitle = '提示' + '：' + '评价超时时间设置是指买家确认收货后' + '，' + '超过指定评价时间' + '，' + '则不允许再评价商品'
      if (temshopinfodetail.commentTime > 0) {
        for (let i = 0; i < tempname.length; i++) {
          if (tempname[i] == temshopinfodetail.commentTime + '天') {
            temcurrentchooseidx = i
          }
        }
      }
    } else if (options.placename == "配送范围设置") {
      temvaluearr = [0.5,1,2,3]
      tempname = ["1.0公里", "2.0公里", "3.0公里", "5.0公里"]
      let tempnames = ["1", "2", "3", "5"]
      tempshowtitle = ''
      if (temshopinfodetail.deliveryRange > 0) {
        for (let i = 0; i < tempnames.length; i++) {
          if (tempnames[i] == temshopinfodetail.deliveryRange) {
            temcurrentchooseidx = i
          }
        }
      }
    }
    this.data.chooselvalue = temvaluearr[temcurrentchooseidx]
    this.setData({
      placenamearr:tempname,
      toastshow:tempshowtitle,
      shopinfodetail: wx.getStorageSync('shopinfodetail'),
      currentchooseidx: temcurrentchooseidx
    })
  },
  compeletap: function () {
    if (this.data.curtitle == "自动确认收货时间"){
      this.modifydata('receiptedTime', this.data.chooselvalue)
    }
    else if (this.data.curtitle == "评价超时时间") {
      this.modifydata('commentTime', this.data.chooselvalue)
    }
    else if (this.data.curtitle == "支付超时时间") {
      this.modifydata('cancelTime', this.data.chooselvalue)
    }
    else if (this.data.curtitle == "配送范围设置") {
      this.modifydata('deliveryRange', this.data.chooselvalue)
    }
  },
  modifydata: function (temptime,selvalue) {
    var para = {"shopId": wx.getStorageSync("chooseshopid"), [temptime]: selvalue}
    var url = rootUrls.jiaoyishezhi
    console.log(0,para)
    if (temptime =='deliveryRange'){
      url = rootUrls.shopdeliveryUrl
    }
    urlApi.getInfo(url, para, "post")
      .then(res => {
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
        wx.navigateBack({

        })
      })
  },
  onChange: function onChange(event) {
    console.log(event)
    var idx = event.detail.value
    var timearr = []
    if (this.data.curtitle == "支付超时时间") {
      timearr = [30,60,24*60]
    } else if (this.data.curtitle == "配送范围设置"){
      timearr = [1.0,2.0,3.0,5.0]
    }
    else{
      timearr = [7, 10, 15, 20, 25, 30]
    }
    this.data.chooselvalue = timearr[idx]
  }
})