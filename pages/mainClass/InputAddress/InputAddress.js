// pages/mainClass/InputAddress/InputAddress.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressshow: false,
    shencity: "",
    inputdetailaddress: "",
    shopLatitude: '',
    shopLongitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取添加店铺时的地址和经纬度
    var tempShopAddressDetail = ''
    if (!options.shopAddressDetail || options.shopAddressDetail == null || options.shopAddressDetail == 'null'){

    }else{
      tempShopAddressDetail = options.shopAddressDetail
    }
    this.setData({
      shencity: options.shopAddress,
      shopLongitude: options.shopLongitude,
      shopLatitude: options.shopLatitude,
      inputdetailaddress: tempShopAddressDetail
    })
  },

  getlocationwithmap: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          shopLatitude: res.latitude,
          shopLongitude: res.longitude,
          shencity: res.address,
          addressdetail: res.name
        })
      },
      fail: function (err) {
        if (err.errMsg == 'chooseLocation:fail cancel') {
          wx.showToast({
            icon: 'none',
            title: '您已取消选择地址',
          })
        } else {
          that.setData({
            addressshow: true
          })
        }
      }
    })
  },
  addressdetailinput: function (e) {
    this.setData({
      inputdetailaddress: e.detail.value
    })
  },
  addressonClose: function () {
    this.setData({
      addressshow: false
    })
  },
  surebuttontap: function () {
    this.setData({
      addressshow: false
    })
    wx.openSetting({
      success(res) {
      },
      fail(err) {
      }
    })
  },
  sureChangeTap: function () {
    if (this.data.shencity.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请选择所在区域',
      })
    } 
    var para = { "shopId": wx.getStorageSync("chooseshopid"), 'shopAddress': this.data.shencity, "shopLatitude": this.data.shopLatitude, "shopLongitude": this.data.shopLongitude, "shopAddressDetail": this.data.inputdetailaddress}
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        console.log(1, res)
        wx.navigateBack({
        })
      })
  },
    
})