// pages/mainClass/ShopData/ShopData.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconfilePath: "",
    infodic:{},
    uploadGoodImageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow: function (options) {
    this.getshopinfo()
  },
  getshopinfo:function () {
    // getshopinfoUrl
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.getshopinfoUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        console.log('店铺资料',res)
        if (res.code == 0) {
          this.setData({
            iconfilePath: res.result.shopLogo,
            infodic: res.result,
            uploadGoodImageUrl: res.result.shopLogo
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  //logo 营业执照 身份证正面 身份证反面 手持身份证
  tupiantap: function () {
    console.log('uploadGoodImageUrl', this.data.uploadGoodImageUrl)
    wx.navigateTo({
      url: '/pages/mainClass/cutInside/cutInside?uploadGoodImageUrl=' + this.data.uploadGoodImageUrl + '&isfrom=' + 'ShopData' + '&imageidx=' + '',
    })
    // urlApi.getPicutreInfo()
    //   .then(restwo => {
    //     if (restwo.code == 0){
    //       this.setData({
    //         iconfilePath: restwo.url
    //       })
    //       this.modifydata('shopLogo', restwo.url)
    //     }else{
    //       wx.showToast({
    //         title: res.msg,
    //       })
    //     }
    //   })
  },
  shopbusinesstap: function () {
    wx.navigateTo({
      url: '../ShopUploadInfo/ShopUploadInfo?placename=' + '营业执照' + '&imageurl=' + this.data.infodic.businessLicense ,
    })
  },
  shopsfztap: function() {
    wx.navigateTo({
      url: '../ShopUploadInfo/ShopUploadInfo?placename=' + '身份证正面' + '&imageurl=' + this.data.infodic.pidFront,
    })
  },
  shopsfzbacktap: function () {
    wx.navigateTo({
      url: '../ShopUploadInfo/ShopUploadInfo?placename=' + '身份证反面' + '&imageurl=' + this.data.infodic.pidBack,
    })
  },
  shopsfzhandletap: function () {
    wx.navigateTo({
      url: '../ShopUploadInfo/ShopUploadInfo?placename=' + '手持身份证' + '&imageurl=' + this.data.infodic.pidInhand,
    })
  },
  shopnametap: function () {
    wx.navigateTo({
      url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '店铺名称' + '&name=' + this.data.infodic.shopName,
    })
  },
  shopPublicinfotap: function () {
    wx.navigateTo({
      url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '公告信息' + '&name=' + this.data.infodic.shopNotice,
    })
  },
  shopAddresstap: function () {
    // wx.navigateTo({
    //   url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '店铺地址' + '&name=' + this.data.infodic.shopAddress,
    // })

    wx.navigateTo({
      url: '/pages/mainClass/InputAddress/InputAddress?shopAddress=' + this.data.infodic.shopAddress + '&shopLatitude=' + this.data.infodic.shopLatitude + '&shopLongitude=' + this.data.infodic.shopLongitude + '&shopAddressDetail=' + this.data.infodic.shopAddressDetail, 
    })
  },
  shopkefutap: function () {
    wx.navigateTo({
      url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '客服电话' + '&name=' + this.data.infodic.phoneNumber,
    })
  },
  shopfarentap: function () {
    wx.navigateTo({
      url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '法人' + '&name=' + this.data.infodic.legalPersom,
    })
  },
  shopiphonetap: function () {
    wx.navigateTo({
      url: '../ShopChangeInfo/ShopChangeInfo?placename=' + '手机号' + '&name=' + this.data.infodic.legalPhoneNumber,
    })
  },
  //修改logo
  modifydata: function (name, value) {
    wx.showLoading({
      title: '保存中...',
    })
    var para = { "shopId": wx.getStorageSync("chooseshopid"), [name]: value }
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        if(res.code == 0){
          wx.setStorageSync('shopLogo', value)
        }else{
          wx.showToast({
            title: res.msg,
          })
        }
      })
  }
})