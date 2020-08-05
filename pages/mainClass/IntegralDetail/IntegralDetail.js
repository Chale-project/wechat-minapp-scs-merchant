// pages/mainClass/IntegralDetail/IntegralDetail.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    position: 1,
    state: "integralSumDesc",
    isLeft: 1,
    imageurl1: "/pages/images/icon_sorting_under.png",
    imageurl2: "/pages/images/icon_thesorting.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getIntegralList()
  },

  totalIntegral: function() {
    if (this.data.isLeft == 2) {
      this.data.state = ''
    }
    this.data.isLeft = 1
    if (this.data.state == '') {
      this.data.state = "integralSumDesc"
      this.setData({
        imageurl1: "/pages/images/icon_sorting_under.png",
        imageurl2: "/pages/images/icon_thesorting.png",
      })
    } else if (this.data.state == 'integralSumDesc') {
      this.data.state = "integralSumAsc"
      this.setData({
        imageurl1: "/pages/images/icon_sorting_on.png",
        imageurl2: "/pages/images/icon_thesorting.png",
      })
    } else if (this.data.state == 'integralSumAsc') {
      this.data.state = "integralSumDesc"
      this.setData({
        imageurl1: "/pages/images/icon_sorting_under.png",
        imageurl2: "/pages/images/icon_thesorting.png",
      })
    }
    wx.showLoading()
    this.getIntegralList()
  },

  canUserIntegral: function() {
    if (this.data.isLeft == 1) {
      this.data.state = ''
    }
    this.data.isLeft = 2

    if (this.data.state == '') {
      this.data.state = "customerIntegralDesc"
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_sorting_under.png",
      })
    } else if (this.data.state == 'customerIntegralDesc') {
      this.data.state = "customerIntegralAsc"
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_sorting_on.png",
      })
    } else if (this.data.state == 'customerIntegralAsc') {
      this.data.state = "customerIntegralDesc"
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_sorting_under.png",
      })
    }
    wx.showLoading()
    this.getIntegralList()
  },


  toUsedDetail: function(e) {
    var userNumber = e.currentTarget.dataset.usernumber
    console.log(e)
    wx.navigateTo({
      url: '/pages/user/UserIntegralUsed/UserIntegralUsed?userNumber=' + userNumber,
    })
  },


  getIntegralList: function() {
    let that = this
    urlApi.getInfo(rootUrls.integralShop, {
        "currentPage": that.data.position,
        "pageSize": "10",
        "where": {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'sort': that.data.state
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
          if (res.page.where.shopIntegralSum == 0) {
            that.setData({
              totalSum: res.page.where.shopIntegralSum,
              dataList: []
            })
          } else {
            that.data.dataList = that.data.dataList.concat(res.page.list)
            that.setData({
              totalSum: res.page.where.shopIntegralSum,
              dataList: that.data.dataList
            })
          }


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
    this.data.dataList = []
    this.getIntegralList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.position++
      this.getIntegralList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})