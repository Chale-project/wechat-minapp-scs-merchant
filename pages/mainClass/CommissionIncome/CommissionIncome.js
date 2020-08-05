// pages/mainClass/CommissionIncome/CommissionIncome.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastMonthEarn: "0.00",
    thisMonthEarn: "0.00",
    orderNum: "0",
    payEarn: "0.00",
    conmissionEarn: "0.00",
    time: "today"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    this.getCommissionEarnings()
  },

  onChange(event) {
    switch (event.detail.index) {
      case 0:
        this.data.time = "today"
        break
      case 1:
        this.data.time = "yesterday"
        break
      case 2:
        this.data.time = "week"
        break
      case 3:
        this.data.time = "month"
        break
    }
    wx.showLoading()
    this.getCommissionEarnings()
  },



  getCommissionEarnings: function() {
    let that = this
    urlApi.getInfo(rootUrls.commissionEarnings + wx.getStorageSync("chooseshopid") + "/" + that.data.time, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          that.setData({
            lastMonthEarn: res.info.lastMonthCommission,
            thisMonthEarn: res.info.thisMonthCommission,
            orderNum:res.info.orderCount,
            payEarn:res.info.payEarning,
            conmissionEarn: res.info.settleEarning
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //结算明细
  incomeDetail: function() {
    wx.navigateTo({
      url: '/pages/mainClass/IncomeDetail/IncomeDetail',
    })
  },
  //全部订单明细
  allOrderDetail: function() {
    wx.navigateTo({
      url: '/pages/mainClass/CommissionOrderAll/CommissionOrderAll',
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