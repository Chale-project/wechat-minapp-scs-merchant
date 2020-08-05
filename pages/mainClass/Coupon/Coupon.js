// pages/mainClass/Coupon/Coupon.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    index: 0,
    dataList1: '',
    page1: 1,
    dataList2: '',
    page2: 1,
    dataList3: '',
    page3: 1,
    dataList4: '',
    page4: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    
    // this.getCouponList2()
    this.getCouponList3()
    this.getCouponList4()
  },

  onChange(event) {
    this.data.index = event.detail.index
    switch (this.data.index) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.getCouponList()
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.getCouponList2()
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        this.getCouponList3()
        break
      case 3:
        this.data.page4 = 1
        this.data.dataList4 = []
        this.getCouponList4()
        break
    }
  },

  getCouponList: function(couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page1,
        "pageSize": "10",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'receive' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log(res)
        if (res.code == 0) {
          if (that.data.page1 == 1) {
            that.data.dataList1 = []
          }
          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].usedAmount = urlApi.fen2Yuan(res.page.list[i].usedAmount)
          }
          that.data.dataList1 = that.data.dataList1.concat(res.page.list)
          that.setData({
            dataList: that.data.dataList1
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  toCouponDetail:function(e){
    wx.navigateTo({
      url: '/pages/mainClass/CouponDetail/CouponDetail?id='+e.currentTarget.dataset.id,
    })
  },

  //发送优惠劵
  SendCoupons: function(e) {
    var id = e.currentTarget.dataset.item
    // wx.navigateTo({
    //   url: '/pages/mainClass/SendCoupons/SendCoupons?id=' + id,
    // })
    wx.navigateTo({
      url: '/pages/mainClass/ChooseUser/ChooseUser?id=' + id,
    })
  },

  //新增优惠劵
  toAddCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/AddCoupon/AddCoupon',
    })
  },

  //删除优惠劵
  deleteCoupon: function(e) {
    console.log(e)
    this.data.id = e.currentTarget.dataset.item
    this.setData({
      modalName: 'show'
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  deleteModal(e) {
    let that = this
    urlApi.getInfo(rootUrls.deleteCoupon + "/" + this.data.id, {}, "DELETE")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            modalName: null
          })
          switch (this.data.index) {
            case 0:
              this.data.page1 = 1
              this.data.dataList1 = []
              this.getCouponList()
              break
            case 1:
              this.data.page2 = 1
              this.data.dataList2 = []
              this.getCouponList2()
              break
            case 2:
              this.data.page3 = 1
              this.data.dataList3 = []
              this.getCouponList3()
              break
            case 3:
              this.data.page4 = 1
              this.data.dataList4 = []
              this.getCouponList4()
              break
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
    console.log(this.data.index)
    switch (this.data.index) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.getCouponList()
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.getCouponList2()
        break
    }

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
    switch (this.data.index) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.getCouponList()
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.getCouponList2()
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        this.getCouponList3()
        break
      case 3:
        this.data.page4 = 1
        this.data.dataList4 = []
        this.getCouponList4()
        break
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading()
    switch (this.data.index) {
      case 0:
        this.data.page1++
          this.getCouponList()
        break
      case 1:
        this.data.page2++
          this.getCouponList2()
        break
      case 2:
        this.data.page3++
          this.getCouponList3()
        break
      case 3:
        this.data.page4++
          this.getCouponList4()
        break
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  getCouponList2: function() {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page2,
        "pageSize": "10",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'notStart' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        console.log("未开始", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page2 == 1) {
            that.data.dataList2 = []
          }
          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].usedAmount = urlApi.fen2Yuan(res.page.list[i].usedAmount)
          }
          that.data.dataList2 = that.data.dataList2.concat(res.page.list)
          that.setData({
            dataList2: that.data.dataList2
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  getCouponList3: function() {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page3,
        "pageSize": "10",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'out' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page3 == 1) {
            that.data.dataList3 = []
          }
          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].usedAmount = urlApi.fen2Yuan(res.page.list[i].usedAmount)
          }
          that.data.dataList3 = that.data.dataList3.concat(res.page.list)
          that.setData({
            dataList3: that.data.dataList3
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  getCouponList4: function() {
    let that = this
    urlApi.getInfo(rootUrls.couponList, {
        "currentPage": that.data.page4,
        "pageSize": "10",
        "where": {
          'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
          'couponStatus': 'over' //receive（可领用），out（领完）,notStart未开始，active(活动中)，over(已过期)
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page4 == 1) {
            that.data.dataList4 = []
          }
          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].usedAmount = urlApi.fen2Yuan(res.page.list[i].usedAmount)
          }
          that.data.dataList4 = that.data.dataList4.concat(res.page.list)
          that.setData({
            dataList4: that.data.dataList4
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
})