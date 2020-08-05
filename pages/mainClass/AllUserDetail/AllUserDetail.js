// pages/mainClass/AllUserDetail/AllUserDetail.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: "",
    types: "",
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
    page: 1,
    searchtitle:"",
    nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.types = options.type
    this.setData({
      type: 1
    })
  },


  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.nickname = e.detail.value
    if(!this.data.nickname){
      this.data.nickname = ""
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getShopUserList()
  },

  //用户列表
  getShopUserList: function() {
    let that = this
    urlApi.getInfo(rootUrls.customerList, {
        'currentPage': that.data.page,
        'pageSize': '12',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'type': that.data.types,
          'sort': that.data.sort,
          'isAsc': that.data.isAsc,
          'nickname': that.data.nickname
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page == 1) {
            that.data.dataList = []
          }
          for (let i = 0; i < res.result.list.length;i++){
            res.result.list[i].sumPayment = urlApi.yuan(res.result.list[i].sumPayment)
          }
          that.data.dataList = that.data.dataList.concat(res.result.list)
          that.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      })
  },



  //查看某个用户详情数据
  toUserDetail: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/mainClass/UserDetail/UserDetail?userNumber=' + e.currentTarget.dataset.item,
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
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      wx.showLoading({
        title: '加载中',
      })
    this.getShopUserList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})