// pages/mainClass/ShopUploadInfo/ShopUploadInfo.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconfilePath:"",
    name:"",
    showimage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: '点击上传'+options.placename
    })
    if (options.imageurl && options.imageurl != 'null'){
      this.setData({
        iconfilePath: options.imageurl
      })
    }
    wx.setNavigationBarTitle({
      title: '修改' + options.placename
    })
    //判断有无上传有直接显示

  },
  avatarError: function (e) {
    
  },
  uploadtap: function () {
    urlApi.getPicutreInfo()
      .then(restwo => {
        this.setData({
          iconfilePath: restwo.url
        })
      })
  },
  completap: function () {
    if(this.data.iconfilePath.length<1){
      wx.showToast({
        icon: 'none',
        title: '上传证件不能为空',
      })
    }else{
      if (this.data.name == "点击上传营业执照") {
        this.modifydata('businessLicense', this.data.iconfilePath)
      } else if (this.data.name == "点击上传身份证正面") {
        this.modifydata('pidFront', this.data.iconfilePath)
      } else if (this.data.name == "点击上传身份证反面") {
        this.modifydata('pidBack', this.data.iconfilePath)
      } else if (this.data.name == "点击上传手持身份证") {
        this.modifydata('pidInhand', this.data.iconfilePath)
      }
    }
  },
  modifydata: function (name, value) {
    var para = { "shopId": wx.getStorageSync("chooseshopid"), [name]: value }
    console.log(para)
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        console.log(1, res)
        wx.navigateBack({
        })
      })
  },
  //放大图片
  showImageTap: function () {
    this.setData({
      showimage: true
    })
  },
  cancleshowpictap: function () {
    this.setData({
      showimage: false
    })
  }
})