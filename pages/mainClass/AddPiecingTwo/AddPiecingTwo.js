// pages/mainClass/AddPiecingTwo/AddPiecingTwo.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPickerShow: false,
    startTime: "请选择开始时间",
    pickerConfig: {
      endDate: false,
      column: "minute"
    },
    endTime: "请选择结束时间",
    isStartTime: true,
    dataList: [],
    dataListNormal: [],
    id: '',
    coverImage: "",
    price: '',
    dataJson: {},
    isLimit: false
  },
  setPickerTime: function(val) {
    let data = val.detail;
    if (this.data.isStartTime) {
      this.data.dataJson.startTime = data.startTime
      this.setData({
        startTime: data.startTime
      });
    } else {
      this.data.dataJson.endTime = data.startTime
      this.setData({
        endTime: data.startTime
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.dataListNormal = app.globalData.groupList
    this.data.dataList = this.data.dataListNormal

    this.data.dataJson = {
      "endTime": "",
      "goodsGroupDescModels": [],
      "goodsId": this.data.dataList[0].goodsId,
      "groupNum": 0,
      "groupPeopleCount": 0,
      "groupPrice": 0,
      "groupTime": 0,
      "limitation": 0,
      "startTime": ""
    }

    this.setData({
      id: this.data.dataList[0].goodsId,
      title: this.data.dataList[0].title,
      coverImage: this.data.dataList[0].itemImages,
      price: this.data.dataList[0].groupPrice
    })
  },

  addGroupList: function() {
    if (!this.data.dataList[0].hasStyle) {
      //无规格
      this.data.dataJson.groupPrice = parseInt(this.data.dataList[0].groupPrice * 100)
      this.data.dataJson.groupNum = this.data.dataList[0].groupStock
    } else {
      //多规格
      this.data.dataJson.goodsGroupDescModels = []
      for (let i = 0; i < this.data.dataList.length; i++) {
        if (this.data.dataList[i].groupNum == "" || this.data.dataList[i].groupPrice == ""){
          continue
        }
        var json = {
          "goodsDescId": this.data.dataList[i].id,
          "groupNum": this.data.dataList[i].groupStock,
          "groupPrice": parseInt(this.data.dataList[i].groupPrice * 100)
        }
        this.data.dataJson.goodsGroupDescModels.push(json)
      }
    }
    console.log('提交数据===', this.data.dataJson)
    urlApi.getInfo(rootUrls.addPiching, this.data.dataJson, "POST")
      .then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.code == 0) {
          wx.navigateBack({
            delta: 2
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  chooseStartTime: function() {
    console.log("点击开始时间")
    this.setData({
      isPickerShow: true,
      isStartTime: true
    });
  },

  chooseEndTime: function() {
    console.log("点击结束时间")
    this.setData({
      isPickerShow: true,
      isStartTime: false
    });
  },

  pickerHide: function() {
    this.setData({
      isPickerShow: false
    });
  },

  //成团人数
  groupPeopleNum: function(e) {
    console.log(e.detail.value)
    this.data.dataJson.groupPeopleCount = e.detail.value
  },

  //成团时间
  groupNeedTime: function(e) {
    console.log(e.detail.value)
    this.data.dataJson.groupTime = e.detail.value
  },

  //是否限购
  switchChange: function(e) {
    this.setData({
      isLimit: e.detail.value
    })
  },

  //限购数量
  groupLimitNum: function(e) {
    console.log(e.detail.value)
    this.data.dataJson.limitation = e.detail.value
  },

  //添加拼团活动
  saveGroup: function() {
    if (!this.data.dataJson.groupPeopleCount || this.data.dataJson.groupPeopleCount <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入成团人数',
      })
      return
    }

    if (!this.data.dataJson.startTime) {
      wx.showToast({
        icon: 'none',
        title: '请选择开始时间',
      })
      return
    }

    if (!this.data.dataJson.endTime) {
      wx.showToast({
        icon: 'none',
        title: '请选择结束时间',
      })
      return
    }

    if (!this.data.dataJson.groupTime) {
      wx.showToast({
        icon: 'none',
        title: '请输入成团时间',
      })
      return
    }

    if (!this.data.isLimit) {
      this.data.dataJson.limitation = 0
    } else {
      if (!this.data.dataJson.limitation) {
        wx.showToast({
          icon: 'none',
          title: '请输入限购数量',
        })
        return
      }
    }
    wx.showLoading()
    this.addGroupList()
  },

  //显示规格编辑
  showGropuDetail: function() {
    app.globalData.groupList = this.data.dataList
    this.setData({
      modalName: 'show',
      productName: this.data.dataList[0].title,
      dataListProduct: this.data.dataList
    })
  },
  //编辑拼团价
  getGroupPrice: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.dataList[pos].groupPrice = e.detail.value
  },
  //编辑库存
  getStock: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.dataList[pos].groupStock = e.detail.value
  },

  hideModal: function() {
    this.data.dataList = this.data.dataListNormal
    this.setData({
      modalName: ''
    })
  },

  sureChange: function() {
    this.data.dataListNormal = this.data.dataList
    this.setData({
      modalName: '',
      id: this.data.dataList[0].goodsId,
      title: this.data.dataList[0].title,
      coverImage: this.data.dataList[0].itemImages,
      price: this.data.dataList[0].groupPrice
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

  }
})