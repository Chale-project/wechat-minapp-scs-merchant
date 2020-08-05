// pages/mainClass/ShopChooseProGuang/ShopChooseProGuang.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proshow:false,
    screenHeighth: 0,
    caterdata:[],
    topcaterdata:['所有商品','未分类'],
    salelistArr:[],//所有已上架的商品
    isRefreshing: false,
    pageNumber:1,
    searchtitle:'',
    chooseid:'',//已选中的id
    isonecatertap: false,
    choosename:'所有商品'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.prolistData()
  },
  // 获取所有商品数据
   prolistData: function () {
    if (this.data.isRefreshing) {
      return
    }
    this.data.isRefreshing = true
    var url = ''
    if (this.data.isonecatertap){
      url = rootUrls.onecaterallproUrl
    }else{
      url = rootUrls.goodslistUrl
    }
    console.log('shangpin',url)
//修改key的值
var para = { "shopId": wx.getStorageSync("chooseshopid"), "isMarketable": "put", "categoryId": this.data.chooseid, "title": this.data.searchtitle }
// isMarketable
urlApi.getInfo(url, { "currentPage": this.data.pageNumber, "pageSize": 10, "where": para }, "POST")
  .then(res => {
    this.data.isRefreshing = false
    wx.hideLoading()
    //pageNumber==1清空数组其余时候累加
    if (this.data.pageNumber == 1) {
      this.setData({
        salelistArr: res.page.list
      })
    } else {
      var temparr = this.data.salelistArr
      for (let a = 0; a < res.page.list.length; a++) {
        temparr.push(res.page.list[a])
      }
      this.setData({
        salelistArr: temparr,
        pageNumber: res.page.currentPage
      })
    }
  })
},
// 搜索商品
  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.setData({
      searchtitle: e.detail.value
    })
    if(!e.detail.value){
      this.data.pageNumber = 1
      this.prolistData()
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    this.data.pageNumber = 1
    this.prolistData()
    if (this.data.proshow){
      this.setData({
        proshow: false
      })
    }
  },
// 上拉加载更多
  scrolower: function () {
    if (this.data.salelistArr.length<10){
      this.data.pageNumber = 1
      this.prolistData()
    }else{
      this.data.pageNumber++
      this.prolistData()
    }
    
  },
  allProTap: function () {
    this.setData({
      proshow: !this.data.proshow
    })
    if (this.data.proshow){
      this.getcaterlist()
    }
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
        var temparr = res.list
        for (let i = 0; i < temparr.length; i++) {
          if (temparr[i].sublevels) {
            if (temparr[i].sublevels.length < 1) {
              temparr[i].sublevels = []
            }
          } else {
            temparr[i].sublevels = []
          }
          let temdic = { 'id': temparr[i].id, 'name': temparr[i].name }
          temparr[i].sublevels.unshift(temdic)
        }
        this.setData({
          caterdata: temparr
        })
      })
  },
  // 所有商品和未分类点击
  topcatertap: function (e) {
    this.data.isonecatertap = false
    var idx = e.currentTarget.dataset.idx
    if(idx == 0){
      //选中所有商品
      this.setData({
        choosename: '所有商品',
        proshow: false,
        chooseid: ''
      })
    }else{
      //选中未分类
      this.setData({
        choosename:'未分类',
        proshow: false,
        chooseid: 'noCate'
      })
    }
    this.data.pageNumber = 1
    this.prolistData()
  },
  // 二级分类点击
  twocatertap: function (e) {
    var ida = e.currentTarget.dataset.ida
    var idx = e.currentTarget.dataset.idx
    if(idx == 0){
      this.data.isonecatertap = true
    }else{
      this.data.isonecatertap = false
    }
    var pro = this.data.caterdata[ida].sublevels[idx]
    this.data.pageNumber = 1
    this.setData({
      searchtitle: '',
      chooseid: pro.id,
      choosename: pro.name,
      proshow: false
    })
    this.prolistData()
  },
  // 进入编辑广告
  proselect: function (e) {
    //获取商品id
    var idx = e.currentTarget.dataset.idx
    var pro = this.data.salelistArr[idx]
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //不需要页面更新
    prevPage.setData({
      guangaoDic: pro
    })
    wx.navigateBack({
    })
  }
})