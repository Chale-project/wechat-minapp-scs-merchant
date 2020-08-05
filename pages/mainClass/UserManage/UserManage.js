// pages/mainClass/UserManage/UserManage.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [{
        imageUrl: "/pages/images/icon_Potentialcustomers.png",
        name: "",
        total: "",
        sevenDayNew: "",
        thirtyDayNew: "",
        goods: "",
        middle: "",
        bad: "",
        isComment: 1,
        index: 1
      }, {
        imageUrl: "/pages/images/icon_newcustomer.png",
        name: "",
        total: "",
        sevenDayNew: "",
        thirtyDayNew: "",
        goods: "",
        middle: "",
        bad: "",
        isComment: 1,
        index: 2
      }, {
        imageUrl: "/pages/images/icon_Backtothecustomer.png",
        name: "",
        total: "",
        sevenDayNew: "",
        thirtyDayNew: "",
        goods: "",
        middle: "",
        bad: "",
        isComment: 1,
        index: 3
      }, {
        imageUrl: "/pages/images/icon_Lossofcustomers.png",
        name: "",
        total: "",
        sevenDayNew: "",
        thirtyDayNew: "",
        goods: "",
        middle: "",
        bad: "",
        isComment: 2,
        index: 4
      }
      // ,
      // {
      //   imageUrl: "/pages/images/icon_comments.png",
      //   name: "",
      //   total: "",
      //   sevenDayNew: "",
      //   thirtyDayNew: "",
      //   goods: "",
      //   middle: "",
      //   bad: "",
      //   isComment: 3,
      //   index: 5
      // }
    ],
    customerCount: 0, //客户数
    repeatBuy: 0, // 回头率,
    avgPayment: 0, //7日客单价,
    membershipCount: 0 //会员数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getUserManageData()
  },
  //客户数据分析
  toCustomerDataAnalysis: function() {
    // wx.navigateTo({
    //   url: '/pages/mainClass/CustomerDataAnalysis/CustomerDataAnalysis',
    // })
  },






  showTip1: function() {
    this.setData({
      tip: 'show',
      tipName: '回头率说明',
      tipContent: "回头率=回头客数/成交客户数"
    })
  },


  showTip5: function () {
    this.setData({
      tip: 'show',
      tipName: '7日客单价说明',
      tipContent: "7日客单价=近7日支付订单总金额/成功付款的客户数"
    })
  },


  showTip2: function(e) {
    console.log(e)
    var index = e.currentTarget.dataset.indexs
    switch (index) {
      case 1:
        this.setData({
          tip: 'show',
          tipName: '潜在客户说明',
          tipContent: "可能购买商品的客户"
        })
        break
      case 2:
        this.setData({
          tip: 'show',
          tipName: '新客户说明',
          tipContent: "90天内新增的交易成功的客户数量（当客户次日再交易，则新客户变更为回头客，新客户数量-1，回头客+1）"
        })
        break
      case 3:
        this.setData({
          tip: 'show',
          tipName: '回头客说明',
          tipContent: "30天内复购的客户"
        })
        break
      case 4:
        this.setData({
          tip: 'show',
          tipName: '流失客说明',
          tipContent: "30天内没有复购的客户"
        })
        break
    }
    
  },

  hideModal(e) {
    this.setData({
      tip: null
    })
  },


  //潜在客户 新客户 回头客 流失客户 客户评论
  toUserDetail: function(e) {
    var dataItem = e.currentTarget.dataset.item
    console.log(e)
    var type = ""
    var name = ""
    if (dataItem.index == 1) {
      type = "potentialCustomer"
      name = "潜在客户"
    } else if (dataItem.index == 2) {
      type = "newCustomer"
      name = "新客户"
    } else if (dataItem.index == 3) {
      type = "repeatCustomer"
      name = "回头客"
    } else if (dataItem.index == 4) {
      type = "lossCustomer"
      name = "流失客户"
    } else if (dataItem.index == 5) {
      type = "5"
      name = "客户评论"
    }
    wx.navigateTo({
      url: '/pages/mainClass/ShopUser/ShopUser?type=' + type + "&total=" + dataItem.total + "&seven=" + dataItem.sevenDayNew + "&thirty=" + dataItem.thirtyDayNew + "&name=" + name,
    })
  },

  //全部客户
  toAllCoustom: function() {
    wx.navigateTo({
      url: '/pages/mainClass/AllUserDetail/AllUserDetail?type=shopCustomer',
    })
  },
  //我的会员
  toMyCoustom: function() {
    wx.showLoading();
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
              url: '/pages/mainClass/ShopShipUser/ShopShipUser',
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

  //获取用户数据
  getUserManageData: function() {
    let that = this
    urlApi.getInfo(rootUrls.userManageData, {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.data.dataList[0].name = "潜在客户" + res.result.potentialCustomerMap.potentialCustomer90Count + "人"
          that.data.dataList[0].total = res.result.potentialCustomerMap.potentialCustomer90Count
          // that.data.dataList[0].sevenDayNew = res.result.potentialCustomerMap.potentialCustomer7Count
          // that.data.dataList[0].thirtyDayNew = res.result.potentialCustomerMap.potentialCustomer30Count


          that.data.dataList[1].name = "新客户" + res.result.newCustomerMap.newCustomer90Count + "人"
          that.data.dataList[1].total = res.result.newCustomerMap.newCustomer90Count
          // that.data.dataList[1].sevenDayNew = res.result.newCustomerMap.newCustomer7Count
          // that.data.dataList[1].thirtyDayNew = res.result.newCustomerMap.newCustomer30Count


          that.data.dataList[2].name = "回头客" + res.result.newRepeatBuyerMap.newRepeatBuyer90Count + "人"
          that.data.dataList[2].total = res.result.newRepeatBuyerMap.newRepeatBuyer90Count
          // that.data.dataList[2].sevenDayNew = res.result.newRepeatBuyerMap.newRepeatBuyer7Count
          // that.data.dataList[2].thirtyDayNew = res.result.newRepeatBuyerMap.newRepeatBuyer30Count

          that.data.dataList[3].name = "流失客户" + res.result.lossCustomerMap.lossCustomerCount + "人"
          that.data.dataList[3].total = res.result.lossCustomerMap.lossCustomerCount
          // that.data.dataList[3].sevenDayNew = "0"
          // that.data.dataList[3].thirtyDayNew = "0"


          // that.data.dataList[4].name = "客户评论" + res.result.orderCommentMap.orderCommentCount + "条"
          // that.data.dataList[4].total = res.result.orderCommentMap.orderCommentCount
          // that.data.dataList[4].goods = res.result.orderCommentMap.highComment
          // that.data.dataList[4].middle = res.result.orderCommentMap.mediumComment
          // that.data.dataList[4].bad = res.result.orderCommentMap.lowComment

          that.setData({
            customerCount: res.result.customerCount, //客户数
            repeatBuy: res.result.repeatBuy, // 回头率,
            avgPayment: urlApi.fen2Yuan(res.result.avgPayment), //7日客单价,
            membershipCount: res.result.membershipCount, //会员数
            dataList: that.data.dataList
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