// pages/mainClass/ChooseCoupon/ChooseCoupon.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.globalData.couponData = []
  
  },

  toCouponDetail: function (e) {
    wx.navigateTo({
      url: '/pages/mainClass/CouponDetail/CouponDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  checkboxChange: function(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var checked = e.currentTarget.dataset.item
    if (checked) {
      this.data.dataList[index].checked = false
    } else {
      this.data.dataList[index].checked = true
    }
    this.setData({
      dataList: this.data.dataList
    })
  },

  //  点击完成
  chooseOver: function() {
    console.log("数据源", app.globalData.couponData)
    for (var i = 0; i < this.data.dataList.length; i++) {
      console.log("数据源", this.data.dataList[i])
      if (this.data.dataList[i].checked) {
        app.globalData.couponData.push(this.data.dataList[i])
      }
    }
    wx.navigateBack({})
  },

  getCouponList: function(couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page,
        "pageSize": "20",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'receive,notStart' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          for (var i = 0; i < res.page.list.length; i++) {
            res.page.list[i].checked = false
          }
          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  addCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/AddCoupon/AddCoupon',
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
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getCouponList()
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
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getCouponList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      wx.showLoading()
    this.getCouponList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})