// pages/mainClass/AddPiecing/AddPiecing.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseProduct: {},
    chooseProductJson: "",
    pageNumber: 1,
    salelistArr: '',
    guigename: "",
    guigeid: "", //规格id
    goodsid: "", //商品id
    guigeshow: false,
    choosespecname: "",
    xuanzhongidx: 0,
    screenHeighth: 0,
    chooseid: '', //记录选中的商品id
    scrolowerLoad: false,
    searchtitle: '',
    guigeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    wx.showLoading()
    this.getchooseGoodslist()
  },

  toChooseSize: function(e) {
    var id = e.currentTarget.dataset.item
    console.log(e)
    this.getdetaildata(id)
  },

  getGroupPrice: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.guigeList[pos].groupPrice = e.detail.value
    console.log(this.data.guigeList[pos].groupPrice)
  },
  getStock: function(e) {
    var pos = e.currentTarget.dataset.index
    var value = e.detail.value
    this.data.guigeList[pos].groupStock = e.detail.value
    console.log(this.data.guigeList[pos].groupStock)
  },

  nextStep: function() {

    // app.globalData.groupList.endTime = ""
    // app.globalData.groupList.goodsGroupDescModels = []
    // app.globalData.groupList.goodsId = this.data.chooseProduct.id
    // app.globalData.groupList.groupPeopleCount = ""
    // app.globalData.groupList.groupTime = ""
    // app.globalData.groupList.limitation = ""
    // app.globalData.groupList.startTime = ""
    // for (var i = 0; i < this.data.guigeList.length; i++) {
    //   if (!this.data.guigeList[i].groupStock && !this.data.guigeList[i].groupPrice) {
    //     var json = {};
    //     json.goodsDescId = this.data.guigeList[i].id
    //     json.groupNum = this.data.guigeList[i].groupStock
    //     json.groupPrice = this.data.guigeList[i].groupPrice
    //     app.globalData.groupList.goodsGroupDescModels.push(json)
    //   }
    // }
    // console.log("拼团商品==" + JSON.stringify(app.globalData.groupList))


    app.globalData.groupList = this.data.guigeList
    console.log("拼团商品==" + JSON.stringify(app.globalData.groupList))

    this.setData({
      modalName: '',
      price: "",
      stock: ""
    })
    wx.navigateTo({
      url: '/pages/mainClass/AddPiecingTwo/AddPiecingTwo',
    })
  },
  hideModal: function() {
    this.setData({
      modalName: '',
      price: "",
      stock: ""
    })
  },


  //获取商品详情带规格
  getdetaildata: function(id) {
    urlApi.getInfo(rootUrls.prodetailUrl + id, {}, "get")
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.info.goodsDesc.length == 0) {
            var json = {
              'id':'',
              'goodsId':res.info.id,
              'goodsImage': res.info.coverImage,
              'title': res.info.title,
              'itemImages': res.info.coverImage,
              'descPrice': urlApi.fen2Yuan(res.info.price),
              'groupPrice': '',
              'groupStock': '',
              'hasStyle':false
            }
            res.info.goodsDesc.push(json)
          } else {
            for (let i = 0; i < res.info.goodsDesc.length; i++) {
              res.info.goodsDesc[i].descPrice = urlApi.fen2Yuan(res.info.goodsDesc[i].descPrice)
              res.info.goodsDesc[i].goodsImage = res.info.goodsDesc[i].coverImage
              res.info.goodsDesc[i].groupPrice = ""
              res.info.goodsDesc[i].groupStock = ""
              res.info.goodsDesc[i].hasStyle = true
            }
          }

          this.setData({
            chooseProduct: res.info,
            productName: res.info.title,
            dataList: res.info.goodsDesc,
            modalName: 'show',
            guigeList: res.info.goodsDesc
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },



  getchooseGoodslist: function() {
    //修改key的值
    var para = {
      "currentPage": this.data.pageNumber,
      "pageSize": 10,
      "where": {
        "shopId": wx.getStorageSync("chooseshopid"),
        "isMarketable": "put",
        "title": this.data.searchtitle
      }
    }
    console.log('para', para)
    // isMarketable
    urlApi.getInfo(rootUrls.getchooseSeckGoodsUrl, para, "POST")
      .then(res => {
        console.log(res, para)
        wx.hideLoading()

        //pageNumber==1清空数组其余时候累加
        if (this.data.pageNumber == 1) {
          this.setData({
            salelistArr: res.page.list
          })
        } else {
          var temparr = this.data.salelistArr
          var temcurpage = res.page.currentPage
          for (let a = 0; a < res.page.list.length; a++) {
            temparr.push(res.page.list[a])
          }
          this.setData({
            salelistArr: temparr,
            pageNumber: temcurpage
          })

        }
        if (res.page.list.length < 10) {
          this.setData({
            scrolowerLoad: false
          })
        }
      })
  },

  avatarError(e) {
    var errorImgIndex = e.currentTarget.dataset.idx
    var tempshop = this.data.salelistArr
    tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
    this.setData({
      salelistArr: tempshop
    })
  },
  // 输入框输入内容时 清空内容
  searchnameinput: function(e) {
    this.data.searchtitle = e.detail.value
    if (!e.detail.value) {
      this.data.pageNumber = 1
      this.getchooseGoodslist()
    }
  },
  // 点击输入搜索
  searchbutton: function() {
    this.data.pageNumber = 1
    this.getchooseGoodslist()
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
    app.globalData.groupList = []
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
    this.data.pageNumber = 1
    this.getchooseGoodslist()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.pageNumber++
      this.getchooseGoodslist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})