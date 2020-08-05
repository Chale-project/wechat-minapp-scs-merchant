// pages/mainClass/PiecingEditTwo/PiecingEditTwo.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    guigeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getGroupDetail()
  },



  getGroupPrice: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.guigeList[pos].groupPrice = e.detail.value
    console.log(this.data.guigeList[pos].groupPrice)
  },
  getStock: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.guigeList[pos].groupStock = e.detail.value
    console.log(this.data.guigeList[pos].groupStock)
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
            groupPrice: urlApi.fen2Yuan(res.info.groupPrice),
            peopleNum: res.info.groupPeopleCount,
            startTime: res.info.startTime,
            endTime: res.info.endTime,
            groupTime: res.info.groupTime,
            limitation: res.info.limitation

          })

          for (let i = 0; i < res.info.goodsGroupDescModels.length; i++) {
            res.info.goodsGroupDescModels[i].groupPrice = urlApi.fen2Yuan(res.info.goodsGroupDescModels[i].groupPrice)
          }
         
          that.data.guigeList = res.info.goodsGroupDescModels
          that.setData({
            dataList: res.info.goodsGroupDescModels
          })
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
    //多规格
    app.globalData.groupEditSize = []
    console.log(this.data.guigeList)
    for (let i = 0; i < this.data.guigeList.length; i++) {
      if (this.data.guigeList[i].groupNum == "" || this.data.guigeList[i].groupPrice == "") {
        continue
      }
      var json = {
        "goodsGroupDescId": this.data.guigeList[i].id,
        "groupNum": this.data.guigeList[i].groupStock,
        "groupPrice": parseInt(this.data.guigeList[i].groupPrice * 100)
      }
      app.globalData.groupEditSize.push(json)
    }
    console.log(app.globalData.groupEditSize)
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