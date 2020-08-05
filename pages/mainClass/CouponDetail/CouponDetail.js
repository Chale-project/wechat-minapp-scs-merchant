// pages/mainClass/CouponDetail/CouponDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getCouponDetail()
  },

  getCouponDetail:function(){
    let that = this
    urlApi.getInfo(rootUrls.couponDetail + "/" + this.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            usedAmount: urlApi.fen2Yuan(res.result.usedAmount),
            meetAmount: urlApi.fen2Yuan(res.result.meetAmount),
            isAllProduct: res.result.goodsModelList.length==0?true:false,
            validStartTime: res.result.validStartTime,
            validEndTime: res.result.validEndTime,
            couponQuota: res.result.couponQuota,
            residueCount: res.result.residueCount,
            repeatCount: res.result.repeatCount,
            isShow1: res.result.weixinCardPackage=="no"?false:true,
            isShow2: res.result.showTakeOut == "no"?false : true,
            title: res.result.title,
            spec: res.result.spec
          })

          for (let i = 0; i < res.result.goodsModelList.length;i++){
            res.result.goodsModelList[i].price = urlApi.fen2Yuan(res.result.goodsModelList[i].price)
          }

          that.setData({
            dataList: res.result.goodsModelList
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