// pages/mainClass/AddStoredValue/AddStoredValue.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCount: "",
    cardCover: "",
    cardMoney: "",
    cardName: "",
    cardState: "",
    countMoney: "",
    presentCoupon: "",
    presentIntegral: "",
    presentMoney: "",
    shopId: "",
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.couponData = []
  },

  //名称
  name: function(e) {
    this.setData({
      cardName: e.detail.value
    })
  },
  //卡金额
  cardMoney: function(e) {
    this.setData({
      cardMoney: e.detail.value
    })
  },
  //赠送金额
  money: function(e) {
    this.setData({
      presentMoney: e.detail.value
    })
  },
  //赠送积分
  integration: function(e) {
    this.setData({
      presentIntegral: e.detail.value
    })
  },
  //赠送优惠券
  coupon: function(e) {
    this.setData({
      presentCoupon: e.detail.value
    })
  },


  //删除优惠劵
  deleteCoupon: function(e) {
    var pos = e.currentTarget.dataset.item
    app.globalData.couponData.splice(pos, 1)
    this.data.dataList = app.globalData.couponData
    this.setData({
      dataList: app.globalData.couponData
    })
  },

  createValue: function() {
    if (!this.data.cardName) {
      wx.showToast({
        icon:"none",
        title: '请输入储值卡名称',
      })
      return
    }

    if (this.data.cardName.length > 12 || this.data.cardName.length < 2) {
      wx.showToast({
        icon: "none",
        title: '储值卡名称限制2到12个字',
      })
      return
    }

    if (!this.data.cardMoney) {
      wx.showToast({
        icon: "none",
        title: '请输入储值卡金额',
      })
      return
    }

    if (!urlApi.isNumber(this.data.cardMoney)) {
      wx.showToast({
        icon: "none",
        title: '请输入正确储值卡金额',
      })
      return
    }
    if (this.data.cardMoney <= 0) {
      wx.showToast({
        icon: "none",
        title: '储值卡金额必须大于0',
      })
      return
    }


    if (this.data.presentMoney) {
      if (!urlApi.isNumber(this.data.presentMoney)) {
        wx.showToast({
          icon: "none",
          title: '请输入正确赠送金额',
        })
        return
      }
      if (this.data.presentMoney <= 0) {
        wx.showToast({
          icon: "none",
          title: '赠送金额必须大于0',
        })
        return
      }
    }

    if (this.data.presentIntegral) {
      if (this.data.presentIntegral <= 0) {
        wx.showToast({
          icon: "none",
          title: '赠送积分必须大于0',
        })
        return
      }
    }

    if (this.data.dataList.length > 0) {
      console.log(this.data.dataList)
      var id = ""
      var pos = this.data.dataList.length - 1
      for (var i = 0; i < this.data.dataList.length; i++) {
        if (i == pos) {
          id = id + this.data.dataList[i].id
        } else {
          id = id + this.data.dataList[i].id + ","
        }
      }
      console.log(id)
      this.data.presentCoupon = id
    } else {
      this.data.presentCoupon = ""
    }

    wx.showLoading()
    this.addCard()
  },


  //新增储值卡
  addCard: function() {
    let that = this
    urlApi.getInfo(rootUrls.rechargeCard, {
        // 'cardCover': that.data.cardCover,//储值卡封面
        'cardMoney': that.data.cardMoney * 100, //储值卡金额
        'cardName': that.data.cardName, //储值卡名称
        'presentCoupon': that.data.presentCoupon, //赠送优惠券
        'presentIntegral': that.data.presentIntegral, //赠送积分
        'presentMoney': that.data.presentMoney * 100, //赠送金额
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      })
  },

  //添加优惠劵
  addCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/ChooseCoupon/ChooseCoupon',
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

    this.data.dataList = app.globalData.couponData
    this.setData({
      dataList: app.globalData.couponData
    })
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