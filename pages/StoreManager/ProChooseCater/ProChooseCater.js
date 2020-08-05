// pages/StoreManager/ProChooseCater/ProChooseCater.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    secdata: [],
    choosecaterdic:{},
    selids:"",
    fromprolist: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      fromprolist: options.fromprolist
    })
    if (this.data.fromprolist == '10'){

    }else{
      if (options.selids) {
        this.data.selids = options.selids
      }
    }
  },
  onShow: function(options) {
    this.setData({
      choosecaterdic: wx.getStorageSync("choosecaterdic")
    })
    console.log(222, this.data.choosecaterdic)
    this.getcaterlist()
  },
  //收起和展开分类
  shoutap: function(e) {
    var selectindex = e.currentTarget.dataset.idx
    var temparrlist = this.data.secdata
    if (temparrlist[selectindex].sublevels){
    if (temparrlist[selectindex].sublevels.length > 0) {
      //有子分类
      temparrlist[selectindex].showorhide = !temparrlist[selectindex].showorhide
      this.setData({
        secdata: temparrlist
      })
    }
    }
  },
  //创建分类
  managercatertap : function () {
    wx.navigateTo({
      url: '../ProAddCater/ProAddCater',
    })
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
        this.setData({
            secdata: res.list
          })
      })
  },
  //判断有子分类则只能选中子分类，没有子分类才可选择一级分类
  checkchooseviewChange: function (e){
    var tag = e.currentTarget.dataset.idx
    var tempdic = this.data.secdata[tag]
    console.log(1, tag, tempdic)
    this.setData({
      choosecaterdic: tempdic
    })
  },
  checktwochooseviewChange: function (e){
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var temp = this.data.secdata[idx].sublevels[idy]
    console.log(2, temp, idx, idy)
    this.setData({
      choosecaterdic: temp
    })
  },
  canclechoose: function(){
    wx.navigateBack({
      
    })
  },
  surechoosetap: function(){
    let idtemp = this.data.choosecaterdic.id
    if (idtemp){
      if (this.data.fromprolist == '10'){
        //批量导入商品
        this.pilianAddpro(idtemp)
      }else{
        // 传递选中的分类
        if (this.data.selids.length > 0) {
          //批量分类
          console.log(1, this.data.choosecaterdic.id, this.data.selids)
          urlApi.getInfo(rootUrls.prolistcaterUrl + this.data.choosecaterdic.id + '/' + this.data.selids, {}, "PUT")
            .then(res => {
              var pages = getCurrentPages();   //当前页面
              var prevPage = pages[pages.length - 2];   //上一页面
              prevPage.setData({
                //直接给上一个页面赋值
                alreadychoosecater: true,

              })
              wx.navigateBack({

              })
            })
        } else {
          wx.setStorageSync("choosecaterdic", this.data.choosecaterdic)
          wx.navigateBack({

          })
        } 
      }
      
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择分类',
      })
    }
    
  },
  pilianAddpro:function (caterid){
    wx.showLoading({
      title: '正在导入..',
    })
    var salistarr = wx.getStorageSync('selidsarr')
    //价格*100
    for (let i=0;i<salistarr.length;i++){
      salistarr[i].categoryId = caterid
      for (let j = 0; j < salistarr[i].goodsDesc.length;j++){
        var temdic = salistarr[i].goodsDesc[j]
        temdic.descPrice = temdic.descPrice*100
        //去除小数点后面的数据
      }
    }
    console.log('导入的商品', salistarr)
    urlApi.getInfo(rootUrls.productstoreUrl, salistarr, "PUT")
      .then(res => {
        //导入失败价格/100
        wx.hideLoading()
        var pages = getCurrentPages();
        // var currPage = pages[pages.length - 1];   //当前页面
        console.log('curpage',pages)
        if (pages.length > 2) {
        var prevPage = pages[pages.length - 3];  //上一个页面
        prevPage.setData({
          saleorlowindex: 0
        })
        }
        wx.navigateBack({
          delta: 2
        })
        wx.showToast({
          icon: 'none',
          title: '导入成功',
        })

    })
  }
  

})