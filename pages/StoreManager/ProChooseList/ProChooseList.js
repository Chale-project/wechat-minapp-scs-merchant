// pages/StoreManager/ProChooseList/ProChooseList.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secdata: [],
    recommen:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.recommen = options.recommen
  },
  onShow: function (options) {
    this.getcaterlist()
  },
  //获取分类列表
  getcaterlist: function () {
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.procaterlistUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        // 调用获取用户信息接口,用户信息存储在偏好
        console.log(1, res, 1)
        if (res.code == 0) {
          this.setData({
            secdata: res.list
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  //收起和展开分类
  shoutap: function (e) {
    var selectindex = e.currentTarget.dataset.idx
    var temparrlist = this.data.secdata
    if (temparrlist[selectindex].name == "未分类"){
      wx.navigateTo({
        url: '../CaterProList/CaterProList?procaterid=' + 'noCate' + '&recommen=' + this.data.recommen,
      })
    }else{
      if (temparrlist[selectindex].sublevels.length > 0) {
        //有子分类
        temparrlist[selectindex].showorhide = !temparrlist[selectindex].showorhide
        this.setData({
          secdata: temparrlist
        })
      } else {
        //无子分类
        wx.navigateTo({
          url: '../CaterProList/CaterProList?procaterid=' + temparrlist[selectindex].id + '&recommen=' + this.data.recommen,
        })
      }
    }
  },
  shousectap: function (e) {
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var temparrlist = this.data.secdata
      //无子分类
      wx.navigateTo({
        url: '../CaterProList/CaterProList?procaterid=' + temparrlist[idx].sublevels[idy].id + '&recommen=' + this.data.recommen,
      })
  }
})