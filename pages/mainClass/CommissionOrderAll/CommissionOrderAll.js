// pages/mainClass/CommissionOrderAll/CommissionOrderAll.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    pos: 1,
    state:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    this.getCodeOrder()
  },

  onChange(event) {
    switch (event.detail.index) {
      case 0:
        this.data.state = ""
        break
      case 1:
        this.data.state = "wait"
        break
      case 2:
        this.data.state = "already"
        break
      case 3:
        this.data.state = "arrived"
        break
      case 4:
        this.data.state = "correct"
        break
      case 5:
        this.data.state = "cancel"
        break
    }
    this.data.pos=1
    wx.showLoading()
    this.getCodeOrder()
  },



  getCodeOrder: function() {
    let that = this
    urlApi.getInfo(rootUrls.commissionRecordDesc, {
        'currentPage': that.data.pos,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"),
          'state': that.data.state,
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if(that.data.pos==1){
            that.data.dataList = []
          }
          for (let i = 0; i < res.result.list.length; i++) {
            // res.result.list[i].payment = urlApi.fen2Yuan(res.result.list[i].payment)
            // res.result.list[i].shopCommission = urlApi.fen2Yuan(res.result.list[i].shopCommission)
            switch (res.result.list[i].state){
              case "wait":
                res.result.list[i].state ="待结算"
              break
              case "already":
                res.result.list[i].state = "已结算"
                break
              case "correct":
                res.result.list[i].state = "冲正"
                break
              case "cancel":
                res.result.list[i].state = "已失效"
                break
              case "arrived":
                res.result.list[i].state = "已到账"
                break
              default:
                break
            }
          }
          that.data.dataList = that.data.dataList.concat(res.result.list)
          this.setData({
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
    this.data.pos=1
    this.getCodeOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.pos ++
    this.getCodeOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})