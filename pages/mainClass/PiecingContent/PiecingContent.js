// pages/mainClass/PiecingContent/PiecingContent.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    id: '',
    page: 1,
    state1: "waitGroup"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getGroupDetail()
    this.getGroupPeople()
  },

  onChange: function(event) {
    this.data.pos = event.detail.index
    switch (this.data.pos) {
      case 0:
        this.setData({
          state1: "waitGroup"
        })
        break;
      case 1:
        this.setData({
          state1: "success"
        })
        break;
      case 2:
        this.setData({
          state1: "faild"
        })
        break;
    }
    this.data.page = 1
    this.data.dataList = []
    this.getGroupPeople()
  },

  showAllUser: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mainClass/PiecingUser/PiecingUser?id=' + id,
    })
  },

  //获取拼团详情
  getGroupDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.pichingGoodsDetail + "/" + this.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log('详情', res)
        if (res.code == 0) {
          that.setData({
            coverImage: res.info.coverImage,
            title: res.info.title,
            number: res.info.groupPeopleCount,
            groupPrice: urlApi.fen2Yuan(res.info.groupPrice),
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //获取拼团人员
  getGroupPeople: function() {
    let that = this
    urlApi.getInfo(rootUrls.groupPeople, {
        "currentPage": that.data.page,
        "pageSize": "10",
        "where": {
          'goodsGroupId': that.data.id, //商户id
          'state': that.data.state1
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log('拼团人员', res)
        if (res.code == 0) {
          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            dataList: that.data.dataList,
          })
          switch (that.data.state1) {
            case "waitGroup":
              that.setData({
                state: "待成团"
              })
              break;
            case "success":
              that.setData({
                state: "拼团成功"
              })
              break;
            case "faild":
              that.setData({
                state: "拼团失败"
              })
              break;
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
    this.data.page = 1
    this.data.dataList = []
    this.getGroupPeople()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
    this.getGroupPeople()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})