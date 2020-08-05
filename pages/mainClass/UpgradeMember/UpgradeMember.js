// pages/mainClass/UpgradeMember/UpgradeMember.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberShipId: "",
    userNumber: "",
    chooseId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options", options)
    this.data.memberShipId = options.membershipId
    this.data.userNumber = options.userNumber
    wx.showLoading();
    this.getShipCard()
  },


  toAddMenmberShip: function(){
    wx.navigateTo({
      url: '/pages/mainClass/ShopShipIntroduct/ShopShipIntroduct',
    })
  },

  hideModal: function() {
    this.setData({
      modalName: null
    })
  },
  sureModal: function() {
    wx.showLoading()
    this.upgradeMember()
    this.setData({
      modalName: null
    })
  },

  //获取会员卡
  getShipCard: function() {
    let that = this
    urlApi.getInfo(rootUrls.getShopShip, {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
      }, "POST")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          for (var i = 0; i < res.result.length; i++) {
            if (that.data.memberShipId == res.result[i].id) {
              res.result[i].checked = true
            }else{
              res.result[i].checked = false
            }
          }
          that.setData({
            dataList: res.result
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  checkboxChange: function(e) {
    console.log(e)
    if (!e.currentTarget.dataset.item) {
      var dataItem = e.currentTarget.dataset.index
      this.setData({
        modalName: 'show'
      })
      this.data.chooseId = dataItem
    }
  },

  //升级会员卡
  upgradeMember: function() {
    let that = this
    urlApi.getInfo(rootUrls.upgradeMemeber, {
        'userNumber': this.data.userNumber,
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'membershipId': that.data.chooseId
      }, "POST")
      .then(res => {
        if (res.code == 0) {
          that.data.membershipId = that.data.chooseId
          that.setData({
            dataList: []
          })
          wx.navigateBack({
            
          })
        } else {
          wx.hideLoading()
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