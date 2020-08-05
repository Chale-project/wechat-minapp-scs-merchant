// pages/mainClass/SendCoupons/SendCoupons.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    sort: "sumPayment",
    isAsc: 'false',
    imageurl1: "/pages/images/icon_sorting_under.png",
    imageurl2: "/pages/images/icon_thesorting.png",
    imageurl3: "/pages/images/icon_thesorting.png",
    sort1: 1,
    sort2: 0,
    sort3: 0,
    textColor1: "text-red",
    textColor2: "text-black",
    textColor3: "text-black",
    chooseNum: 0,
    couponId: "",
    userNumbers: [],
    page: 1,
    formId: "",
    type: "",
    chooseAll: false,
    totalChoose:0
  },


  checkboxChange: function(e) {
    var index = e.currentTarget.dataset.index
    var checked = e.currentTarget.dataset.item

    if (checked) {
      this.data.chooseNum = this.data.chooseNum - 1
      this.data.dataList[index].flagCheck = false
    } else {
      this.data.chooseNum = this.data.chooseNum + 1
      this.data.dataList[index].flagCheck = true
    }
    for (let i = 0; i < this.data.dataList.length; i++) {
      if (!this.data.dataList[i].flagCheck) {
        this.data.chooseAll = false;
        break
      }
    }

    this.setData({
      chooseNum: this.data.chooseNum,
      dataList: this.data.dataList,
      chooseAll: this.data.chooseAll,
      totalChoose: this.data.chooseNum
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.couponId = options.id
    this.data.type = options.type
    this.setData({
      type: 4,
      typeDes: this.data.type
    })


    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

//全选
  chooseAllUser: function() {
    for (let i = 0; i < this.data.dataList.length; i++) {
      if (this.data.chooseAll) {
        this.data.dataList[i].flagCheck = false
        this.data.chooseNum = 0
      } else {
        this.data.dataList[i].flagCheck = true
        this.data.chooseNum = this.data.dataList.length
      }
    }
    console.log(this.data.userNumbers)
    this.setData({
      chooseAll: !this.data.chooseAll,
      dataList: this.data.dataList,
      totalChoose: this.data.chooseNum
    })
  },

  //用户列表
  getShopUserList: function() {
    let that = this
    urlApi.getInfo(rootUrls.customerList, {
        'currentPage': that.data.page,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'type': that.data.typeDes,
          'sort': that.data.sort,
          'isAsc': that.data.isAsc
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          for (let i = 0; i < res.result.list.length; i++) {
            if (this.data.chooseAll) {
              res.result.list[i].flagCheck = true
            }
          }
          that.data.dataList = that.data.dataList.concat(res.result.list)
          that.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //推送部分人
  formSubmit2: function(e) {
    this.data.userNumbers = []
    for (var i = 0; i < this.data.dataList.length; i++) {
      if (this.data.dataList[i].flagCheck) {
        this.data.userNumbers.push(this.data.dataList[i].userNumber)
      }
    }
    console.log(this.data.userNumbers)
    //formId
    this.data.formId = e.detail.formId
    let that = this
    if (this.data.userNumbers.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择推送的用户',
      })
      return
    }

    console.log(that.data.userNumbers)
    wx.showLoading()
    this.sendCoupon()
  },

  sendAll: function() {
    this.setData({
      modalName: 'show'
    })
  },

  //发送给所有人
  formSubmit1: function(e) {
    for (var i = 0; i < this.data.dataList.length; i++) {
      this.data.userNumbers.push(this.data.dataList[i].userNumber)
    }
    console.log(this.data.userNumbers)
    if (this.data.dataList.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '没有可选择的客户',
      })
      return
    }

    // //formId
    // this.data.formId = e.detail.formId
    // console.log(e)
    // wx.showLoading()
    // this.sendCoupon()
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


  //推送优惠劵
  sendCoupon: function() {
    let that = this
    urlApi.getInfo(rootUrls.sendCoupon, {
        'couponId': this.data.couponId,
        'userNumbers': this.data.userNumbers,
        'formId': that.data.formId
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: '发送成功',
          })
          wx.navigateBack({
            delta:2
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //总交易额
  btn1: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.sort = 'sumPayment'
    if (this.data.sort1 == 0) {
      this.data.isAsc = 'false'
      this.setData({
        imageurl1: "/pages/images/icon_sorting_under.png",
        imageurl2: "/pages/images/icon_thesorting.png",
        imageurl3: "/pages/images/icon_thesorting.png",
        textColor1: "text-red",
        textColor2: "text-black",
        textColor3: "text-black",
        sort1: 1,
        sort2: 0,
        sort3: 0,
        type: 1
      })
    } else {
      this.data.isAsc = 'true'
      this.setData({
        imageurl1: "/pages/images/icon_sorting_on.png",
        imageurl2: "/pages/images/icon_thesorting.png",
        imageurl3: "/pages/images/icon_thesorting.png",
        textColor1: "text-red",
        textColor2: "text-black",
        textColor3: "text-black",
        sort1: 0,
        sort2: 0,
        sort3: 0,
        type: 1,
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },
  //最近购买
  btn2: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.sort = 'lastOrderTime'
    if (this.data.sort2 == 0) {
      this.data.isAsc = 'false'
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_sorting_under.png",
        imageurl3: "/pages/images/icon_thesorting.png",
        textColor1: "text-black",
        textColor2: "text-red",
        textColor3: "text-black",
        sort1: 0,
        sort2: 1,
        sort3: 0,
        type: 2
      })
    } else {
      this.data.isAsc = 'true'
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_sorting_on.png",
        imageurl3: "/pages/images/icon_thesorting.png",
        textColor1: "text-black",
        textColor2: "text-red",
        textColor3: "text-black",
        sort1: 0,
        sort2: 0,
        sort3: 0,
        type: 2,
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },
  //购买次数
  btn3: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.sort = 'orderCount'
    if (this.data.sort3 == 0) {
      this.data.isAsc = 'false'
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_thesorting.png",
        imageurl3: "/pages/images/icon_sorting_under.png",
        textColor1: "text-black",
        textColor2: "text-black",
        textColor3: "text-red",
        sort1: 0,
        sort2: 0,
        sort3: 1,
        type: 3
      })
    } else {
      this.data.isAsc = 'true'
      this.setData({
        imageurl1: "/pages/images/icon_thesorting.png",
        imageurl2: "/pages/images/icon_thesorting.png",
        imageurl3: "/pages/images/icon_sorting_on.png",
        textColor1: "text-black",
        textColor2: "text-black",
        textColor3: "text-red",
        sort1: 0,
        sort2: 0,
        sort3: 0,
        type: 3,
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
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
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getShopUserList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      wx.showLoading()
    this.getShopUserList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //推送优惠劵
  sendCouponToAll: function() {
    let that = this
    urlApi.getInfo(rootUrls.sendCoupon, {
        'couponId': this.data.couponId,
        'formId': that.data.formId,
        'userNumbers': []
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: '发送成功',
          })
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
})