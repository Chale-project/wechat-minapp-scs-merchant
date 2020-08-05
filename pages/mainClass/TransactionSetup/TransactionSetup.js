// pages/mainClass/TransactionSetup/TransactionSetup.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopinfodetail:{},
    multiArray: [],
    multiIndex: [0, 0, 0, 0, 0],
    hourdata: "00:00--00:00",
    timeOneArr: [],//0-23
    timeTwoArr: [],//00-59:0-5:0-9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //00-23
    for (var i = 0; i < 3; i++) {
      if (i == 2) {
        for (var j = 0; j < 4; j++) {
          this.data.timeOneArr.push(i.toString() + j.toString())
        }
      } else {
        for (var j = 0; j < 10; j++) {
          this.data.timeOneArr.push(i.toString() + j.toString())
        }
      }
    }
    //00-59
    for (var a = 0; a < 6; a++) {
      for (var b = 0; b < 10; b++) {
        this.data.timeTwoArr.push(a.toString() + b.toString())
      }
    }
    var temparr = [this.data.timeOneArr, this.data.timeTwoArr, ["--"], this.data.timeOneArr, this.data.timeTwoArr]
    this.setData({
      multiArray: temparr
    })
  },
  onShow: function (options) {
    this.getsetdata()
  },
  sendmoneysetuptap: function () {
    wx.navigateTo({
      url: '../ShopSendMoneySet/ShopSendMoneySet',
    })
  },
  //自动确认收货时间
  autusureshoptimetap: function () {
    wx.navigateTo({
      url: '../ShopTimeOutPay/ShopTimeOutPay?placename=' + '自动确认收货时间',
    })
  },
  pingjiatimetap: function () {
    wx.navigateTo({
      url: '../ShopTimeOutPay/ShopTimeOutPay?placename=' + '评价超时时间',
    })
  },
  //支付超时时间
  timeoutpaytap: function () {
    wx.navigateTo({
      url: '../ShopTimeOutPay/ShopTimeOutPay?placename='+'支付超时时间',
    })
  },
  //到店自提
  GoShoptap: function () {
    wx.navigateTo({
      url: '../GoShopGet/GoShopGet',
    })
  },
  placesendsettingtap: function () {
    wx.navigateTo({
      url: '../ShopTimeOutPay/ShopTimeOutPay?placename=' + '配送范围设置',
    })
  },
  getsetdata:function () {
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.getshopinfoSetUrl, { "shopId": wx.getStorageSync("chooseshopid")}, "post")
      .then(res => {
        wx.hideLoading()
        console.log('交易设置', res)
        var hourarr = ['00:00','00:00']
        if (res.result.deliveryHours){
          hourarr = res.result.deliveryHours.split(",")
        }
        this.setData({
          shopinfodetail:res.result,
          hourdata: hourarr[0].toString() + '--' + hourarr[1].toString()

        })
        wx.setStorageSync('shopinfodetail', this.data.shopinfodetail)
        
        
      })
  },
  //指定配送时间
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    var temparr = e.detail.value
    var one = this.data.multiArray[0][temparr[0]].toString()
    var two = this.data.multiArray[1][temparr[1]].toString()
    var three = this.data.multiArray[3][temparr[3]].toString()
    var four = this.data.multiArray[4][temparr[4]].toString()
    var five = one + ':' + two + '--' + three + ':' + four
    this.setData({
      multiIndex: e.detail.value,
      hourdata: five
    })
    //调用modify接口
    var timehourarr = this.data.hourdata.split("--")
    var yingyetime = timehourarr[0] + ',' + timehourarr[1]
    this.modifydata('deliveryHours', yingyetime)
  },
  modifydata: function (temptime, selvalue) {
    var para = { "shopId": wx.getStorageSync("chooseshopid"), [temptime]: selvalue }
    console.log(0, para)
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
      })
  },
})