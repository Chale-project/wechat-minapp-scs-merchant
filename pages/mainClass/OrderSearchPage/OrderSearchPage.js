// pages/mainClass/OrderSearchPage/OrderSearchPage.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    page: 1,
    dataList: [],
    state: '',
    dateTime: "",
    date: '',
    isClear: true,
    isChooseOther: true,
    peoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.data.text = options.text
    // this.data.state = options.state
    // this.setData({
    //   textValue: this.data.text
    // })
    // wx.showLoading()
    // this.getSearchOrder()
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var lastTime = obj1.dateTime.splice(3, 3);
    this.setData({
      date: obj1.dateTimeArray[0][obj1.dateTime[0]] + "-" + obj1.dateTimeArray[1][obj1.dateTime[1]] + "-" + obj1.dateTimeArray[2][obj1.dateTime[2]]
    })
  },

  //订单详情
  toOrderDetail: function(e) {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager1') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    var id = e.currentTarget.dataset.item
    console.log(id)
    wx.navigateTo({
      url: '/pages/mainClass/OrderDetail/OrderDetail?id=' + id,
    })
  },

  DateChange(e) {

    this.setData({
      isClear: false,
      date: e.detail.value
    })

    wx.showLoading()
    this.data.page = 1
    wx.showLoading()
    this.getSearchOrder()
  },

  // 输入框输入内容时 清空内容
  searchnameinput: function(e) {
    this.data.text = e.detail.value
  },
  // 点击输入搜索
  searchbutton: function() {

    wx.showLoading()
    this.data.page = 1
    wx.showLoading()
    this.getSearchOrder()
  },

  clearTime: function() {
    this.setData({
      isClear: true
    })

    wx.showLoading()
    this.data.page = 1
    wx.showLoading()
    this.getSearchOrder()
  },


  getSearchOrder: function() {
    let that = this
    var time = ''
    if (!that.data.isClear) {
      time = that.data.date
    }
    urlApi.getInfo(rootUrls.searchOrder, {
        'currentPage': that.data.page,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'goodsTitle': that.data.text,
          'state': that.data.state,
          'startTime': time,
          'endTime': time
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log(res)
        if (that.data.page == 1) {
          that.data.dataList1 = []
        }
        for (let i = 0; i < res.page.list.length; i++) {
          res.page.list[i].goodsPrice = urlApi.fen2Yuan(res.page.list[i].goodsPrice)
          res.page.list[i].payment = urlApi.fen2Yuan(res.page.list[i].payment)
          if (res.page.list[i].state == "waitSending" && res.page.list[i].deliveryType == "home") {
            res.page.list[i].isShowSend = false
          } else {
            res.page.list[i].isShowSend = true;
          }

          if (res.page.list[i].state == "waitReceiving" && res.page.list[i].deliveryType == "home") {
            res.page.list[i].isShowArrived = false
          } else {
            res.page.list[i].isShowArrived = true;
          }

          if (res.page.list[i].state == "waitReceiving" && res.page.list[i].deliveryType == "shop") {
            res.page.list[i].isShowOver = false
          } else {
            res.page.list[i].isShowOver = true;
          }

          for (let j = 0; j < res.page.list[i].orderDescModelList.length; j++) {
            res.page.list[i].orderDescModelList[j].price = urlApi.fen2Yuan(res.page.list[i].orderDescModelList[j].price)
          }
        }

        that.data.dataList1 = that.data.dataList1.concat(res.page.list)
        that.setData({
          dataList: that.data.dataList1
        })
      })
  },

  onClose: function() {
    this.setData({
      'isShowSend': false
    })
  },

  hideModal(e) {
    this.setData({
      'isShowSend': false,
      'isShowTiHuo': false,
      modalName: ''
    })
  },

  //完成提货
  pickGoods: function (e) {
    this.data.id = e.currentTarget.dataset.item
    console.log(this.data.id)

    this.setData({
      modalName: 'show'
    })
  },



  getAll: function () {
    wx.showLoading()
    this.pickGoodsData()
  },

  //完成提货
  pickGoodsData: function () {
    let that = this
    urlApi.getInfo(rootUrls.pickGoods + that.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {

          wx.redirectTo({
            url: '/pages/mainClass/GetSuccess/GetSuccess',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },

  arrivedGoods:function(e){
    this.data.id = e.currentTarget.dataset.item
    wx.showLoading()
    this.arrivdProductOut()
  },


  //发货
  toSend: function(e) {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager2') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }

    this.data.id = e.currentTarget.dataset.item
    console.log(this.data.id)

    this.getDeliveryMan()
    
  },



  //查询送货员列表和上次配送人信息
  getDeliveryMan: function () {
    let that = this
    urlApi.getInfo(rootUrls.deliveryman + wx.getStorageSync("chooseshopid"), {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          for (var i = 0; i < res.result.deliverymanList.length; i++) {
            res.result.deliverymanList[i].chooseState = false
          }

          var json = {
            "addDataTime": null,
            "modifyDataTime": null,
            "deliverymanName": "其它",
            "deliverymanPhone": "",
            "deliverymanType": "",
            "name": ""
          }
          res.result.deliverymanList.push(json)

          this.setData({
            peoList: res.result.deliverymanList,
            'isShowSend': true
          })

        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //选择配送人员
  chooseThis: function (e) {
    var pos = e.currentTarget.dataset.index
    if (this.data.peoList[pos].chooseState) {
      this.data.peoList[pos].chooseState = false
      this.data.name = ""
      this.data.phone = ""
    } else {
      for (var i = 0; i < this.data.peoList.length; i++) {
        this.data.peoList[i].chooseState = false
      }
      this.data.peoList[pos].chooseState = true
      this.data.name = this.data.peoList[pos].deliverymanName
      this.data.phone = this.data.peoList[pos].deliverymanPhone
    }

    if (this.data.peoList[pos].deliverymanName == "其它") {
      this.data.name = this.data.peoList[pos].name
      this.setData({
        isChooseOther: !this.data.peoList[pos].chooseState
      })
    } else {
      this.setData({
        isChooseOther: true
      })
    }

    this.setData({
      peoList: this.data.peoList
    })
  },



  inputDeliveryMan: function(e) {
    this.data.name = e.detail.value
  },

  inputDeliveryPhone: function(e) {
    this.data.phone = e.detail.value
  },
  //点击确定发货
  makeSureSend: function() {
    if (!this.data.name) {
      wx.showToast({
        icon: 'none',
        title: '请输入配送人姓名',
      })
      return
    }
    if (!this.data.phone) {
      wx.showToast({
        icon: 'none',
        title: '请输入配送人手机号',
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '输入的手机号有误',
      })
      return;
    }


    wx.showLoading()
    this.sendProductOut()
  },


  //发货
  sendProductOut: function() {
    urlApi.getInfo(rootUrls.sendProductOut, {
        'deliveryman': this.data.name,
        'deliverymanPhone': this.data.phone,
        'id': this.data.id
      }, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        this.setData({
          'isShowSend': false
        })
        if (res.code == 0) {
          this.data.page = 1
          this.getSearchOrder()
          wx.showToast({
            icon: 'none',
            title: '发货成功',
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //已送达
  arrivdProductOut: function () {
    urlApi.getInfo(rootUrls.orderArrived + this.data.id, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            icon: 'none',
            title: '已送达'
          })
          this.data.page = 1
          this.getSearchOrder()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //查看取货码
  showCode: function (e) {
    this.setData({
      showVerificationCode: 'show',
      verificationCode: e.currentTarget.dataset.item
    })
  },
  hideModal1: function () {
    this.setData({
      showVerificationCode: ''
    })
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
    wx.showLoading()
    this.data.page = 1
    this.data.dataList = []

    wx.showLoading()
    this.getSearchOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++
      wx.showLoading()
    this.getSearchOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})