// pages/mainClass/SendCouponsToPersonage/SendCouponsToPersonage.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNumber: "",
    page: 1,
    dataList: '',
    formId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.userNumber = options.userNumber
    console.log(this.data.userNumber)
  },

  toAddCoupons: function() {
    wx.navigateTo({
      url: '/pages/mainClass/AddCoupon/AddCoupon',
    })
  },

  toCouponDetail: function (e) {
    wx.navigateTo({
      url: '/pages/mainClass/CouponDetail/CouponDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  getCouponList: function(couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page,
        "pageSize": "10",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'receive,notStart' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          if(that.data.page==1){
            that.data.dataList = []
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

  //发送优惠劵
  formSubmit: function(e) {
    console.log(e)
    this.data.formId = e.detail.formId
    var id = e.detail.target.dataset.item
    wx.showLoading()
    this.sendCoupon(id)
  },

  formReset: function() {
    console.log('form发生了reset事件')
  },


  //推送优惠劵
  sendCoupon: function(id) {
    let that = this
    urlApi.getInfo(rootUrls.sendCoupon, {
        'couponId': id,
        'userNumbers': [that.data.userNumber],
        'formId': that.data.formId
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showLoading()
          this.data.dataList = []
          this.getCouponList()
          wx.showToast({
            title: '发送成功',
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
    wx.showLoading()
    this.data.dataList = []
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
    this.data.page = 1
    wx.showLoading()
    this.getCouponList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})