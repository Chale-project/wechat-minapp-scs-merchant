// pages/ShopsPower/ShopsAddSubAccount/ShopsAddSubAccount.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var verInputApi = require('../../../utils/rules.js')
var md5js = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphonetext: '',
    passwordtext: '',
    switchchecked: true,
    chooseRoleId: '',
    chooseRoleName: '',
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //姓名
  nametap: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号
  loginaccounttap: function (e) {
    this.setData({
      iphonetext:e.detail.value
    })
  },
  //填写密码
  setpasswordtap: function (e) {
    this.setData({
      passwordtext:e.detail.value
    })
  },
  //选择岗位
  chooosejobtap: function () {

  },
  savetap: function (){
    if (!this.data.name) {
      //输入姓名
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
    }
    else if (!verInputApi.checkPhoneNum(this.data.iphonetext)) {
      //手机号不正确
    } else if (this.data.passwordtext.length < 6){
      wx.showToast({
        icon: 'none',
        title: '请填写6-16位密码',
      })
    } else if (!this.data.chooseRoleId){
      wx.showToast({
        icon: 'none',
        title: '请选择岗位',
      })
    }
    else{
      wx.showLoading({
        title: '保存中...',
      })
      let para = { "shopId": wx.getStorageSync("chooseshopid"),'shopOperatorName':this.data.name, 'userMobilePhone': this.data.iphonetext, 'operatorLoginPwd': md5js.md5(this.data.passwordtext), 'roleIdList': [this.data.chooseRoleId], 'sendMessage': this.data.switchchecked ? 'enabled' :'disabled'}
      urlApi.getInfo(rootUrls.addcuropraterUrl, para, "post")
        .then(res => {
          wx.hideLoading()
          wx.navigateBack({
          })
        })
    }
    
  },
  choosejobtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsJobManager/ShopsJobManager?ischoosejob='+'true',
    })
  },
  //是否接收店铺消息
  onSwitchChange: function (event) {
    this.setData({
      switchchecked: event.detail
    })
  },
})