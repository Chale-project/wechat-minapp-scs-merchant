// pages/mainClass/HomeNew/HomeNew.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayMoney: 0.00,
    alipaynMoney: 0.00,
    remainingMoney: 0.00,
    weixinMoney: 0.00,
    totalCustomers: 0, //客户总数
    recurrenceRate: 0.00, //回头率
    visitors: 0, //访客数
    ransactionOrder: 0, //成交订单
    totalCoupons: 0, //优惠券数量
    menuIdListOprater: '',
    merchatOrOperator: ''
  },

  showTip2: function() {
    wx.showToast({
      icon: 'none',
      title: '此功能正在开发中,敬请期待',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.data.merchatOrOperator = options.merchatOrOperator
    if (options.merchatOrOperator == 'merchant') {

    } else {
      this.data.menuIdListOprater = wx.getStorageSync('menuIdListOprater')
      console.log('list', this.data.menuIdListOprater, this.data.merchatOrOperator)
    }

    this.getOperatorMenuInfo()
  },


  //获取用户权限
  getOperatorMenuInfo: function() {
    let that = this
    urlApi.getInfo(rootUrls.getOperatorMenuInfo + wx.getStorageSync("chooseshopid"), {}, "GET")
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.result.type == 'shopOperator') {
            app.globalData.isShopOperator = true
            app.globalData.menuAuth = res.result.menuIdList
            wx.setStorageSync('menuIdListOprater', res.result.menuIdList)
            this.data.menuIdListOprater = res.result.menuIdList
          } else {
            app.globalData.isShopOperator = false
            app.globalData.menuAuth = []
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //获取首页数据
  getShopData: function() {
    let that = this
    urlApi.getInfo(rootUrls.shopAnalysis + wx.getStorageSync("chooseshopid"), {}, "GET")
      .then(res => {
        if (res.code == 0) {
          that.setData({
            todayMoney: urlApi.fen2Yuan(res.result.todayMoney),
            alipaynMoney: urlApi.fen2Yuan(res.result.alipaynMoney),
            remainingMoney: urlApi.fen2Yuan(res.result.remainingMoney),
            weixinMoney: urlApi.fen2Yuan(res.result.weixinMoney),
            totalCustomers: res.result.totalCustomers, //客户总数 
            recurrenceRate: res.result.recurrenceRate, //回头率 
            visitors: res.result.visitors, //访客数 
            ransactionOrder: res.result.ransactionOrder, //成交订单 
            totalCoupons: res.result.totalCoupons //优惠券数量 
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //formId
  sendFormId: function(formId) {
    console.log(formId)
    let that = this
    urlApi.getInfo(rootUrls.saveFormIdAndOpenId, {
        "formid": formId,
        "openid": wx.getStorageSync("rootopenid")
      }, "post")
      .then(res => {
        console.log(res)
      })
  },

  //formId
  // sendFormId: function (formId) {
  //   console.log(formId)
  //   let that = this
  //   urlApi.getInfo(rootUrls.saveFormId + "/" + wx.getStorageSync("chooseshopid")+"/"+formId, {}, "GET")
  //     .then(res => {

  //     })
  // },

  showTip: function() {
    this.setData({
      tip: 'show',
      tipString: "余额收入=消费者使用储值卡支付的金额（余额收入不计入到营业收入内）",
      tipTitle: "余额说明"
    })
  },


  showTip3: function() {
    this.setData({
      tip: 'show',
      tipString: "微信收入=消费者买单+购买储值卡+在线下单使用微信支付的金额",
      tipTitle: "微信收入说明"
    })
  },

  showTip5: function() {
    this.setData({
      tip: 'show',
      tipString: "今日营收=微信收入+支付宝收入",
      tipTitle: "今日营收说明"
    })
  },
  showTip4: function() {
    this.setData({
      tip: 'show',
      tipString: "支付宝收入=消费者扫码买单时使用支付宝付款的金额",
      tipTitle: "支付宝收入说明"
    })
  },

  hideModal(e) {
    this.setData({
      tip: null
    })
  },

  //余额管理
  toBalanceManage: function() {

    wx.navigateTo({
      url: '/pages/mainClass/BalanceManage/BalanceManage',
    })
  },

  //客户数据分析
  toCustomerDataAnalysis: function(e) {
    this.sendFormId(e.detail.formId)
    wx.showToast({
      icon: 'none',
      title: '此功能正在开发中,敬请期待',
    })
    // wx.navigateTo({
    //   url: '/pages/mainClass/CustomerDataAnalysis/CustomerDataAnalysis',
    // })
  },

  //用户管理
  toUserManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'customerManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '/pages/mainClass/UserManage/UserManage',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/UserManage/UserManage',
      })
    }

  },
  //商品管理
  toProductManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'productManager') {
          canenter = '1'
        }
        console.log('pro', pro, 'canenter', canenter)
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '../../StoreManager/StoreHome/StoreHome',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '../../StoreManager/StoreHome/StoreHome',
      })
    }

  },
  //订单管理
  toOrderManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'orderManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '/pages/mainClass/OrderManage/OrderManage',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/OrderManage/OrderManage',
      })
    }
  },
  //资金管理
  toMoneyManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'moneyManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '/pages/mainClass/MoneyManage/MoneyManage',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/MoneyManage/MoneyManage',
      })
    }
  },
  //营销管理
  toSaleManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'saleManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '/pages/mainClass/SaleManage/SaleManage',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/SaleManage/SaleManage',
      })
    }


    // if (this.data.merchatOrOperator == 'shopOperator') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '您暂无此权限',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/mainClass/SaleManage/SaleManage',
    //   })
    // }
  },
  //店铺管理
  toShopManage: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'shopManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        wx.navigateTo({
          url: '/pages/mainClass/ShopManage/ShopManage',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/ShopManage/ShopManage',
      })
    }
  },
  // //优惠券
  // toCoupon: function() {
  //   wx.navigateTo({
  //     url: '/pages/mainClass/Coupon/Coupon',
  //   })
  // },
  // //会员卡
  // toMembershipCard: function() {
  //   // wx.navigateTo({
  //   //   url: '/pages/mainClass/MembershipCard/MembershipCard',
  //   // })
  //   this.getShipCard()
  // },

  //扫码核销
  toScanErCode: function(e) {
    this.sendFormId(e.detail.formId)
    let that = this
    if (this.data.merchatOrOperator == 'shopOperator') {
      var canenter = '0'
      for (let i = 0; i < this.data.menuIdListOprater.length; i++) {
        let pro = this.data.menuIdListOprater[i]
        if (pro == 'scanManager') {
          canenter = '1'
        }
      }
      if (canenter == '1') {
        // 只允许从相机扫码
        wx.scanCode({
          onlyFromCamera: true,
          success(res) {
            console.log(res.result)
            that.getOrderDetail(res.result)
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
      }
    } else {
      // 只允许从相机扫码
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res.result)
          that.getOrderDetail(res.result)
        }
      })
    }
  },


  hideModal11: function() {
    this.setData({
      ScanDetail: ''
    })
  },
  scanSure: function() {
    wx.showLoading()
    this.scanProduct()
    this.setData({
      ScanDetail: ''
    })
  },


  //佣金收益 
  toCommissionIncome: function(e) {
    wx.navigateTo({
      url: '/pages/mainClass/CommissionIncome/CommissionIncome',
    })
  },

  // //店铺管理员设置
  // toShopAdministratorSet: function(e) {
  //   console.log(e.detail.formId)
  //   this.sendFormId(e.detail.formId)
  //   if (this.data.merchatOrOperator == 'shopOperator') {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '您暂无此权限',
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/ShopsPower/ShopsPowerManager/ShopPowerManager',
  //     })
  //   }
  // },
  //切换店铺
  toChangeStore: function(e) {
    console.log(e.detail.formId)
    this.sendFormId(e.detail.formId)
    wx.navigateTo({
      url: '/pages/ChooseStore/ChooseStore',
    })
  },


  //获取订单详情
  getOrderDetail: function(id) {
    let that = this
    urlApi.getInfo(rootUrls.getOrderDetail + id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.data.scanResult = res.info.verificationCode
          that.setData({
            ScanDetail: 'show',
            orderDescModelList: res.info.orderDescModelList
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
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


  //扫码核销
  scanProduct: function(verificationCode) {
    let that = this
    urlApi.getInfo(rootUrls.scanVerification + wx.getStorageSync("chooseshopid") + "/" + that.data.scanResult, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            ScanDetail: ''
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
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopName'),
    })
    this.getShopData()
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