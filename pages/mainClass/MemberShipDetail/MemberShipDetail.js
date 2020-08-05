// pages/mainClass/MemberShipDetail/MemberShipDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.couponData = []
    app.globalData.couponProductList = []
    console.log(options)
    this.data.id = options.id
    wx.showLoading({
      title: '加载中',
    })
    this.getShipCardDetail()
  },

  btn2: function() {
    wx.navigateTo({
      url: '/pages/StoreManager/ProChooseList2/ProChooseList2',
    })
  },

  getShipCardDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.getShopShipDetail, {
        'id': this.data.id, //商户id
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)

        if (res.code == 0) {
          if (res.result.freePostage) {
            if (res.result.freePostage > 0) {
              that.setData({
                checked1: true
              })
            }
          }

          if (res.result.discount) {
            that.setData({
              checked2: true
            })
          }

          if (res.result.couponList) {
            if (res.result.couponList.length > 0) {
              that.setData({
                checked3: true
              })
              app.globalData.couponData = res.result.couponList
            } else {
              app.globalData.couponData = []
            }
          } else {
            app.globalData.couponData = []
          }
          if (res.result.disabledJson != null) {
            app.globalData.couponProductList = res.result.disabledJsonList
            console.log(res.result.disabledJsonList.length)
            for (let i = 0; i < res.result.disabledJsonList.length; i++) {
              app.globalData.caterIdlist.push(res.result.disabledJsonList[i].firstId)
            }
            console.log(app.globalData.couponProductList)
            console.log(app.globalData.caterIdlist)
          }


          that.setData({
            discount: res.result.discount,
            freePostage: res.result.freePostage / 100,
            shipName: res.result.membershipName,
            moneyQuota: res.result.moneyQuota / 100,
            orderQuota: res.result.orderQuota,
            dataList: res.result.couponList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },

  //会员名称
  inputShipName: function(e) {
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

  //添加优惠劵
  addCoupon: function() {
    wx.navigateTo({
      url: '/pages/mainClass/ChooseCoupon/ChooseCoupon',
    })
  },


  //修改会员卡
  addShipCard: function() {
    urlApi.getInfo(rootUrls.modifyShipCard, {
        'couponId': this.data.couponId, //优惠劵Id
        'discount': this.data.discount, //折扣
        'freePostage': !this.data.freePostage ? "-1" : (this.data.freePostage * 100), //满多少 包邮
        'membershipName': this.data.shipName, //会员名称
        'moneyQuota': this.data.moneyQuota * 100, //累积消费满多少元
        'orderQuota': this.data.orderQuota, //累积消费满多少次
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'id': this.data.id,
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

  //点击完成
  addCard: function() {
    if (!this.data.shipName) {
      wx.showToast({
        title: '请输入会员名称',
      })
      return
    }
    if (!this.data.moneyQuota) {
      wx.showToast({
        title: '请输入会员条件',
      })
      return
    }
    if (!this.data.orderQuota) {
      wx.showToast({
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



    if (!this.data.checked1) {
      this.data.freePostage = ""
    }

    if (!this.data.checked2) {
      this.data.discount = ""
    }

    console.log(this.data.dataList)
    if (this.data.dataList != null && this.data.dataList.length > 0) {
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
    } else {
      this.data.couponId = ''
    }

    if (!this.data.checked3) {
      this.data.couponId = ""
    }

    wx.showLoading({
      title: '加载中',
    })
    this.addShipCard();
  },

  //删除优惠劵
  deleteCoupon: function(e) {
    console.log(e)
    var pos = e.currentTarget.dataset.item
    app.globalData.couponData.splice(pos, 1)
    this.data.dataList = app.globalData.couponData
    this.setData({
      dataList: app.globalData.couponData
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