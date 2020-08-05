// pages/mainClass/Home/Home.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayMoney: 0.00,
    alipaynMoney: 0.00,
    remainingMoney: 0.00,
    weixinMoney: 0.00,
    totalCustomers:0,//客户总数
    recurrenceRate:0.00,//回头率
    visitors:0,//访客数
    ransactionOrder:0,//成交订单
    totalCoupons:0//优惠券数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // || wx.getStorageSync("access_token").length < 1
  },

  //获取首页数据
  getShopData: function() {
    let that = this
    urlApi.getInfo(rootUrls.shopAnalysis + wx.getStorageSync("chooseshopid"), {}, "GET")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          that.setData({
            todayMoney: urlApi.fen2Yuan(res.result.todayMoney),
            alipaynMoney: urlApi.fen2Yuan(res.result.alipaynMoney),
            remainingMoney: urlApi.fen2Yuan(res.result.remainingMoney),
            weixinMoney: urlApi.fen2Yuan(res.result.weixinMoney),
            totalCustomers: res.result.totalCustomers,//客户总数
            recurrenceRate: res.result.recurrenceRate,//回头率
            visitors: res.result.visitors,//访客数
            ransactionOrder: res.result.ransactionOrder,//成交订单
            totalCoupons: res.result.totalCoupons//优惠券数量
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },

  showTip:function(){
    this.setData({
      tip: 'show',
      
    })
  },

  hideModal(e) {
    this.setData({
      tip: null
    })
  },


  onShow: function(options) {
    // this.setData({
    //   shopName1: wx.getStorageSync('shopName'),
    //   shopLogo: wx.getStorageSync('shopLogo'),
    // })
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopName'),
    })
    this.getShopData()
  },
  //客户数据分析
  toCustomerDataAnalysis: function() {
    // wx.navigateTo({
    //   url: '/pages/mainClass/CustomerDataAnalysis/CustomerDataAnalysis',
    // })
  },

  //用户管理
  toUserManage: function() {
    wx.navigateTo({
      url: '/pages/mainClass/UserManage/UserManage',
    })
  },
  //商品管理
  toProductManage: function() {
    wx.navigateTo({
      url: '../../StoreManager/StoreHome/StoreHome',
    })
  },
  //订单管理
  toOrderManage: function() {
    wx.navigateTo({
      url: '/pages/mainClass/OrderManage/OrderManage',
    })
  },
  //资金管理
  toMoneyManage: function() {
    wx.navigateTo({
      url: '/pages/mainClass/MoneyManage/MoneyManage',
    })
  },

  //余额管理
  toBalanceManage: function () {
    wx.navigateTo({
      url: '/pages/mainClass/BalanceManage/BalanceManage',
    })
  },
  
  //营销管理
  toSaleManage: function() {
    wx.navigateTo({
      url: '/pages/mainClass/SaleManage/SaleManage',
    })
  },
  //店铺管理
  toShopManage: function() {
    wx.navigateTo({
      url: '/pages/mainClass/ShopManage/ShopManage',
    })
  },
  //优惠券
  toCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/Coupon/Coupon',
    })
  },
  //会员卡
  toMembershipCard: function() {
    // wx.navigateTo({
    //   url: '/pages/mainClass/MembershipCard/MembershipCard',
    // })
    this.getShipCard()
  },
  //获取会员卡
  getShipCard: function() {
    urlApi.getInfo(rootUrls.getShopShip, {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
      }, "POST")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          if (res.result.length > 0) {
            wx.navigateTo({
              url: '/pages/mainClass/MembershipCard/MembershipCard',
            })
          } else {
            wx.navigateTo({
              url: '/pages/mainClass/ShopShipIntroduct/ShopShipIntroduct',
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
})