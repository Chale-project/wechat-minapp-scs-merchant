// pages/mainClass/ShopShipUser/ShopShipUser.js

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
  toAddMemberShip: function () {

    if (app.globalData.isShopOperator) {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
    }



    wx.navigateTo({
      url: '/pages/mainClass/ShopShipSetting/ShopShipSetting',
    })
  },
  //会员卡详情，
  toShipDetail: function (e) {
    var id = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/mainClass/ShopShipList/ShopShipList?id=' + id +"&type=shopMembership",
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
          this.setData({
            dataList: res.result
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
    this.getShipCard()
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