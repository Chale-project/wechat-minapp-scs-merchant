var dateTimePicker = require('../../../utils/dateTimePicker.js');
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    dateTime1: null,
    dateTimeArray1: null,
    startYear: 2019,
    endYear: 2050,
    month: "",
    month2: "",
    page1: 1,
    isMonth: false,
    dateTime2: null,
    dateTimeArray2: null,
    source: "cashier",
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    console.log(obj1)
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.splice(2, 4);
    console.log(obj1.dateTimeArray)
    var lastTime = obj1.dateTime.splice(2, 4);
    console.log(obj1.dateTime)



    var lastArray2 = obj2.dateTimeArray.splice(3, 3);
    console.log(obj1.dateTimeArray)
    var lastTime2 = obj2.dateTime.splice(3, 3);


    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      month: obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]],
      dateTimeArray2: obj2.dateTimeArray,
      dateTime2: obj2.dateTime,
      month2: obj2.dateTimeArray[0][obj2.dateTime[0]] + "-" + obj2.dateTimeArray[1][obj2.dateTime[1]] + "-" + obj2.dateTimeArray[2][obj2.dateTime[2]]
    });


    wx.showLoading()
    this.getMoneyManage2()
  },

  changeDate: function() {
    this.setData({
      isMonth: !this.data.isMonth
    })

    wx.showLoading()
    this.data.page1 = 1
    if (this.data.page1 == 1) {
      this.data.dataList = []
    }
    if (this.data.isMonth) {
      this.getMoneyManage()
    } else {
      this.getMoneyManage2()
    }
  },

  onChange(event) {
    switch (event.detail.index) {
      case 0:
        this.data.source = "cashier"
        break
      case 1:
        this.data.source = "onlineOrder"
        break
      case 2:
        this.data.source = ""
        break
    }
    this.data.page1 = 1
    if (this.data.page1 == 1) {
      this.data.dataList = []
    }
    if (this.data.isMonth) {
      this.getMoneyManage()
    } else {
      this.getMoneyManage2()
    }
  },


  getMoneyManage: function(couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.getMoneyManage, {
        "currentPage": that.data.page1,
        "pageSize": "30",
        "where": {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'startTime': that.data.month + "-01",
          'endTime': that.data.month + "-31",
          'source': that.data.source
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log('资金', res)
        if (res.code == 0) {
          
          if (that.data.page1 == 1) {
            that.data.dataList = []
          }

          for (let i = 0; i < res.page.list.length;i++){
            res.page.list[i].journalAccount = urlApi.fen2Yuan(res.page.list[i].journalAccount)
          }

          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            totalCount: res.page.totalCount,
            dataList: that.data.dataList,
            shopGetMoney: urlApi.fen2Yuan(res.page.where.sum)
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  getMoneyManage2: function(couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.getMoneyManage, {
        "currentPage": that.data.page1,
        "pageSize": "30",
        "where": {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'startTime': that.data.month2,
          'endTime': that.data.month2,
          'source': that.data.source
        }
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log('资金', res)
        if (res.code == 0) {
          if (that.data.page1 == 1) {
            that.data.dataList = []
          }

          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].journalAccount = urlApi.fen2Yuan(res.page.list[i].journalAccount)
          }
          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            totalCount: res.page.totalCount,
            dataList: that.data.dataList,
            shopGetMoney: urlApi.fen2Yuan(res.page.where.sum)
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //开始时间
  changeDateTime1(e) {
    var time = e.detail.value

    this.setData({
      dateTime1: e.detail.value,
      month: this.data.dateTimeArray1[0][time[0]] + "-" + this.data.dateTimeArray1[1][time[1]]
    })

    this.data.page1 = 1
    this.data.dataList = []


    wx.showLoading()
    this.getMoneyManage()
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    console.log(this.data.dateTime1)

    // 精确到分的处理，将数组的秒去掉
    var lastArray = dateArr.splice(2, 4);
    var lastTime = arr.splice(2, 4);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });

  },



  //开始时间
  changeDateTime2(e) {
    var time = e.detail.value

    this.setData({
      dateTime2: e.detail.value,
      month2: this.data.dateTimeArray2[0][time[0]] + "-" + this.data.dateTimeArray2[1][time[1]] + "-" + this.data.dateTimeArray2[2][time[2]]
    })

    this.data.page1 = 1
    this.data.dataList = []
    wx.showLoading()
    this.getMoneyManage2()
  },

  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    console.log(this.data.dateTime2)

    // 精确到分的处理，将数组的秒去掉
    var lastArray = dateArr.splice(3, 3);
    var lastTime = arr.splice(3, 3);

    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr
    });

  },


  //选择月份
  chooseMontyTap: function() {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page1 = 1
    this.data.dataList = []
    wx.showLoading()
    if (this.data.isMonth) {
      this.getMoneyManage()
    } else {
      this.getMoneyManage2()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page1++
      wx.showLoading()
    if (this.data.isMonth) {
      this.getMoneyManage()
    } else {
      this.getMoneyManage2()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})