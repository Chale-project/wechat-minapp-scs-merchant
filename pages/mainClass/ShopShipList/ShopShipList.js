// pages/mainClass/ShopShipList/ShopShipList.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    types: "",
    membershipId: "",
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.types = options.type
    this.data.membershipId = options.id
   
  },

  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.nickname = e.detail.value
    if (!this.data.nickname) {
      this.data.nickname = ""
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  //查看某个用户详情数据
  toUserDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/mainClass/UserDetail/UserDetail?userNumber=' + e.currentTarget.dataset.item,
    })
  },

  //用户列表
  getShopUserList: function () {
    let that = this
    urlApi.getInfo(rootUrls.customerList, {
      'currentPage': '1',
      'pageSize': '100',
      'where': {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'type': that.data.types,
        'membershipId': that.data.membershipId,
        'sort': 'lastOrderTime',
        'isAsc': 'false',
        'nickname': that.data.nickname
      },
    }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
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