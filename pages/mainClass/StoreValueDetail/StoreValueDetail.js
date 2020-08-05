// pages/mainClass/StoreValueDetail/StoreValueDetail.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    isCanDelete:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getStoreValueDetail()

  },

  deleteStoreValue: function(e) {
    this.setData({
      modalName: 'show'
    })
  },

  //删除
  deleteModal: function(e) {
    this.setData({
      modalName: null
    })
    this.deleterechargeCard()
  },


  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  deleterechargeCard: function() {
    let that = this
    urlApi.getInfo(rootUrls.deletedRechargeCard + that.data.id, {}, "DELETE")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({
            
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  }, 

  getStoreValueDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.rechargeCardInfo + that.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            countMoney: res.info.countMoney,
            cardCount: res.info.cardCount,
            cardName: res.info.cardName,
            cardMoney: res.info.cardMoney,
            presentMoney: res.info.presentMoney,
            presentIntegral: res.info.presentIntegral,
            dataList: res.info.coupponList,
            isCanDelete: res.info.cardState =="enabled"
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