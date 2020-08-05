// UserIntegralUsed/UserIntegralUsed.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNumber: "",
    position:1,
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.userNumber = options.userNumber

    wx.setNavigationBarTitle({
      title: '积分使用明细',
    })
    

    wx.showLoading()
    this.getIntegralList()
  },

  getIntegralList: function () {
    let that = this
    urlApi.getInfo(rootUrls.integralShopUser, {
      "currentPage": that.data.position,
      "pageSize": "30",
      "where": {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'userNumber': that.data.userNumber
      }
    }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log(res)
        if (res.code == 0) {
          if (that.data.position == 1) {
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
    this.data.position = 1
    this.getIntegralList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.position ++
    this.getIntegralList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})