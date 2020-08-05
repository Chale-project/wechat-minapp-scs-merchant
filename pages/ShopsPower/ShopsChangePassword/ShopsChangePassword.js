// pages/ShopsPower/ShopsChangePassword/ShopsChangePassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordvalue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  passwordtap: function (e) {
    var value = e.detail.value
    this.setData({
      passwordvalue: value
    })
  },
  savetap: function (e) {
    // passwordvalue
    var pages = getCurrentPages();   //当前页面
    var prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
      //直接给上一个页面赋值
      passwordvalue: this.data.passwordvalue,
    })
    wx.navigateBack({
      
    })
  }
})