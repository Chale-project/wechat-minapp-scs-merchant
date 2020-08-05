// pages/mainClass/IncomeDetail/IncomeDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    pos: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    this.getCommissionEarnings()
  },

  getCommissionEarnings: function() {

    let that = this
    urlApi.getInfo(rootUrls.commissionEarningsList, {
        'currentPage': that.data.pos,
        'pageSize': '12',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid")
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.pos == 1) {
            that.data.dataList = []
          }
          // for (let i = 0; i < res.page.list.length; i++) {
          //   res.page.list[i].commissionMoney = urlApi.fen2Yuan(res.page.list[i].commissionMoney)
          // }
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
    this.data.pos = 1
    this.getCommissionEarnings()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.pos++
      this.getCommissionEarnings()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})