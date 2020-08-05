// pages/mainClass/UserProtocol/UserProtocol.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserAgreement()
  },
  getuserAgreement: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    urlApi.getInfo(rootUrls.userAgreeUrl, {}, "get")
      .then(res => {
        wx.hideLoading()
        var article = res.result;
        WxParse.wxParse('article', 'html', article, that, 5);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})