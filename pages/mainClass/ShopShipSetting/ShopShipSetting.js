// pages/mainClass/ShopShipSetting/ShopShipSetting.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked1: false,
    checked2: false,
    checked3: false,
    shipName: "",
    moneyQuota: "",
    orderQuota: "",
    freePostage: "",
    discount: "",
    couponId: "",
    dataList: []
  },

  //会员名称
  inputShipName: function(e) {
    app.globalData.couponData = []
    this.setData({
      shipName: e.detail.value
    })
    console.log(this.data.shipName)
  },
  //累积满多少元
  inputMoneyQuota: function(e) {
    this.setData({
      moneyQuota: e.detail.value
    })
  },
  //累积满多少次
  inputOrderQuota: function(e) {

    this.setData({
      orderQuota: e.detail.value
    })
  },
  //满多少包邮
  inputFreePostage: function(e) {
    this.setData({
      freePostage: e.detail.value
    })
  },
  //折扣
  inputDiscount: function(e) {
    this.setData({
      discount: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.couponProductList = []
    app.globalData.couponData = []
  },

  //添加优惠劵
  addCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/ChooseCoupon/ChooseCoupon',
    })
  },

  btn2: function() {
    wx.navigateTo({
      url: '/pages/StoreManager/ProChooseList2/ProChooseList2',
    })
  },

  //点击完成
  addCard: function() {
    if (!this.data.shipName) {
      wx.showToast({
        icon: "none",
        title: '请输入会员名称',
      })
      return
    }
    if (!this.data.moneyQuota) {
      wx.showToast({
        icon: "none",
        title: '请输入会员条件',
      })
      return
    }

    if (!this.isNumber(this.data.moneyQuota)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的累计消费金额条件',
      })
      return
    }

    if (!this.data.orderQuota) {
      wx.showToast({
        icon: "none",
        title: '请输入会员条件',
      })
      return
    }


    if (!(/(^[1-9]\d*$)/.test(this.data.orderQuota))) {
      wx.showToast({
        icon: "none",
        title: '累计消费满多少次，请输入整数',
      })
      return
    }

    if (this.data.freePostage) {
      if (this.data.freePostage <= 0) {
        wx.showToast({
          icon: "none",
          title: '满包邮金额设置有误',
        })
        return
      }

      if (!this.isNumber(this.data.freePostage)) {
        wx.showToast({
          icon: 'none',
          title: '请输入正确的满包邮金额',
        })
        return
      }
    }


   


    if (!this.data.checked1) {
      this.data.freePostage = ""
    }

    if (!this.data.checked2) {
      this.data.discount = ""
    }


    wx.showLoading({
      title: '加载中',
    })
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
    this.data.couponId = id
    if (!this.data.checked3) {
      this.data.couponId = ""
    }
    this.addShipCard();
  },
  //新增会员卡
  addShipCard: function() {
    urlApi.getInfo(rootUrls.addShipCard, {
        'couponId': this.data.couponId, //优惠劵Id
        'discount': this.data.discount, //折扣
        'freePostage': !this.data.freePostage ? "-1" : (this.data.freePostage * 100), //满多少 包邮
        'membershipName': this.data.shipName, //会员名称
        'moneyQuota': this.data.moneyQuota * 100, //累积消费满多少元
        'orderQuota': this.data.orderQuota, //累积消费满多少次
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'sort': '', //排序
        'disabledProductAndClassify': app.globalData.couponProductList
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
            title: res.msg,
          })
        }
      })
  },


  isNumber: function (val) {
    var regPos = /^\d+(\.\d+)?$/;  //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;  //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    }
    else {
      return false;
    }
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  //满包邮
  onChange1(event) {
    console.log(event)
    this.setData({
      checked1: !this.data.checked1
    });
  },
  //折扣
  onChange2(event) {
    console.log(event)
    this.setData({
      checked2: !this.data.checked2
    });
  },
  //送优惠劵
  onChange3(event) {
    console.log(event)
    this.setData({
      checked3: !this.data.checked3
    });
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

  //删除优惠劵
  deleteCoupon: function(e) {
    var pos = e.currentTarget.dataset.item
    app.globalData.couponData.splice(pos, 1)
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
    app.globalData.limitProduct = []
    app.globalData.caterIdlist = []
    app.globalData.couponProductList = []
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