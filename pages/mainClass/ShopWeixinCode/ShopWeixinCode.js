// pages/mainClass/ShopWeixinCode/ShopWeixinCode.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupQrCodePic: "",
    groupQrDescription: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取详情
    this.getshopweixincodedata()
  },
  getshopweixincodedata: function () {
    urlApi.getInfo(rootUrls.shopwxcodedetailUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        console.log('detail',res)
        let result = res.result
        this.setData({
          groupQrCodePic: result[0].groupQrCodePic,
          groupQrDescription: result[0].groupQrDescription
        })
      })
  },
  uploadtap: function () {
    urlApi.getPicutreInfo()
      .then(restwo => {
        this.setData({
          groupQrCodePic: restwo.url
        })
      })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      groupQrDescription : e.detail.value
    })
  },
  completap: function () {
    if (this.data.groupQrCodePic.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '上传微信群二维码不能为空',
      })
    } else {
        this.modifydata('', this.data.groupQrCodePic)
    }
  },
  modifydata: function () {
    var para = { "shopId": wx.getStorageSync("chooseshopid"), 'picIntroModels': [{ 'groupQrCodePic': this.data.groupQrCodePic, 'groupQrDescription': this.data.groupQrDescription}] }
    console.log(para)
    urlApi.getInfo(rootUrls.addgroupCodeUrl, para, "post")
      .then(res => {
        console.log(1, res)
        wx.navigateBack({
        })
      })
  },
})