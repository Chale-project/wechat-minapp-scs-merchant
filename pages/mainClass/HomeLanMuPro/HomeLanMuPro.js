// pages/mainClass/HomeLanMuPro/HomeLanMuPro.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeighth: 0,
    subjectlistdata: '',
    subjectsId: '',
    pageNumber: 1,
    subjectscrollviewLoader: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取已选商品列表
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight,
      subjectsId: options.subjectsId
    })
  },
  onShow: function () {
    this.data.pageNumber = 1
    this.gethomesubjectProlistdata()
  },
  gethomesubjectProlistdata: function () {
    var para = { 'currentPage': this.data.pageNumber, 'pageSize': 10, 'where': { 'subjectsId': this.data.subjectsId,'shopId': wx.getStorageSync("chooseshopid") } }
    console.log('para', para)
    urlApi.getInfo(rootUrls.homesubjectproUrl, para, "post")
      .then(res => {
        console.log('homelist', res)
        
        if (this.data.pageNumber == 1) {
          var temparr = []
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.goodsPrice = urlApi.fen2Yuan(pro.goodsPrice)
            temparr.push(pro)
          }
          this.setData({
            subjectlistdata: temparr,
          })
        } else {
          var temparr = this.data.subjectlistdata
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.goodsPrice = urlApi.fen2Yuan(pro.goodsPrice)
            temparr.push(pro)
          }
          this.setData({
            subjectlistdata: temparr,
            pageNumber: res.page.currentPage
          })
        }
        if(res.page.list.length<10){
          this.setData({
            subjectscrollviewLoader: false
          })
        }
      })
  },
  //上拉加载更多
  storescrolower: function () {
    this.setData({
      subjectscrollviewLoader: true
    })
    this.data.pageNumber++
    this.gethomesubjectProlistdata()
  },
  chooseprotap: function () {
    wx.navigateTo({
      url: '/pages/mainClass/HomeLanMuChoosePro/HomeLanMuChoosePro?subjectsId=' + this.data.subjectsId,
    })
  },
  //删除栏目商品
  closetap: function (e) {
    wx.showLoading({
      icon: 'none',
      title: '删除中',
    })
    let idx = e.currentTarget.dataset.idx
    let selid = this.data.subjectlistdata[idx].id
    urlApi.getInfo(rootUrls.homesubjectdeletegoodsUrl + selid, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        this.data.pageNumber = 1
        this.gethomesubjectProlistdata()
      })
  }
})