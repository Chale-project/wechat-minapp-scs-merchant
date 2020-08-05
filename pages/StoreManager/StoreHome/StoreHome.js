// pages/StoreManager/StoreHome/StoreHome.js


var storeSaleApi = require('../../../utils/StoreSale.js')
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    titledata: [{
      "name": "0人",
      "descrip": "今日成交客户"
    },
    {
      "name": "0件",
      "descrip": "今日销量"
    }, {
      "name": "¥ 0.00",
      "descrip": "今日成交额"
    }],
    'bottomtitledata': [{
      "name": "/pages/images/storeManager/icon_Addthegoods.png",
      "descrip": "添加商品"
    },
    {
      "name": "/pages/images/storeManager/icon_guideProduct.png",
      "descrip": "导入商品"
    },
    {
      "name": "/pages/images/storeManager/icon_batchmanagement.png",
      "descrip": "批量管理"
    }, {
      "name": "/pages/images/storeManager/icon_Classificationmanagement.png",
      "descrip": "分类管理"
    }],
    searchtitle:"",
    proshowOrInvent:true,
    saleorlowindex: 0,
    selids: "",
    screenHeighth:0,
    choosename: '所有商品',
    proshow: false,
    topcaterdata: ['所有商品', '未分类'],
    chooseid: '',
    isonecatertap: false,
    caterdata:''
  },
  onReady: function () {
    //获得popup组件
    this.chooseCaterList = this.selectComponent("#chooseCaterList");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    storeSaleApi.loadNav(this)
    //调用商品数据分析接口
    this.analyseGoodsData()
  },
  onShow: function (options) {
    //按照之前的添加时间销量和库存排序
    storeSaleApi.adjectivePageNumber(this)
    storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
    var caterdic = wx.getStorageSync('choosecaterdic')
  },
  onUnload: function () {
    wx.setStorageSync('kuncunIdx', '')
  },
  analyseGoodsData:function () {
    urlApi.getInfo(rootUrls.analyseGoodsDataUrl+wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        console.log(111,res)
        if(res.code == 0){
          var fir = res.info.userCount== null ? '0' : res.info.userCount
          var sec = res.info.salesVolume == null ? '0' : res.info.salesVolume
          var thi = res.info.salesAmount == null ? '0' : res.info.salesAmount / 100
          this.setData({
            titledata: [{
              "name": fir+'人',
              "descrip": "今日成交客户"
            },
            {
              "name": sec +'件',
              "descrip": "今日销量"
            }, {
              "name": '¥' + thi+'元',
              "descrip": "今日成交额"
            }]
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.searchtitle = e.detail.value
    if(!e.detail.value){
      storeSaleApi.adjectivePageNumber(this)
      storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    if (this.data.proshow) {
      this.setData({
        proshow: false
      })
    }
    storeSaleApi.adjectivePageNumber(this)
    storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  //添加时间 销量 库存选择
  kucunTap: function (e) {
    let that = this
    var tag = e.currentTarget.dataset.idx;
    storeSaleApi.choosekucun(that, tag, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  proselect: function (e) {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'productManager3') {
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


    var tag = e.currentTarget.dataset.idx;
    console.log(1.0,this.data.salelistArr[tag])
    wx.setStorageSync("choosecaterdic", {})
    wx.navigateTo({
      url: '../AddProduce/AddProduce?uploweditOrAdd=' + this.data.saleorlowindex + '&proid=' + this.data.salelistArr[tag].id,
    })
  },
  addproducetap: function (e) {

    
    var tag = e.currentTarget.dataset.idx;
    if(tag == 0){

      if (app.globalData.isShopOperator) {
        var canenter = '0'
        for (let i = 0; i < app.globalData.menuAuth.length; i++) {
          let pro = app.globalData.menuAuth[i]
          if (pro == 'productManager2') {
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


      wx.setStorageSync("choosecaterdic", {})
      wx.navigateTo({
        url: '../AddProduce/AddProduce?uploweditOrAdd=' + 2 + '&proid=' + '',
      })
    }else if (tag == 1){

      if (app.globalData.isShopOperator) {
        var canenter = '0'
        for (let i = 0; i < app.globalData.menuAuth.length; i++) {
          let pro = app.globalData.menuAuth[i]
          if (pro == 'productManager5') {
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

      //导入商品
      wx.navigateTo({
        url: '../NewAddProduct/NewAddProduct',
      })
    }
    else if (tag == 2) {

      if (app.globalData.isShopOperator) {
        var canenter = '0'
        for (let i = 0; i < app.globalData.menuAuth.length; i++) {
          let pro = app.globalData.menuAuth[i]
          if (pro == 'productManager6') {
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


      wx.navigateTo({
        url: '../StorelistManager/StorelistManager',
      })
    }else{


      if (app.globalData.isShopOperator) {
        var canenter = '0'
        for (let i = 0; i < app.globalData.menuAuth.length; i++) {
          let pro = app.globalData.menuAuth[i]
          if (pro == 'productManager7') {
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

      wx.navigateTo({
        url: '../ProAddCater/ProAddCater',
      })
    }
  },
  avatarError: function(e) {
    storeSaleApi.avatarError(this,e)
  },
  //判断点击的是否是出售中,已上架,添加时间,总销量,库存
  onClickindex: function(e) {
    var idx = e.detail.index
    this.setData({
      saleorlowindex:idx
    })
    wx.showLoading({
      title: '加载中...',
    })
    storeSaleApi.adjectivePageNumber(this)
    storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  // 上拉加载更多
  scrolower: function (e) {
    storeSaleApi.nextload(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  ontapindex: function (e) {
    var idx = e.detail.index
    this.setData({
      saleorlowindex: idx
    })
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
        console.log('cater',res)
        // 调用获取用户信息接口,用户信息存储在偏好
        var temparr = res.list
        for (let i = 0; i < temparr.length;i++){
          if(temparr[i].sublevels){
            if(temparr[i].sublevels.length<1){
              temparr[i].sublevels = []
            }
          }else{
            temparr[i].sublevels = []
          }
          let temdic = { 'id': temparr[i].id, 'name': temparr[i].name}
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
    storeSaleApi.adjectivePageNumber(this)
    storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  // 二级分类点击
  twocatertap: function (e) {
    //判断是否是一级分类点击
    var ida = e.currentTarget.dataset.ida
    var idx = e.currentTarget.dataset.idx
    if (idx == 0){
      this.data.isonecatertap = true
    }else{
      this.data.isonecatertap = false
    }
    var pro = this.data.caterdata[ida].sublevels[idx]
    this.setData({
      searchtitle: '',
      chooseid: pro.id,
      choosename: pro.name,
      proshow: false
    })
    storeSaleApi.adjectivePageNumber(this)
    storeSaleApi.prolistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  }
})