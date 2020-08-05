// pages/mainClass/ShopShipIntroduct/ShopShipIntroduct.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //会员设置
  toShopShipSet: function() {
    wx.navigateTo({
      url: '/pages/mainClass/ShopShipSetting/ShopShipSetting',
    })
  },
  //获取会员卡
  getShipCard: function () {
    urlApi.getInfo(rootUrls.getShopShip, {
      'shopId': wx.getStorageSync("chooseshopid"), //商户id
    }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          if (res.result.length>0){
            wx.redirectTo({
              url: '/pages/mainClass/ShopShipUser/ShopShipUser',
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
    this.getShipCard()
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