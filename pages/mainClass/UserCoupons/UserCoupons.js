// pages/mainClass/UserCoupons/UserCoupons.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNumber: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.userNumber = options.userNumber
    console.log(this.data.userNumber)
    wx.showLoading()
    this.getCouponList()
    this.getCouponList2()
    this.getCouponList3()
  },

  toCouponDetail: function (e) {
    wx.navigateTo({
      url: '/pages/mainClass/CouponDetail/CouponDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  getCouponList: function() {
    let that = this
    urlApi.getInfo(rootUrls.userCoupons, {
          "currentPage": "1",
          "pageSize": "10",
          "where": {
            'userNumber': that.data.userNumber,
            'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
            'status': 'notUsed' //notUsed(未使用）,hasUse（已使用）,hasInvalid（已过期）
          }
        },
        "POST")
      .then(res => {
        wx.hideLoading()
        console.log(1,res)
        if (res.code == 0) {
          for(let i=0;i<res.result.list.length;i++){
            res.result.list[i].usedAmount = urlApi.fen2Yuan(res.result.list[i].usedAmount)
          }
          that.setData({
            dataList: res.result.list
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  getCouponList2: function () {
    let that = this
    urlApi.getInfo(rootUrls.userCoupons, {
      "currentPage": "1",
      "pageSize": "10",
      "where": {
        'userNumber': that.data.userNumber,
        'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
        'status': 'hasUse' //notUsed(未使用）,hasUse（已使用）,hasInvalid（已过期）
      }
    },
      "POST")
      .then(res => {
        wx.hideLoading()
        console.log(2,res)
        if (res.code == 0) {
          for (let i = 0; i < res.result.list.length; i++) {
            res.result.list[i].usedAmount = urlApi.fen2Yuan(res.result.list[i].usedAmount)
          }
          that.setData({
            dataList2: res.result.list
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  getCouponList3: function () {
    let that = this
    urlApi.getInfo(rootUrls.userCoupons, {
      "currentPage": "1",
      "pageSize": "10",
      "where": {
        'userNumber': that.data.userNumber,
        'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
        'status': 'hasInvalid' //notUsed(未使用）,hasUse（已使用）,hasInvalid（已过期）
      }
    },
      "POST")
      .then(res => {
        wx.hideLoading()
        console.log(3,res)
        if (res.code == 0) {
          for (let i = 0; i < res.result.list.length; i++) {
            res.result.list[i].usedAmount = urlApi.fen2Yuan(res.result.list[i].usedAmount)
          }
          that.setData({
            dataList3: res.result.list
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})