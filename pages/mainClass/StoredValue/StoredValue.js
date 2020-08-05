// pages/mainClass/StoredValue/StoredValue.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    dataTitle: [{
        name: "全部"
      },
      {
        name: "已启用"
      }, {
        name: "已停用"
      }
    ],
    TabCur: 0,
    scrollLeft: 0,
    cardState: "",
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },



  //储值卡列表
  getCardList: function() {
    let that = this
    urlApi.getInfo(rootUrls.rechargeCardList, {
        "currentPage": that.data.page,
        "pageSize": 20,
        "where": {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'cardState': that.data.cardState
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page == 1) {
            that.data.dataList=[]
          }
          that.data.dataList = that.data.dataList.concat(res.page.list)
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

  onChange: function(event) {
    // this.data.pos = event.detail.index


    switch (event.detail.index) {
      case 0:
        this.data.cardState = ''
        break
      case 1:
        this.data.cardState = 'enabled'
        break
      case 2:
        this.data.cardState = 'disabled'
        break
    }

    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getCardList()

    // this.setData({
    //   TabCur: e.currentTarget.dataset.id,
    //   scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    // })
  },


  tabSelect(e) {
    console.log(e)

    switch (e.currentTarget.dataset.id) {
      case 0:
        this.data.cardState = ''
        break
      case 1:
        this.data.cardState = 'enabled'
        break
      case 2:
        this.data.cardState = 'disabled'
        break
    }

    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getCardList()

    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  addStoredValue: function(e) {
    wx.navigateTo({
      url: '/pages/mainClass/AddStoredValue/AddStoredValue',
    })
  },


  //启用  禁用
  switch1Change: function(e) {
    var item = e.currentTarget.dataset.item
    if (item.cardState == 'enabled') {
      this.startStop(item, 'disabled')
    } else {
      this.startStop(item, 'enabled')
    }
  },


  //启用  禁用
  startStop: function(item, state) {
    let that = this
    urlApi.getInfo(rootUrls.rechargeforbidden + item.id, {
        // "ids": item.id,
        // "pageSize": state
      }, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          this.data.page = 1
          this.data.dataList = []
          wx.showLoading()
          this.getCardList()
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      })
  },

  showDetail1: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mainClass/StoreValueDetail/StoreValueDetail?id=' + id,
    })
  },

  showDetail2: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mainClass/StoreValueDetail/StoreValueDetail?id=' + id,
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
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading()
    this.getCardList()
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
    this.getCardList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      wx.showLoading()
    this.getCardList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})