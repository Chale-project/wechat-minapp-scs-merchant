//index.js
//获取应用实例
const app = getApp()
// import {formatNumber}  "/utils/util.js"
//抽出域名
var urlApi = require('../../utils/util.js')
var rootUrls = require('../../utils/rootUrl.js')
var md5js = require('../../utils/md5.js')
var verInputApi = require('../../utils/rules.js')

Page({
  data: {
    choosetype: "password",
    isPassword: true,
    studentUserNumber: "",
    userIphone: "",
    userPassword: "",
  },
  onLoad: function() {

  },
  onShow: function() {
    // this.data.userPassword = ""
  },
  goToIndex: function() {
    //判断是否输入用户名和密码
    if (!this.data.userIphone) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      })
    } else if (this.data.userIphone.length < 11) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确',
      })
    } else if (!this.data.userPassword || this.data.userPassword.length < 6) {
      wx.showToast({
        icon: 'none',
        title: '请输入6-18位的密码',
      })
    } else {
      wx.showLoading({
        title: '正在登陆',
      })
      this.getUserToken()
    }
  },
  onCollectionTap: function() {
    var temptype = ""
    if (this.data.choosetype == "password") {
      temptype = "text"
    } else {
      temptype = "password"
    }
    this.setData({
      isPassword: !this.data.isPassword,
      choosetype: temptype
    })
  },

  // 获取用户名和密码
  inputPhone: function(e) {
    //判断是否输入合法手机格式
    if (e.detail.value.length > 10) {
      if (verInputApi.checkPhoneNum(e.detail.value)) {

        this.setData({
          userIphone: e.detail.value
        })
      }
    } else {
      this.setData({
        userIphone: e.detail.value
      })
    }
  },
  inputPass: function(e) {
    if (this.data.choosetype == "password") {
      //md5加密
      this.setData({
        userPassword: e.detail.value
      })
    }

  },
  inputPassord: function(e) {
    if (this.data.choosetype == "text") {
      this.setData({
        userPassword: e.detail.value
      })
    }
  },
  // 获取token
  getUserToken: function() {
    urlApi.getInfo(rootUrls.tokenUrl, {
        "userNumber": this.data.userIphone,
        "userSecret": md5js.md5(this.data.userPassword)
      }, "post")
      .then(res => {
        console.log('userNumber', this.data.userIphone, res)
        //存储用户相关信息
        wx.setStorageSync('shanguserNumber', this.data.userIphone)
        wx.setStorageSync('shanguserSecret', (this.data.userPassword))
        wx.setStorageSync('access_token', res.access_token)
        this.getUserOpenid()
      })
  },
  getUserOpenid: function() {
    let that = this
    wx.login({
      success: function(res) {
        // console.log('授权',res)
        if (res.code) {
          urlApi.getInfo(rootUrls.sessioncodeUrl + res.code, {}, "get")
            .then(res => {
              let rootopenid = res.result.userInfo.openid
              urlApi.getInfo(rootUrls.loginBandOpenidUrl + rootopenid, {}, "get")
                .then(res => {
                  console.log('bandopenid', res)
                  wx.setStorageSync('rootopenid', rootopenid)
                  wx.redirectTo({
                    url: '/pages/ChooseStore/ChooseStore?isFromLogin=' + true
                  })
                })
            })
        } else {
          wx.showToast({
            icon: 'none',
            title: '微信授权失败',
          })
        }
      }
    })
  },
  // 注册
  registerButtonTap: function() {
    wx.navigateTo({
      url: '/pages/mainClass/register/register?flag=' + 1
    })
  },
  //忘记密码
  forgetPass: function() {
    wx.navigateTo({
      url: '/pages/mainClass/register/register?flag=' + 2
    })
  }

})