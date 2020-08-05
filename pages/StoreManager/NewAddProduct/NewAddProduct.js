// pages/StoreManager/NewAddProduct/NewAddProduct.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeighth:0,
    pageNumber: 1,
    searchtitle:'',
    scrolowerLoad:false,
    choosename: '所有商品',
    proshow: false,
    topcaterdata: ['所有商品', '未分类'],
    chooseid: '',
    caterpageNumber:1,
    caterscrolowerLoad:false,
    caterdata:'',
    selids:'',
    isonecatertap:false,
    isAllChoose: false,
    guigedetailarr:'',
    xianshitishi:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.getchooseGoodslist()
  },
  onShow: function (options) {
    
  },
  tishiclosetap: function () {
    this.setData({
      xianshitishi: false
    })
  },
  getchooseGoodslist: function () {
    //修改key的值
    var temcater = 'categoryId'
    if (this.data.isonecatertap) {
      temcater = 'parentCategoryId'
    }
    var para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { 'title': this.data.searchtitle, [temcater]: this.data.chooseid, 'shopId': wx.getStorageSync("chooseshopid")} }
    console.log('导入的分类商品',para)
    // isMarketable
    urlApi.getInfo(rootUrls.huoquProListUrl, para, "POST")
      .then(res => {
        console.log('已岛',res)
        wx.hideLoading()
          //pageNumber==1清空数组其余时候累加
          if (this.data.pageNumber == 1) {
            
            this.setData({
              guigedetailarr: this.arrchangeguigedata(res.page.list)
            })
            console.log('拼接前', this.data.guigedetailarr)
          } else {
            var temparr = this.data.guigedetailarr
            var arrguige = this.arrchangeguigedata(res.page.list)
            for (let i = 0; i < arrguige.length;i++){
              temparr.push(arrguige[i])
            }
            // console.log('拼接前', this.data.guigedetailarr,'拼接后', temparr, '下一ye', arrguige)
            this.setData({
              guigedetailarr: temparr,
              pageNumber: res.page.currentPage
            })
          }
        if (this.data.guigedetailarr.length>this.data.selids.length){
            this.setData({
              isAllChoose: false
            })
          }
          if(res.page.list.length<10){
            this.setData({
              scrolowerLoad: false
            })
          }
      })
  },
  //数组转化为规格数组
  arrchangeguigedata:function (pagedata){
    var guigedetailarr = []
    for (let i = 0; i < pagedata.length; i++) {
      var tempro = pagedata[i]
      var goodsDesc = []
      for (let j = 0; j < tempro.commodityDescModelList.length; j++) {
        var tempguigedes = { 'shanghuUserPrice': tempro.commodityDescModelList[j].shanghuUserPrice ? tempro.commodityDescModelList[j].shanghuUserPrice : '','descPrice': tempro.commodityDescModelList[j].descPrice ? tempro.commodityDescModelList[j].descPrice : '', 'number': '', 'specificationItems': tempro.commodityDescModelList[j].specificationItems ? tempro.commodityDescModelList[j].specificationItems : '', 'id': tempro.commodityDescModelList[j].id }
        goodsDesc.push(tempguigedes)
      }
      var temguigedic = {
        'shopId': wx.getStorageSync("chooseshopid"), 'id': tempro.id,'categoryId':'', 'coverImage': tempro.coverImage ? tempro.coverImage : '', 'title': tempro.title ? tempro.title : '','proSelecte':false, 'goodsDesc': goodsDesc }
      guigedetailarr.push(temguigedic)
    }
    return guigedetailarr
  },
  scrolower: function () {
    //判断是上架还是下架 10/10 12/20
    this.setData({
      scrolowerLoad: true
    })
    this.data.pageNumber++
    this.getchooseGoodslist()
  },
  //选多个商品导入已下架
  checkboxChange(e) {
    // proSelecte
    var temparr = this.data.guigedetailarr
    var tempselids = []
    for (let i = 0; i < temparr.length; i++) {
      temparr[i].proSelecte = false
    }
    for (let i = 0; i < e.detail.value.length; i++) {
      let curidx = e.detail.value[i]
      temparr[curidx].proSelecte = true
      tempselids.push(temparr[curidx])
    }
    this.setData({
      selids: tempselids,
      guigedetailarr: temparr
    })
    if (e.detail.value.length < this.data.guigedetailarr.length){
      this.setData({
        isAllChoose : false
      })
    }
    // console.log('checkbox发生change事件，携带value值为：', this.data.selids, e.detail.value)
  },
  nextBrnTap: function () {
    console.log('selids',this.data.selids)
    
    wx.setStorageSync("choosecaterdic", {})
    if (this.data.selids) {
      //根据规格id判断价格是否小于建议零售价,拿到最新的修改价格和获取到的价格比较shanghuUserPrice
      for (let i = 0; i < this.data.selids.length;i++){
        let startpro = this.data.selids[i]
        for (let j = 0; j < startpro.goodsDesc.length;j++){
          let startprice = startpro.goodsDesc[j].shanghuUserPrice
          let desprice = startpro.goodsDesc[j].descPrice
          if(desprice<startprice){
            this.searchPriceIsBig()
            return
          }
        }
      }
      this.fenleizhi()
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选中商品',
      })
    }
    
  },
  searchPriceIsBig:function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '有商品规格价格低于零售价，是否确认保存？',
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      cancelColor: '#000000',//取消文字的颜色
      confirmText: "是",//默认是“确定”
      confirmColor: '#ff4444',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框

        } else {
          //点击确定,继续保存
          that.fenleizhi()
        }
      }
    })
  },
  fenleizhi: function () {
    //跳转到选择分类接口
    wx.setStorageSync('selidsarr', this.data.selids)
    wx.navigateTo({
      url: '../ProChooseCater/ProChooseCater?fromprolist=' + '10',
    })
  },
  //图片加载出错，替换为默认图片
  avatarError: function (e) {
    var errorImgIndex = e.currentTarget.dataset.idx
    var tempshop = this.data.guigedetailarr
    tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
    this.setData({
      guigedetailarr: tempshop
    })
  },
  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.searchtitle = e.detail.value
    if(!e.detail.value){
      this.data.pageNumber = 1
      this.getchooseGoodslist()
      this.setData({
        isAllChoose: false,
        selids: ''
      })
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
      selids: ''
    })
    this.data.pageNumber = 1
    this.getchooseGoodslist()
  },
  addproducetap: function (e) {
    var tag = e.currentTarget.dataset.idx;
    if (tag == 0) {
      wx.setStorageSync("choosecaterdic", {})
      wx.navigateTo({
        url: '../AddProduce/AddProduce?uploweditOrAdd=' + 2 + '&proid=' + '',
      })
    } else if (tag == 1) {
      //导入商品
      wx.navigateTo({
        url: '../NewAddProduct/NewAddProduct',
      })
    }
    else if (tag == 2) {
      wx.navigateTo({
        url: '../StorelistManager/StorelistManager',
      })
    } else {
      wx.navigateTo({
        url: '../ProAddCater/ProAddCater',
      })
    }
  },
  // 增加所有商品
  allProTap: function () {
    this.setData({
      proshow: !this.data.proshow
    })
    if (this.data.proshow) {
      wx.showLoading({
        title: '加载中...',
      })
      this.data.caterpageNumber = 1
      this.getcaterlist()
    }
  },
  caterscrolower: function () {
    this.setData({
      caterscrolowerLoad: true
    })
    this.data.caterpageNumber++
    this.getcaterlist()
  },
  //获取分类列表
  getcaterlist: function () {
    var para = { "currentPage": this.data.caterpageNumber, "pageSize": 10, "where": {} }
    urlApi.getInfo(rootUrls.goodsOtherCaterUrl, para, "POST")
      .then(res => {
        wx.hideLoading()
        // 调用获取用户信息接口,用户信息存储在偏好
        if (this.data.caterpageNumber == 1){
          
          this.setData({
            caterdata: this.getnewcaterlist(res.page.list)
          })
        } else {
          var temparr = this.data.caterdata
          for (let a = 0; a < res.page.list.length; a++) {
            var temdic = res.page.list[a]
            if (temdic.sublevels) {
              if (temdic.sublevels.length < 1) {
                temdic.sublevels = []
              }
            } else {
              temdic.sublevels = []
            }
            let temdict = { 'id': temdic.id, 'name': temdic.name }
            temdic.sublevels.unshift(temdict)
            temparr.push(temdic)
          }
          this.setData({
            caterdata: temparr,
            caterpageNumber: res.page.currentPage
          })
        }
        if (res.page.list.length < 10) {
          this.setData({
            caterscrolowerLoad: false
          })
        }
        // console.log('商品库', res)
      })
  },
  //传入分类列表获取新的列表
  getnewcaterlist: function (caterdata) {
    var temparr = caterdata
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
    return temparr
  },
  // 所有商品和未分类点击
  topcatertap: function (e) {
    this.data.isonecatertap = false
    this.setData({
      isAllChoose: false,
      selids: ''
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
    this.getchooseGoodslist()
  },
  // 二级分类点击
  twocatertap: function (e) {
    this.setData({
      isAllChoose: false,
      selids: ''
    })
    var ida = e.currentTarget.dataset.ida
    var idx = e.currentTarget.dataset.idx
    if (idx == 0 && this.data.caterdata[ida].sublevels.length>1){
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
    this.getchooseGoodslist()
  },
  //全选
  allchoosetap: function () {
    var temchoose = this.data.isAllChoose
    var tempselids = []
    this.setData({
      isAllChoose: !temchoose
    })
    var temparr = this.data.guigedetailarr
    if (this.data.isAllChoose) {
      //全部选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = true
        tempselids.push(pro)
      }
      this.setData({
        guigedetailarr: temparr,
        selids: tempselids
      })
    } else {
      //全部取消选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = false
      }
      this.setData({
        guigedetailarr: temparr,
        selids:''
      })
    }
  },
  //规格价格
  guigepriceinput: function(e) {
    // e.detail.value
    var idx = e.currentTarget.dataset.idx
    var ida = e.currentTarget.dataset.ida
    var temarr = this.data.guigedetailarr
    temarr[idx].goodsDesc[ida].descPrice = e.detail.value
    this.setData({
      guigedetailarr: temarr
    })
  },
  //规格库存
  guigenuminput: function(e) {
    var idx = e.currentTarget.dataset.idx
    var ida = e.currentTarget.dataset.ida
    var temarr = this.data.guigedetailarr
    temarr[idx].goodsDesc[ida].number = e.detail.value
    this.setData({
      guigedetailarr: temarr
    })
  },
  chakanguigetapname: function (e) {
    var idx = e.currentTarget.dataset.idx
    var ida = e.currentTarget.dataset.ida
    var temarr = this.data.guigedetailarr
    wx.showToast({
      icon: 'none',
      title: temarr[idx].goodsDesc[ida].specificationItems,
    })
  }
})