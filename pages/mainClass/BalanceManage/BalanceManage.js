// pages/mainClass/BalanceManage/BalanceManage.js

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
    page1: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    console.log(obj1)
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.splice(2, 4);
    console.log(obj1.dateTimeArray)
    var lastTime = obj1.dateTime.splice(2, 4);
    console.log(obj1.dateTime)
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      month: obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]]
    });


    wx.showLoading()
    this.getMoneyManage()
  },
  getMoneyManage: function (couponStatus) {
    let that = this
    urlApi.getInfo(rootUrls.balanceDetail, {
      "currentPage": that.data.page1,
      "pageSize": "10",
      "where": {
        'shopId': wx.getStorageSync("chooseshopid"), //商户id
        'startTime': that.data.month + "-01",
        'endTime': that.data.month + "-31"
      }
    }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log('余额', res)
        if (res.code == 0) {
          if (that.data.page1 == 1) {
            that.data.dataList = []
          }
          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].money = urlApi.fen2Yuan(res.page.list[i].money)
          }
          that.data.dataList = that.data.dataList.concat(res.page.list)
          that.setData({
            dataList: that.data.dataList,
            shopGetMoney: urlApi.fen2Yuan(res.page.where.money)
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
    8
    console.log(this.data.dateTime1)
    console.log(this.data.dateTime1)

    // 精确到分的处理，将数组的秒去掉
    var lastArray = dateArr.splice(2, 4);
    var lastTime = arr.splice(2, 4);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });

  },


  //选择月份
  chooseMontyTap: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page1 = 1
    this.data.dataList = []
    wx.showLoading()
    this.getMoneyManage()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page1++
    wx.showLoading()
    this.getMoneyManage()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})