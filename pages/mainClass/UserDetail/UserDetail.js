// pages/mainClass/UserDetail/UserDetail.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList1: [],
    dataList2: [],
    dataList3: [],
    userNumber: "",
    servicePhone: "",
    membershipId: "",
    headPic: "",
    page1: 1,
    page2: 1,
    page3: 1,
    pos: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.userNumber = options.userNumber
    this.data.membershipId = options.membershipId
    console.log(this.data.userNumber)
    wx.showLoading()
    this.getShopUserDetail()

    this.getShopUserDynamic()
    this.getUserOrder()
    this.getCustomerGoods()
  },
  //发送优惠劵
  sendCoupon: function() {

    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'customerManager2') {
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


    let that = this
    wx.navigateTo({
      url: '/pages/mainClass/SendCouponsToPersonage/SendCouponsToPersonage?userNumber=' + that.data.userNumber,
    })
  },
  //升级会员卡
  setShopShipLevel: function() {

    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'customerManager3') {
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
      url: '/pages/mainClass/UpgradeMember/UpgradeMember?membershipId=' + this.data.membershipId + "&userNumber=" + this.data.userNumber,
    })
  },

  //打电话
  takeCall: function() {


    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'customerManager4') {
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


    if (!this.data.servicePhone||this.data.servicePhone==null) {
      wx.showToast({
        icon: "none",
        title: "未获取到用户的手机号",
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: this.data.servicePhone,
    })
  },

  //用户详情
  getShopUserDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.customerDetail, {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'userNumber': that.data.userNumber
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.data.servicePhone = res.result.phoneNumber
          that.data.membershipId = res.result.membershipId
          console.log(res.result.membershipId)
          that.setData({
            headPic: res.result.headPic,
            nickname: res.result.nickname,
            membershipName: res.result.membershipName,
            orderCount: res.result.orderCount,
            lastOrderCount: res.result.lastOrderCount,
            sumPayment: res.result.sumPayment,
            couponCount: res.result.couponCount
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //优惠券
  toCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/UserCoupons/UserCoupons?userNumber=' + this.data.userNumber,
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
    this.getShopUserDetail()
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
    wx.showLoading()
    switch (this.data.pos) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.getShopUserDynamic()
        break;
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.getUserOrder()
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        this.getCustomerGoods()
        break
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading()
    switch (this.data.pos) {
      case 0:
        this.data.page1++
          this.getShopUserDynamic()
        break;
      case 1:
        this.data.page2++
          this.getUserOrder()
        break
      case 2:
        this.data.page3++
          this.getCustomerGoods()
        break
    }
  },

  onChange(event) {
    console.log(event.detail.index)
    this.data.pos = event.detail.index
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  //订单详情
  toOrderDetail: function(e) {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager1') {
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

    var id = e.currentTarget.dataset.item
    var type = e.currentTarget.dataset.type
    console.log(id)
    if (type == "immediately") {
      wx.navigateTo({
        url: '/pages/mainClass/PayDetail/PayDetail?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/OrderDetail/OrderDetail?id=' + id,
      })
    }
  },

  //客户动态
  getShopUserDynamic: function() {
    let that = this
    urlApi.getInfo(rootUrls.getCustomerStep, {
        'currentPage': that.data.page1,
        'pageSize': '30',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'userNumber': that.data.userNumber
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log('客户动态', res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          that.data.dataList1 = that.data.dataList1.concat(res.result.list)
          that.setData({
            UserDynamic: that.data.dataList1
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //客户订单记录
  getUserOrder: function() {
    let that = this
    urlApi.getInfo(rootUrls.orderList, {
        'currentPage': that.data.page2,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'userNumber': that.data.userNumber
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log('订单记录', res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          for (let i = 0; i < res.page.list.length;i++){
            res.page.list[i].payment = urlApi.fen2Yuan(res.page.list[i].payment)
            for (let j = 0; j < res.page.list[i].orderDescModelList.length; j++) {
              res.page.list[i].orderDescModelList[j].price = urlApi.fen2Yuan(res.page.list[i].orderDescModelList[j].price)
            }
          }



          that.data.dataList2 = that.data.dataList2.concat(res.page.list)
          console.log('订单记录', that.data.dataList2)
          that.setData({
            orderList: that.data.dataList2
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //客户常购商品
  getCustomerGoods: function() {
    let that = this
    urlApi.getInfo(rootUrls.getCustomerGoods, {
        'currentPage': that.data.page3,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'userNumber': that.data.userNumber
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log('常购', res)
        if (res.code == 0) {
          for (let i = 0; i < res.result.list.length; i++) {
            res.result.list[i].price = urlApi.fen2Yuan(res.result.list[i].price)
          }
          that.data.dataList3 = that.data.dataList3.concat(res.result.list)
          that.setData({
            productList: that.data.dataList3
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  }
})