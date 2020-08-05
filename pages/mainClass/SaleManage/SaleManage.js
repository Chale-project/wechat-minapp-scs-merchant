// pages/mainClass/SaleManage/SaleManage.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [{
      index: 1,
      imageUrl: "/pages/images/icon_coupons.png",
      name: "优惠券",
      pathUrl: "/pages/mainClass/Coupon/Coupon"
    }, {
      index: 2,
      imageUrl: "/pages/images/icon_integral.png",
      name: "积分",
      pathUrl: "/pages/mainClass/Integration/Integration"
    }, {
      index: 3,
      imageUrl: "/pages/images/icon_VIP.png",
      name: "会员卡",
      pathUrl: "/pages/mainClass/MembershipCard/MembershipCard"
    }, {
      index: 4,
      imageUrl: "/pages/images/icon_Storedvalue.png",
      name: "会员储值",
      pathUrl: "/pages/mainClass/StoredValue/StoredValue"
    }, {
      index: 5,
      imageUrl: "/pages/images/icon_Secondskill.png",
      name: "限时秒杀",
      pathUrl: "/pages/mainClass/SecKill/SecKill"
    }, {
      index: 6,
      imageUrl: "/pages/images/recommen.png",
      name: "商品推荐",
      pathUrl: "/pages/StoreManager/ProductRecommend/ProductRecommend",
    }, {
      index: 7,
      imageUrl: "/pages/images/icon_group.png",
      name: "拼团",
      pathUrl: "/pages/mainClass/PiecingTogether/PiecingTogether"
    }]

  },
  /*
   *
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


  toModel: function(e) {
    var position = e.currentTarget.dataset.pos
    switch (position) {
      case 0:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager1') {
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
        break
      case 1:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager2') {
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
        break
      case 3:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager3') {
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
        break
      case 2:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager7') {
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
        break
      case 4:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager4') {
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
        break
      case 5:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager6') {
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
        break
      case 6:
        if (app.globalData.isShopOperator) {
          var canenter = '0'
          for (let i = 0; i < app.globalData.menuAuth.length; i++) {
            let pro = app.globalData.menuAuth[i]
            if (pro == 'saleManager5') {
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
        break
    }
    if (position == 3) {
      wx.showLoading();
      this.getShipCard()
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.item,
      })
    }
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