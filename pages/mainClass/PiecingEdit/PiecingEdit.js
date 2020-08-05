// pages/mainClass/PiecingEdit/PiecingEdit.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPickerShow: false,
    startTime: "",
    pickerConfig: {
      endDate: false,
      column: "minute"
    },
    endTime: "",
    isStartTime: true,
    dataJson:{}
  },

  setPickerTime: function(val) {
    let data = val.detail;
    if (this.data.isStartTime) {
      this.setData({
        startTime: data.startTime
      });
    } else {
      this.setData({
        endTime: data.startTime
      });
    }
  },

  showGropuDetail: function(){
    wx.navigateTo({
      url: '/pages/mainClass/PiecingEditTwo/PiecingEditTwo?id=' + this.data.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getGroupDetail()
  },


  //获取拼团详情
  getGroupDetail: function () {
    let that = this
    urlApi.getInfo(rootUrls.pichingGoodsDetail + "/" + this.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log('详情', res)
        if (res.code == 0) {
          that.setData({
            coverImage: res.info.coverImage,
            title:res.info.title,
            groupPrice: urlApi.fen2Yuan(res.info.groupPrice),
            peopleNum: res.info.groupPeopleCount,
            startTime: res.info.startTime,
            endTime: res.info.endTime,
            groupTime: res.info.groupTime,
            limitation: res.info.limitation,
          })

          if(res.info.limitation>0){
            that.setData({
              isCheck:true
            })
          }

        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },

  // chooseStartTime: function() {
  //   console.log("点击开始时间")
  //   this.setData({
  //     isPickerShow: true,
  //     isStartTime: true
  //   });
  // },

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


  saveprotap: function(){
    wx.showLoading()
    this.modifyGroupList()
  },


  modifyGroupList: function () {
    this.data.dataJson = {
      "endTime": this.data.endTime,
      "id": this.data.id,
      "goodsGroupDescModels": app.globalData.groupEditSize
    }
    console.log('提交数据===', this.data.dataJson)
    urlApi.getInfo(rootUrls.modifyGroup, this.data.dataJson, "PUT")
      .then(res => {
        console.log(res)
        wx.hideLoading()
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