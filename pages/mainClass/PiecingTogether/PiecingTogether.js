// pages/mainClass/PiecingTogether/PiecingTogether.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    state: '',
    showAdd: false,
    showList: false,
    dataList: '',
    deleteId: '',
    pos: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.showLoading()
    // this.getDataList()
  },


  addPiecing: function() {
    wx.navigateTo({
      url: '/pages/mainClass/AddPiecing/AddPiecing',
    })
  },

  onChange(event) {
    this.data.pos = event.detail.index
    switch (event.detail.index) {
      case 0:
        this.data.state = ''
        break
      case 1:
        this.data.state = 'notStart'
        break
      case 2:
        this.data.state = 'started'
        break
      case 3:
        this.data.state = 'over'
        break
    }
    this.data.page = 1
    wx.showLoading()
    this.getDataList()
  },

  //获取商品详情带规格
  getDataList: function() {
    let that = this
    urlApi.getInfo(rootUrls.pichingGoodsList, {
        "currentPage": this.data.page,
        "pageSize": 10,
        "where": {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'state': that.data.state
        }
      }, "post")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log(res)
        if (res.code == 0) {
          if (this.data.pos == 0) {
            if (res.page.list.length > 0) {
              that.setData({
                showAdd: true,
                showList: false
              })
            } else {
              if (that.data.page == 1) {
                that.setData({
                  showAdd: false,
                  showList: true
                })
              }
            }
          } else {
            if (res.page.list > 0 && that.data.page != 1) {
              that.setData({
                showAdd: true,
                showList: false
              })
            }
          }
          if (that.data.page == 1) {
            that.data.dataList = []
          }
          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },

  hideModal: function() {
    this.setData({
      modalName: ''
    })
  },
  sureModal: function(e) {
    this.setData({
      modalName: ''
    })
    wx.showLoading()
    this.deleteData()
  },

  //删除拼团活动
  deleteData: function() {
    let that = this
    urlApi.getInfo(rootUrls.goodsGroupDelete + "/" + this.data.deleteId, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          this.data.page = 1
          wx.showLoading()
          this.getDataList()
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
  //编辑
  editGroup: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/mainClass/PiecingEdit/PiecingEdit?id=' + e.currentTarget.dataset.id,
    })
  },
  //删除
  deleteGroup: function(e) {
    console.log(e)
    this.data.deleteId = e.currentTarget.dataset.id
    this.setData({
      modalName: 'show'
    })
  },
  //报表
  detailGroup: function(e) {
    wx.navigateTo({
      url: '/pages/mainClass/PiecingContent/PiecingContent?id=' + e.currentTarget.dataset.id,
    })
  },

  //团购详情
  showGropuDetail: function(e) {
    wx.navigateTo({
      url: '/pages/mainClass/PiecingDetail/PiecingDetail?id=' + e.currentTarget.dataset.id,
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
    this.getDataList()
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
    this.getDataList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      this.getDataList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})