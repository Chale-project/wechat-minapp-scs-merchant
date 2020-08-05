// pages/mainClass/register/register.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var md5js = require('../../../utils/md5.js')
var verInputApi = require('../../../utils/rules.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosetype: "password",
    isPassword: true,
    verTitle: "获取验证码",
    timer: "",//定时器名字
    countDownNum: "60",//倒计时初始值
    userIphone: "",
    currentVerCode: "",
    userPassword: "",
    flag:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      flag: options.flag
    })
    wx.setNavigationBarTitle({
      title: options.flag==1?'新用户注册':'重置密码'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onCollectionTap: function () {
    this.setData({
      isPassword: !this.data.isPassword,
      choosetype: this.data.choosetype === 'password' ? 'text' : 'password'
    })
  },
  inputPhone: function (e) {
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
  inputver: function (e) {
    this.setData({
      currentVerCode: e.detail.value
    })
  },
  inputPass: function (e) {
    if (this.data.choosetype == "password") {
      //md5加密
      this.setData({
        userPassword: e.detail.value
      })
    }

  },
  inputPassord: function (e) {
    if (this.data.choosetype == "text") {
      this.setData({
        userPassword: e.detail.value
      })
    }
  },
  verButtonTap: function () {
    if (this.data.userIphone.length < 11) {
      wx.showToast({
        icon: 'none',
        title: '检查手机号',
      })
    } else {
      if (this.data.countDownNum == 60) {
        //调用接口
        this.getVerCodeInfo()
        this.countDown()
      }
    }

  },
  // 获取验证码
  getVerCodeInfo: function () {
    var url = this.data.flag == 1 ? rootUrls.verCodeUrl : rootUrls.forgetCodeUrl
    console.log('code', url)
    urlApi.getInfo(url + this.data.userIphone,{}, "get")
      .then(res => {
        console.log(5, res)
        if (res.code == 0) {

        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
  countDown: function () {
    let that = this;

    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum,
          verTitle: "重新获取" + countDownNum + "s",
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum < 1) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          that.setData({
            countDownNum: "60",
            verTitle: "获取验证码"
          })
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },
  //注册
  goToIndex: function () {
    if (!this.data.userIphone) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      })
    }
    else if (this.data.userIphone.length < 11) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确',
      })
    } else if (!this.data.currentVerCode) {
      wx.showToast({
        icon: 'none',
        title: '请输验证码',
      })
    } else if (!this.data.userPassword||this.data.userPassword.length<6) {
      wx.showToast({
        icon: 'none',
        title: '请输入6-18位的密码',
      })
    }
    else {
      this.getRegisterInfo()
    }
  },
  //注册接口
  getRegisterInfo: function () {
    if(this.data.flag == 1){
      //注册
      this.registerUser()
    }
    else{
      var para = { "phoneNumber": this.data.userIphone, "smsCode": this.data.currentVerCode, "password": md5js.md5(this.data.userPassword) }
      this.startRegister(para, rootUrls.forgetUrl)
    }
    
  },
  //注册接口
  registerUser:function () {
    wx.showLoading({
      title: '正在注册',
    })
    let that = this
    wx.login({
      success: function (res) {
        console.log('授权',res)
        if (res.code) {
          console.log(1, res.code)
          urlApi.getInfo(rootUrls.sessioncodeUrl + res.code, {}, "get")
            .then(res => {
              console.log(res, 11)
              if (res.code == 0) {
                var para = { "phoneNumber": that.data.userIphone, "smsCode": that.data.currentVerCode, "password": md5js.md5(that.data.userPassword), "openid": res.result.userInfo.openid}
                that.startRegister(para, rootUrls.registerUrl)
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.msg,
                })
              }
            })
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '微信授权失败',
          })
        }
      }
    })
  },
  startRegister: function (para, url) {
    console.log('par',para)
    urlApi.getInfo(url, para, "post")
      .then(res => {
        console.log(6, res)
        if (res.code == 0) {
          wx.showToast({
            icon: 'none',
            title: '密码重置成功',
          })
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  }
})