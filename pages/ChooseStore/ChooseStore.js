// pages/mainClass/ChooseStore/ChooseStore.js
var urlApi = require('../../utils/util.js')
var rootUrls = require('../../utils/rootUrl.js')
var md5js = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: '',
    isFromLogin:false,
    merchatOrOperator: 'merchant'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isFromLogin = options.isFromLogin
    //零售,餐饮，外卖
    if (wx.getStorageSync("access_token").length < 1) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  },
  onShow: function (options) {
    if (wx.getStorageSync("access_token").length > 0) {
      if (this.data.isFromLogin){
        this.getshoplistinfo()
      }else{
        this.getusertoken()
      }        
    }
  },
 getusertoken: function() {
  var secret = wx.getStorageSync('shanguserSecret')
  let para = {
      "userNumber": wx.getStorageSync('shanguserNumber'),
      "userSecret": md5js.md5(secret)
    }
  urlApi.getInfo(rootUrls.tokenUrl, para, "post")
    .then(res => {
      if (res.code == 0) {
        wx.setStorageSync('access_token', res.access_token)
        this.getshoplistinfo()
  } else {
    wx.showToast({
      icon: 'none',
      title: res.msg,
    })
  }
    })
},
  getshoplistinfo: function () {
    urlApi.getInfo(rootUrls.getOperatorInfoUrl, {}, "get")
      .then(res => {
        // auditState 待审核
        console.log('店铺',res)
        if (res.result.type == "merchant"){
          //商户
          this.setData({
            shops: res.result.merchant.shops,
            merchatOrOperator: res.result.type
          })
        }else{
          //操作员
          this.setData({
            shops: res.result.shopOperator.shops,
            merchatOrOperator: res.result.type
          })
          wx.setStorageSync('menuIdListOprater', res.result.menuIdList)
        }
      })
  },
  addStoreTap: function () {
    wx.navigateTo({
      url: '/pages/mainClass/AddStore/AddStore',
    })
  },
  chooseJump: function () {

    // outloginUrl
    urlApi.getInfo(rootUrls.outloginUrl, { 'token': wx.getStorageSync("access_token")}, "PUT")
      .then(res => {
        wx.setStorageSync('access_token', '')
        console.log('退出登录',res)
        wx.reLaunch({
          url: '/pages/index/index',
        })
      })
  },
  seltap: function (e) {
    //存储店铺id
    var idx = e.currentTarget.dataset.idx
    // qrCodePath
    
    if (this.data.shops[idx].auditState == "pass") {
      if (this.data.shops[idx].state == "disabled") {
        if (this.data.shops[idx].disableReason) {
          wx.showToast({
            icon: 'none',
            title: this.data.shops[idx].disableReason,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '暂无禁用原因',
          })
        } 
      }else{
        wx.setStorageSync("chooseshopid", this.data.shops[idx].shopId)
        // wx.setStorageSync("minpayqr", this.data.shops[idx].minpayqr)
        wx.setStorageSync("shopName", this.data.shops[idx].shopName)
        wx.setStorageSync("shopLogo", this.data.shops[idx].shopLogo)
        wx.reLaunch({
          url: '/pages/mainClass/HomeNew/HomeNew?merchatOrOperator=' + this.data.merchatOrOperator,
        })
      }
    } else if (this.data.shops[idx].auditState == "not")
    {
      wx.showToast({
        icon: 'none',
        title: '需要审核通过',
      })
    }
    else if (this.data.shops[idx].auditState == "notpass") {
      if (this.data.shops[idx].notPassCause){
        wx.showToast({
          icon: 'none',
          title: this.data.shops[idx].notPassCause,
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '暂无审核不通过原因',
        })
      }
      
    } else{
      wx.showToast({
        icon: 'none',
        title: '需要审核通过',
      })
    }
    
  },
  //图片加载出错，替换为默认图片
  avatarError: function (e) {
    var errorImgIndex = e.currentTarget.dataset.idx                  //获取循环的下标
    var tempshop = this.data.shops
    tempshop[errorImgIndex].shopLogo = "/pages/images/addStore/chooseStoreLogo.png"
    
    this.setData({
      shops: tempshop
    })
  }
})