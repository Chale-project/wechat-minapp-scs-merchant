// pages/mainClass/ShopSendMoneySet/ShopSendMoneySet.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendprice:"",
    fullprice:"",
    littlePrice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopinfodetail = wx.getStorageSync('shopinfodetail')
    //判断如果是0和没有值
    if (shopinfodetail.deliveryCost > 0 && shopinfodetail.freeDeliveryFee > 0){
      this.setData({
        sendprice: shopinfodetail.deliveryCost / 100,
        fullprice: shopinfodetail.freeDeliveryFee / 100,
        littlePrice: shopinfodetail.minOrderFee / 100
      })
    }
    
  },
  inputnametap: function (e) {
    this.setData({
      sendprice: e.detail.value
    })
  },
  inputnametaptwo: function (e) {
    this.setData({
      littlePrice: e.detail.value
    })
  }, 
  inputfullnametap: function (e) {
    this.setData({
      fullprice: e.detail.value
    })
  },
  completetap: function () {
    if (this.data.sendprice.length<1){
      wx.showToast({
        icon: 'none',
        title: '请填写配送费',
      })
    } else if (this.data.fullprice.length<1){
      wx.showToast({
        icon: 'none',
        title: '请填写包邮金额',
      })
    }
    else{
      this.modifydata()
    }
    
  },
  modifydata: function () {
    //判断输入的是小于0则传入-1
    var deliveryCost = this.data.sendprice * 100
    var freeDeliveryFee = this.data.fullprice * 100
    var littlePrice = this.data.littlePrice * 100
    if (deliveryCost == 0 && freeDeliveryFee!=0){
      wx.showToast({
        icon:'none',
        title: '请输入都大于0的金额或都为0的金额',    
      })
    } else if (freeDeliveryFee == 0 && deliveryCost != 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入都大于0的金额或都为0的金额',
      })
    } else if (freeDeliveryFee < 0 || deliveryCost < 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入都大于0的金额或都为0的金额',
      })
    } 
    else {
      wx.showLoading({
        title: '保存中...',
      })
      var para = { "shopId": wx.getStorageSync("chooseshopid"), 'deliveryCost': deliveryCost, 'freeDeliveryFee': freeDeliveryFee, 'minOrderFee': littlePrice }
      urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
        .then(res => {
          wx.showToast({
            icon: 'none',
            title: '保存成功',
          })
          wx.navigateBack({

          })
        })
    }
  }
})