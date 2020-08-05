// pages/mainClass/GoShopGet/GoShopGet.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var verInputApi = require('../../../utils/rules.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekdata: [],
    timeOneArr: [],//0-23
    timeTwoArr: [],//00-59:0-5:0-9
    multiArray: [],
    multiIndex: [0, 0, 0, 0, 0],
    currentaddress: {},
    shencity:"",
    addressdetail:"",
    shopnameStr:"",
    phonenumber:"",
    inputdetailaddress:"",
    hourdata:"08:00--18:00",
    addressshow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopinfodetail = wx.getStorageSync('shopinfodetail')

    if (shopinfodetail.selfpickRuleFlag=='true'){
      var selweekdata = [{ "name": "周一", "select": false }, { "name": "周二", "select": false }, { "name": "周三", "select": false }, { "name": "周四", "select": false }, { "name": "周五", "select": false }, { "name": "周六", "select": false }, { "name": "周日", "select": false }]
      var englishday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      var weektemarr = shopinfodetail.selfpickRule.businessDate
      var businessHours = shopinfodetail.selfpickRule.businessHours
      //以逗号分隔
      var hourarr = businessHours.split(",")
      for (let i = 0; i < englishday.length;i++){
        for (let j = 0; j < weektemarr.length; j++) {
          var today = englishday[i]
          var temday = weektemarr[j]
          if(today == temday){
            selweekdata[i].select = true
          }
        }
      }
      this.setData({
        shopnameStr: shopinfodetail.selfpickRule.selfpickName,
        inputdetailaddress: shopinfodetail.selfpickRule.shopAddress,
        phonenumber: shopinfodetail.selfpickRule.phoneNumber,
        weekdata: selweekdata,
        hourdata: hourarr[0].toString() + '--' + hourarr[1].toString(),
        currentaddress: { 'latitude': shopinfodetail.selfpickRule.shopLatitude, 'longitude': shopinfodetail.selfpickRule.shopLongitude}
    })
    }else{
      //初始化数据
      this.setData({
        weekdata: [{ "name": "周一", "select": true }, { "name": "周二", "select": true }, { "name": "周三", "select": true }, { "name": "周四", "select": true }, { "name": "周五", "select": true }, { "name": "周六", "select": false }, { "name": "周日", "select": false }]
      })
    }
    //00-23
    for (var i = 0; i < 3; i++) {
      if(i==2){
        for (var j = 0; j < 4; j++) {
          this.data.timeOneArr.push(i.toString() + j.toString())
        }
      }else{
        for (var j = 0; j < 10; j++) {
          this.data.timeOneArr.push(i.toString() + j.toString())
        }
      }
    }
    //00-59
    for (var a = 0; a < 6; a++) {
      for (var b = 0; b < 10; b++) {
        this.data.timeTwoArr.push(a.toString() + b.toString())
      }
    }
    var temparr = [this.data.timeOneArr, this.data.timeTwoArr, ["--"], this.data.timeOneArr, this.data.timeTwoArr]
    this.setData({
      multiArray: temparr
    })
  },
  weekdaytap: function (e) {
    var idx = e.currentTarget.dataset.idx
    //记录当前选中状态
    var temweekdata = this.data.weekdata
    temweekdata[idx].select = !temweekdata[idx].select
    this.setData({
      weekdata:temweekdata
    })
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    var temparr = e.detail.value
    var one = this.data.multiArray[0][temparr[0]].toString()
    var two = this.data.multiArray[1][temparr[1]].toString()
    var three = this.data.multiArray[3][temparr[3]].toString()
    var four = this.data.multiArray[4][temparr[4]].toString()
    var five = one+':'+two+'--'+three+':'+four
    this.setData({
      multiIndex: e.detail.value,
      hourdata: five
    })
  },
  inputnametap: function (e) {
    this.setData({
      shopnameStr: e.detail.value
    })
  },
  //获取地址
  getlocationwithmap: function () {
    let that = this
    that.chooseadressfun()
  },
  chooseadressfun: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          currentaddress: res,
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
  addressdetailinput: function (e) {
    this.setData({
      inputdetailaddress: e.detail.value
    })
  },
  inputnumbertap: function (e) {
    this.setData({
      phonenumber: e.detail.value
    })
  },
  savebuttontap:function () {
    var temweekdata = this.data.weekdata
    var temptimearr = []
    var englishday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday']
    for (let i = 0; i < temweekdata.length; i++){
      if (temweekdata[i].select == true){
        //转化为monday 
        temptimearr.push(englishday[i])
      }
    }
    //营业时间
    var timehourarr = this.data.hourdata.split("--")
    var yingyetime = timehourarr[0] + ',' + timehourarr[1]
    if (this.data.shopnameStr.length<1){
      wx.showToast({
        icon: 'none',
        title: '请填写自提点',
      })
    }
    else if (!this.data.currentaddress.longitude) {
      console.log('选择区域', this.data.currentaddress)
      wx.showToast({
        icon: 'none',
        title: '请选择所在区域',
      })
    }
    else if (this.data.phonenumber.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请输入联系电话',
      })
    }
    else if (temptimearr.length<1){
      wx.showToast({
        icon: 'none',
        title: '请选择营业日期',
      })
    }
    else if (this.data.hourdata == '00--00') {
      wx.showToast({
        icon: 'none',
        title: '请选择营业时间',
      })
    }
    else{
      // if (verInputApi.checkPhoneNumtwo(this.data.inputname) || verInputApi.checkTeltwo(this.data.inputname)) {
        var para = { "shopId": wx.getStorageSync("chooseshopid"), "selfpickRuleModel": { 'businessDate': temptimearr, 'businessHours': yingyetime, 'phoneNumber': this.data.phonenumber, 'shopAddress': this.data.shencity + this.data.inputdetailaddress, "shopLatitude": this.data.currentaddress.latitude, "shopLongitude": this.data.currentaddress.longitude, 'selfpickName': this.data.shopnameStr } }
        this.completedata(para)
      // }
      // else {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '手机或座机号不正确',
      //   })
      // }
      
    }
  },
  completedata: function (para) {
    console.log(1,para)
    urlApi.getInfo(rootUrls.jiaoyishezhi, para, "post")
      .then(res => {
        wx.navigateBack({

        })
      })
  }
})