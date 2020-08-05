var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [{
      name: "潜在客户",
      type: "potentialCustomer",
      flagCheck: false
    }, {
      name: "新客户",
      type: "newCustomer",
      flagCheck: false
    }, {
      name: "回头客",
      type: "repeatCustomer",
      flagCheck: false
    }, {
      name: "流失客户",
      type: "lossCustomer",
      flagCheck: false
    }],
    id: "",
    types:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id

    this.setData({
      dataList: this.data.dataList
    })
  },

  toUserList: function(e) {
    console.log(e)
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/mainClass/SendCoupons/SendCoupons?id=' + this.data.id + '&type=' + type,
    })
  },

  checkboxChange: function(e) {
    var index = e.currentTarget.dataset.index
    var checked = e.currentTarget.dataset.item
    console.log(checked)
    if (checked) {
      this.data.dataList[index].flagCheck = false
      // this.data.types.splice(this.data.dataList[index].type)
    } else {
      this.data.dataList[index].flagCheck = true
      // this.data.types.push(this.data.dataList[index].type)
    }
    this.setData({
      dataList: this.data.dataList
    })
  },



  //formId
  sendFormId: function (formId) {
    console.log(formId)
    let that = this
    urlApi.getInfo(rootUrls.saveFormId + "/" + wx.getStorageSync("chooseshopid") + "/" + formId, {}, "GET")
      .then(res => {

      })
  },


  //发送优惠券
  sendCoupons: function(e) {
    var isHasChoose = false;
    this.data.types = []
    for (let i = 0; i < this.data.dataList.length;i++){
      if (this.data.dataList[i].flagCheck){
        isHasChoose = true
        this.data.types.push(this.data.dataList[i].type)
      }
    }


    if (!isHasChoose){
      wx.showToast({
        title:'请选择发送客户的类型',
        icon:"none"
      })
        return
    }
    this.sendFormId(e.detail.formId)
    wx.showLoading()
    let that = this
    urlApi.getInfo(rootUrls.typePush, {
      "types": that.data.types,
      "couponId": that.data.id,
    }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: "优惠券发送成功",
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