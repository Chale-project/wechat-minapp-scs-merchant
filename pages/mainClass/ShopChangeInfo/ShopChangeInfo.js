// pages/mainClass/ShopChangeInfo/ShopChangeInfo.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var verInputApi = require('../../../utils/rules.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placename:"请填写店铺名称",
    inputname:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      placename: "请填写" + options.placename
    })
    if (options.name && options.name!='null'){
      this.setData({
        inputname: options.name
      })
    }
    wx.setNavigationBarTitle({
      title: '修改' + options.placename
    })
  },
  inputnametap: function (e) {
    console.log('input',e)
    this.setData({
      inputname: e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    console.log('textarea',e)
    this.setData({
      inputname: e.detail.value
    })
  },
  sureChangeTap: function () {
    if(this.data.inputname.length<1){
      wx.showToast({
        icon:'none',
        title: '输入内容不能为空',
      })
    }else{
      if (this.data.placename == "请填写店铺名称") {
        this.modifydata('shopName', this.data.inputname)
      } else if (this.data.placename == "请填写公告信息"){
        this.modifydata('shopNotice', this.data.inputname)
      } else if (this.data.placename == "请填写店铺地址") {
        this.modifydata('shopAddress', this.data.inputname)
      } else if (this.data.placename == "请填写客服电话") {
        // if (!verInputApi.checkPhoneNumtwo(this.data.inputname) &&!verInputApi.checkTeltwo(this.data.inputname)) {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '手机或座机号不正确',
        //   })
        // }
        // else{
          this.modifydata('phoneNumber', this.data.inputname)
        // }
      } else if (this.data.placename == "请填写法人") {
        this.modifydata('legalPersom', this.data.inputname)
      } else if (this.data.placename == "请填写手机号") {
        if (verInputApi.checkPhoneNum(this.data.inputname)) {
          this.modifydata('legalPhoneNumber', this.data.inputname)
        }
      }
    }
    
  },
  modifydata: function (name,value) {
    var para = { "shopId": wx.getStorageSync("chooseshopid"), [name]: value}
    console.log(para)
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        console.log(1, res)
        if (name == "shopName"){
          wx.setStorageSync('shopName', value)
        }
        wx.navigateBack({
        })
      })
  }
})