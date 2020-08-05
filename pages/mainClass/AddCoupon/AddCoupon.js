// pages/mainClass/AddCoupon/AddCoupon.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()

var dateTimePicker = require('../../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    starttime: "",
    endtime: "",
    meetAmount: "",
    usedAmount: "",
    couponQuota: "",
    repeatCount: "",
    couponType: "shop",
    isChecked1: "no",
    isChecked2: "no",
    textareaAValue: '任性领劵，任性买',
    bg1: "bg-main-color",
    bg2: "bg-grey",
    productList: [],
    ids: [],
    dateTime1: null,
    dateTimeArray1: null,
    dateTime2: null,
    dateTimeArray2: null,
    startYear: 2019,
    endYear: 2050,
    limitTime: "",
    time1: "",
    spec:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var myDate = new Date(); //获取系统当前时间
    // this.data.starttime = this.getNowFormatDate()
    // this.data.endtime = this.getNowFormatDate()
    // this.setData({
    //   starttime: this.data.starttime,
    //   endtime: this.data.endtime
    // })
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.splice(3, 3);
    var lastTime = obj1.dateTime.splice(3, 3);
    // this.data.starttime = obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]] + "-" + obj1.dateTimeArray[2][obj1.dateTime[2]] + " " + obj1.dateTimeArray[3][obj1.dateTime[3]] + ":00:00"

    this.data.starttime = obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]] + "-" + obj1.dateTimeArray[2][obj1.dateTime[2]]

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      time1: this.data.starttime
    });



    console.log(dateTimePicker.getMonthDay(obj1.dateTimeArray[0][obj1.dateTime[0]], obj1.dateTimeArray[1][obj1.dateTime[1]]))

    if (obj1.dateTime[2] + 1 >= dateTimePicker.getMonthDay(obj1.dateTimeArray[0][obj1.dateTime[0]], obj1.dateTimeArray[1][obj1.dateTime[1]]).length) {
      obj1.dateTime[1] = obj1.dateTime[1] + 1
      obj1.dateTime[2] = 0
    } else {
      obj1.dateTime[2] = obj1.dateTime[2] + 1
    }
    // obj1.dateTime[3] = 0

    // this.data.endtime = obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]] + "-" + obj1.dateTimeArray[2][obj1.dateTime[2]] + " " + obj1.dateTimeArray[3][obj1.dateTime[3]] + ":00:00"
    this.data.endtime = obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]] + "-" + obj1.dateTimeArray[2][obj1.dateTime[2]]

    this.data.limitTime = this.data.endtime
    console.log("开始时间", this.data.starttime)
    console.log("结束时间", this.data.endtime)

    this.setData({
      dateTime2: obj1.dateTime,
      dateTimeArray2: obj1.dateTimeArray
    });
  },

  //开始时间
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value,
      starttime: this.data.dateTimeArray1[0][this.data.dateTime1[0]] + "-" + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + "-" + this.data.dateTimeArray1[2][this.data.dateTime1[2]]
      //  + " " + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ":00:00"
    })

    console.log("开始时间", this.data.starttime)
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    var lastArray = dateArr.splice(3, 3);
    var lastTime = arr.splice(3, 3);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });

  },
  //结束时间
  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value,
      endtime: this.data.dateTimeArray2[0][this.data.dateTime2[0]] + "-" + this.data.dateTimeArray2[1][this.data.dateTime2[1]] + "-" + this.data.dateTimeArray2[2][this.data.dateTime2[2]]
      //  + " " + this.data.dateTimeArray2[3][this.data.dateTime2[3]] + ":00:00"
    })

    console.log("结束时间", this.data.endtime)
  },

  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    var lastArray = dateArr.splice(3, 3);
    var lastTime = arr.splice(3, 3);
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr
    });

  },






  // startTimeChange: function(e) {
  //   console.log(e)
  //   this.setData({
  //     starttime: e.detail.value
  //   })
  // },

  // endTimeChange: function(e) {
  //   console.log(e)
  //   this.setData({
  //     endtime: e.detail.value
  //   })
  // },
  //全部商品
  btn1: function() {
    this.data.couponType = "shop"
    this.setData({
      bg1: "bg-main-color",
      bg2: "bg-grey"
    })
  },
  //限定商品
  btn2: function() {
    this.data.couponType = "goods"
    this.setData({
      bg1: "bg-grey",
      bg2: "bg-main-color"
    })

    wx.navigateTo({
      url: '/pages/StoreManager/ProChooseList2/ProChooseList2',
    })
  },

  //劵的面额
  inputCouponMoney: function(e) {
    this.setData({
      usedAmount: e.detail.value
    })
  },
  //使用劵的条件  达到多少钱使用
  inputCouponOrderMoney: function(e) {
    this.setData({
      meetAmount: e.detail.value
    })
  },

  couponIntroduct:function(e){
    this.setData({
      spec: e.detail.value
    })
  },

  //劵的库存
  inputCouponNum: function(e) {
    this.setData({
      couponQuota: e.detail.value
    })
  },

  //每人限领
  inputCouponConfine: function(e) {
    this.setData({
      repeatCount: e.detail.value
    })
  },

  //分享方案 ==优惠劵标题
  textareaAInput: function(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  //展示已领完的劵
  switch1Change: function(e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        isChecked1: "yes"
      })
    } else {
      this.setData({
        isChecked1: "no"
      })
    }
  },

  //支持加入微信卡包
  switch2Change: function(e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        isChecked2: "yes"
      })
    } else {
      this.setData({
        isChecked2: "no"
      })
    }

  },

  isNumber: function(val) {
    var  regPos = /^\d+(\.\d+)?$/;  //非负浮点数
    var  regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;  //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return  true;
    } 
    else  {        
      return  false; 
    }  
  },


  //比较日前大小  
  compareDate: function(checkStartDate, checkEndDate) {
    var arys1 = new Array();
    var arys2 = new Array();
    if (checkStartDate != null && checkEndDate != null) {
      arys1 = checkStartDate.split('-');
      var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
      arys2 = checkEndDate.split('-');
      var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
      if (sdate > edate) {

        return false;
      } else {
        return true;
      }
    }
  },


  toAddCoupon: function(e) {
    if (!this.data.usedAmount) {
      wx.showToast({
        icon: 'none',
        title: '请输入劵的面额',
      })
      return
    }


    if (!this.data.meetAmount) {
      wx.showToast({
        icon: 'none',
        title: '请输入劵的使用条件',
      })
      return
    }


    if (!this.isNumber(this.data.usedAmount)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的券面金额',
      })
      return
    }

    if (!this.isNumber(this.data.meetAmount)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的使用条件金额',
      })
      return
    }

    if (parseFloat(this.data.meetAmount) <= parseFloat(this.data.usedAmount)) {
      wx.showToast({
        icon: 'none',
        title: '劵的使用条件必须大于券的面额',
      })
      return
    }

    if (this.data.couponType == "goods") {
      if (app.globalData.couponProductList.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择限定使用的商品类型或商品',
        })
        return
      }
    }


    if (!this.data.couponQuota) {
      wx.showToast({
        icon: 'none',
        title: '请输入劵的库存',
      })
      return
    }

    if (!this.data.repeatCount) {
      wx.showToast({
        icon: 'none',
        title: '请输入第人限领取的劵数',
      })
      return
    }

    if ((this.data.couponQuota - this.data.repeatCount)<0) {
      wx.showToast({
        icon: 'none',
        title: '限领券数不能大于券的库存',
      })
      return
    }

    if (!this.data.starttime) {
      wx.showToast({
        icon: 'none',
        title: '请选择开始时间',
      })
      return
    }

    if (!this.data.endtime) {
      wx.showToast({
        icon: 'none',
        title: '请选择结束时间',
      })
      return
    }

    var st = new Date(this.data.starttime).getTime()
    console.log(st)
    var et = new Date(this.data.endtime).getTime()
    console.log(et)
    if (et - st < 0) {
      wx.showToast({
        icon: 'none',
        title: '结束时间不能小于开始时间',
      })
      return
    }

    if (et - st == 0) {
      wx.showToast({
        icon: 'none',
        title: '结束时间不能和开始时间一致',
      })
      return
    }

    console.log(this.data.time1)
    if (!this.compareDate(this.data.time1, this.data.starttime)) {
      wx.showToast({
        icon: 'none',
        title: '开始时间不能小于当前时间',
      })
      return
    }

    if (this.data.textareaAValue.length > 12) {
      wx.showToast({
        icon: 'none',
        title: '分享方案字数超过限制',
      })
      return
    }

    wx.showLoading({
      title: '加载中',
    })
    this.addCouponData()
  },

  //添加优惠劵
  addCouponData: function() {
    let that = this
    urlApi.getInfo(rootUrls.addCoupon, {
        'usedShopId': wx.getStorageSync("chooseshopid"), //商户id
        'meetAmount': that.data.meetAmount * 100, //使用条件
        'usedAmount': that.data.usedAmount * 100, //券面额
        'couponQuota': that.data.couponQuota, //库存
        'repeatCount': that.data.repeatCount, //单人可领取数量
        'validStartTime': that.data.starttime + " 00:00:00", //使用开始时间
        'validEndTime': that.data.endtime + " 00:00:00", //使用结束时间
        'couponType': that.data.couponType, //优惠券类型 shop店铺券，goods商品券
        'title': that.data.textareaAValue,
        'showTakeOut': that.data.isChecked1,
        'weixinCardPackage': that.data.isChecked2,
        'lists': app.globalData.couponProductList,
        'spec': that.data.spec
        // 'goodsIdArray': that.data.ids, //商品id
        // 'categoryIdArray': app.globalData.caterIdlist
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate: function() {
    var date = new Date()
    var seperator1 = "-"
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.ids = []
    for (var i = 0; i < app.globalData.limitProduct.length; i++) {
      this.data.ids[i] = app.globalData.limitProduct[i].id
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.globalData.limitProduct = []
    app.globalData.caterIdlist = []
    app.globalData.couponProductList = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})