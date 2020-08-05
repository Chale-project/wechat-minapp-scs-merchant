// pages/mainClass/PayDetail/PayDetail.js

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
    this.getOrderDetail()
  },

  //获取订单详情
  getOrderDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.getOrderDetail + this.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            money: urlApi.fen2Yuan(res.info.payment), //商品总金额
            orderType: res.info.payType,
            memberAmount: urlApi.fen2Yuan(res.info.memberAmount), //会员折扣
            couponAmount: urlApi.fen2Yuan(res.info.couponAmount), //优惠金额
            pointsDeduction: urlApi.fen2Yuan(res.info.pointsDeduction), //积分抵扣
            orderId: res.info.orderId, //订单id
            paymentTime: res.info.paymentTime, //付款时间 
            shopName: wx.getStorageSync('shopName')
          })
          //订单状态 //unpay 未支付 waitSending 待发货 waitReceiving 待收货   receipted  已签收/已取货  cancel已取消  success完成',
          switch (res.info.state) {
            case "unpay":
              that.setData({
                OrderState: "未支付"
              })
              break
            case "cancel":
              that.setData({
                OrderState: "已取消"
              })
              break
            case "success":
              that.setData({
                OrderState: "支付成功"
              })
              break
          }


          switch (res.info.payType) {
            case "weixin":
              that.setData({
                payTypeName: "微信"
              })
              break
            case "balance":
              that.setData({
                payTypeName: "余额"
              })
              break
            case "alipay":
              that.setData({
                payTypeName: "支付宝"
              })
              break
            default:
              that.setData({
                payTypeName: "微信/账号余额"
              })
              break
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