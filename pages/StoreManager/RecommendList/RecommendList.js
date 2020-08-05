// pages/StoreManager/RecommendList/RecommendList.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proshow: false,
    screenHeighth: 0,
    isAllChoose: false,
    topcaterdata: ['所有商品', '未分类'],
    choosename: '所有商品',
    isonecatertap: false,
    pageNumber: 1,
    storesalelistArr: '',
    selidsArr: '',
    selids: '',
    storebottomtitledata: [{
      "name": "取消推荐"
    }],
    searchtitle: '',
    chooseid: '',
    caterdata: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.getproductlistdata()
  },
  //上拉加载更多
  storescrolower: function () {
    this.data.pageNumber++
    this.getproductlistdata()
  },
  getproductlistdata: function () {
    var url = ''
    // if (this.data.isonecatertap) {
    //   url = rootUrls.onecaterallproUrl
    // } else {
      url = rootUrls.goodsRecommendlist
    // }
    let para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "isMarketable": "put", "shopId": wx.getStorageSync("chooseshopid"), "categoryId": this.data.chooseid, "title": this.data.searchtitle, "isRecommend": "recommend" } }
    console.log('已推荐',url,para)
    urlApi.getInfo(url, para, "POST")
      .then(res => {
        wx.hideLoading()
        this.setData({
          isAllChoose: false,
          selids: '',
          selidsArr: ''
        })
        // let tempstorelistarr = this.data.storesalelistArr
        if (this.data.pageNumber == 1) {
          var temparr = []
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          this.setData({
            storesalelistArr: temparr,
          })
        } else {
          var temparr = this.data.storesalelistArr
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          this.setData({
            storesalelistArr: temparr,
            pageNumber: res.page.currentPage
          })
        }
        if (this.data.storesalelistArr.length > this.data.selidsArr.length) {
          this.setData({
            isAllChoose: false
          })
        }
        if (res.page.list.length < 10) {
          this.setData({
            scrolowerLoadstore: false
          })
        }
      })
  },
  //全选
  allchoosetap: function () {
    this.data.choosepro = true
    var temchoose = this.data.isAllChoose
    var tempselids = []
    this.setData({
      isAllChoose: !temchoose
    })
    var temparr = this.data.storesalelistArr
    if (this.data.isAllChoose) {
      //全部选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = true
        tempselids.push(pro.id)
      }
      this.setData({
        storesalelistArr: temparr,
        selids: tempselids.toString(),
        selidsArr: tempselids
      })
    } else {
      //全部取消选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = false
      }
      this.setData({
        storesalelistArr: temparr,
        selids: '',
        selidsArr: ''
      })
    }
  },
  searchnameinput: function (e) {
    this.data.searchtitle = e.detail.value
    if (!e.detail.value) {
      this.setData({
        isAllChoose: false,
        selids: '',
        selidsArr: ''
      })
      this.data.pageNumber = 1
      this.getproductlistdata()
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    if (this.data.proshow) {
      this.setData({
        proshow: false
      })
    }
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: ''
    })
    this.data.pageNumber = 1
    this.getproductlistdata()
  },
  // 增加所有商品
  allProTap: function () {
    this.setData({
      proshow: !this.data.proshow
    })
    if (this.data.proshow) {
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
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: '',
      isallcaterorNocater: true
    })
    var idx = e.currentTarget.dataset.idx
    if (idx == 0) {
      //选中所有商品
      this.setData({
        choosename: '所有商品',
        proshow: false,
        chooseid: ''
      })
    } else {
      //选中未分类
      this.setData({
        choosename: '未分类',
        proshow: false,
        chooseid: 'noCate'
      })
    }
    this.data.pageNumber = 1
    this.getproductlistdata()
  },
  // 二级分类点击
  twocatertap: function (e) {
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: '',
      isallcaterorNocater: false
    })
    var ida = e.currentTarget.dataset.ida
    var idx = e.currentTarget.dataset.idx
    if (idx == 0) {
      this.data.isonecatertap = true
    } else {
      this.data.isonecatertap = false
    }
    var pro = this.data.caterdata[ida].sublevels[idx]
    this.setData({
      searchtitle: '',
      chooseid: pro.id,
      choosename: pro.name,
      proshow: false
    })
    this.data.pageNumber = 1
    this.getproductlistdata()
  },
  //置顶
  moveuptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    wx.showLoading({
      icon: 'none',
      title: '置顶中',
    })
    this.paixudata(pro.id, 'Home')

  },
  //上移
  movetoptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    var cater = 'PgUp'
    wx.showLoading({
      icon: 'none',
      title: '上移中',
    })
    this.paixudata(pro.id, cater)
  },
  //下移
  moveloworuptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    var cater = 'PgDn'
    wx.showLoading({
      icon: 'none',
      title: '下移中',
    })
    this.paixudata(pro.id, cater)
  },
  paixudata: function (id, cater) {
    // propaixuUrl
    let url = rootUrls.recommenpaixuUrl + id + '/' + cater
    console.log('商品排序',url)
    let that = this
    urlApi.getInfo(url, {}, "PUT")
      .then(res => {
        //刷新数据
        this.data.pageNumber = 1
        this.getproductlistdata()
      })
  },
  //选中商品
  checkboxChange: function (e) {
    console.log('选中2', e)
    var temparr = this.data.storesalelistArr
    var tempselids = []
    for (let i = 0; i < temparr.length; i++) {
      temparr[i].proSelecte = false
    }
    for (let i = 0; i < e.detail.value.length; i++) {
      let curidx = e.detail.value[i]
      temparr[curidx].proSelecte = true
      tempselids.push(temparr[curidx].id)
    }
    this.setData({
      selids: tempselids.toString(),
      selidsArr: tempselids,
      storesalelistArr: temparr
    })
    if (e.detail.value.length < this.data.storesalelistArr.length) {
      this.setData({
        isAllChoose: false
      })
    }
  },
  storeaddproducetap: function () {
    if(this.data.selids.length<1){
      wx.showToast({
        icon: 'none',
        title: '请选中商品',
      })
    }else{
      this.setNoRecommenData()
    }
  },
  //取消商品推荐
  setNoRecommenData: function () {
    // newRecommensetUrl
    let url = rootUrls.newRecommensetUrl + '/' + this.data.selids + '/' + 'noRecommend'
    urlApi.getInfo(url, {}, "PUT")
      .then(res => {
        this.data.pageNumber = 1
        this.getproductlistdata()
        wx.showToast({
          icon: 'none',
          title: '设置为取消推荐成功',
        })
      })
  },
})