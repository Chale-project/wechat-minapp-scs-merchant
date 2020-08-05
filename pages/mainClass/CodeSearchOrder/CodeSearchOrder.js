// pages/mainClass/CodeSearchOrder/CodeSearchOrder.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    position: 1,
    dataList: [],
    modalName: "",
    isAll: false,
    ids: "",
    screenHeighth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.data.code = options.code
    this.getCodeOrder()
  },

  //一键取货
  getAll: function() {
    this.setData({
      modalName: "show",
      isAll: true
    })
  },

  //查询所有未提货的订单
  getCodeOrder: function() {
    let that = this
    urlApi.getInfo(rootUrls.verificationByCode + wx.getStorageSync("chooseshopid") + "/" + this.data.code, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {

          for (let i = 0; i < res.result.length; i++) {
            res.result[i].goodsPrice = urlApi.fen2Yuan(res.result[i].goodsPrice)
            res.result[i].payment = urlApi.fen2Yuan(res.result[i].payment)
            for (let j = 0; j < res.result[i].orderDescModelList.length; j++) {
              res.result[i].orderDescModelList[j].price = urlApi.fen2Yuan(res.result[i].orderDescModelList[j].price)
            }
          }

          that.data.dataList = res.result
          this.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //订单详情
  toOrderDetail: function(e) {
    var id = e.currentTarget.dataset.item
    console.log(id)
    wx.navigateTo({
      url: '/pages/mainClass/OrderDetail/OrderDetail?id=' + id,
    })
  },


  //单个取货
  pickGoods: function(e) {
    this.data.id = e.currentTarget.dataset.item
    console.log(this.data.id)
    this.setData({
      modalName: "show",
      isAll: false
    })

  },

  hideModal: function() {
    this.setData({
      modalName: ""
    })
  },

  getOver: function() {
    this.setData({
      modalName: ""
    })
    wx.showLoading()
    if (this.data.isAll) {
      for (var i = 0; i<this.data.dataList.length ; i++) {
        console.log(i)
        if (i == this.data.dataList.length - 1) {
          this.data.ids = this.data.ids + this.data.dataList[i].id
        } else {
          this.data.ids = this.data.ids + this.data.dataList[i].id + ","
        }
      }
      console.log(this.data.ids)
      this.pickAllGoodsData()
    } else {
      this.pickGoodsData()
    }
  },

  //完成提货
  pickGoodsData: function() {
    let that = this
    urlApi.getInfo(rootUrls.pickGoods + that.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.redirectTo({
            url: '/pages/mainClass/GetSuccess/GetSuccess',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //一键提货
  pickAllGoodsData: function() {
    let that = this
    urlApi.getInfo(rootUrls.pickAllGoods + that.data.ids, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.redirectTo({
            url: '/pages/mainClass/GetSuccess/GetSuccess',
          })
        } else {
          wx.showToast({
            icon: 'none',
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