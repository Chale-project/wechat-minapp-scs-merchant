// pages/mainClass/ShopManage/ShopManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopLogo:'',
    shopName:'',
    menuIdListOprater:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.menuIdListOprater = wx.getStorageSync('menuIdListOprater')
  },
  onShow: function(options) {
    this.setData({
      shopLogo: wx.getStorageSync('shopLogo'),
      shopName: wx.getStorageSync('shopName')
    })
  },


  //店铺管理员设置
  toShopAdministratorSet: function () {
    if (this.data.merchatOrOperator == 'shopOperator') {
      wx.showToast({
        icon: 'none',
        title: '您暂无此权限',
      })
    } else {
      wx.navigateTo({
        url: '/pages/ShopsPower/ShopsPowerManager/ShopPowerManager',
      })
    }
  },


  //首页栏目设置
  toShopLanmuTap: function (){
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager6') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/HomeLanMuSet/HomeLanMuSet',
    })
  },
  //二维码
  qrcodetap: function () {
    wx.navigateTo({
      url: '../ShopQrcode/ShopQrcode',
    })
  },
  //店铺资料
  toShopData: function() {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager7') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopData/ShopData',
    })
  },
  //交易设置
  toTransactionSetup: function () {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager1') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/TransactionSetup/TransactionSetup',
    })
  },
  //店铺广告
  toGuangErGaoSetup: function () {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager2') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopGuangErGao/ShopGuangErGao',
    })
  },
  //店铺介绍
  toShopIntroduct: function () {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager4') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopIntroduct/ShopIntroduct?subject=' + "0",
    })
  },

  //用户协议
  toUserProtocol: function () {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager5') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/UserProtocol/UserProtocol',
    })
  },

  //切换店铺
  cutShopTap: function () {
    wx.navigateTo({
      url: '/pages/ChooseStore/ChooseStore',
    })
  },

  //积分发放明细
  toIntegralDetail: function(){
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager3') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/IntegralDetail/IntegralDetail',
    })
  },

  //营业状态
  toShopSaleTap: function(){
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager8') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopBusinessDetail/ShopBusinessDetail',
    })
  },

  //上传微信二维码
  toWeixinCode: function () {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'shopManager9') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopWeixinCode/ShopWeixinCode',
    })
  }

})