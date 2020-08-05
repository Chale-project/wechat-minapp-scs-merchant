// pages/mainClass/SecKillChoose/SecKillChoose.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseProduct: '',
    pageNumber:1,
    salelistArr:'',
    guigeshow:false,
    screenHeighth: 0,
    scrolowerLoad: false,
    searchtitle:'',
    guigeInputArr: [],
    chooseid: ''
  },
  onLoad:function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.getchooseGoodslist()
  },
  getchooseGoodslist:function () {
    //修改key的值
    var para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "shopId": wx.getStorageSync("chooseshopid"), "isMarketable": "put", "title": this.data.searchtitle } }
    console.log('para',para)
    // isMarketable
    urlApi.getInfo(rootUrls.getchooseSeckGoodsUrl, para, "POST")
      .then(res => {
        console.log(res, para)
        wx.hideLoading()
        
          //pageNumber==1清空数组其余时候累加
          if (this.data.pageNumber == 1) {
            var temparr = []
            for (let a = 0; a < res.page.list.length; a++) {
              var pro = res.page.list[a]
              pro.price = urlApi.fen2Yuan(pro.price)
              for (let j = 0; j < pro.goodsDescModelList.length;j++){
                pro.goodsDescModelList[j].descPrice = urlApi.fen2Yuan(pro.goodsDescModelList[j].descPrice)
              }
              temparr.push(pro)
            }
            this.setData({
              salelistArr: temparr
            })
          } else {
            var temparr = this.data.salelistArr
            var temcurpage = res.page.currentPage
            for (let a = 0; a < res.page.list.length; a++) {
              var pro = res.page.list[a]
              pro.price = urlApi.fen2Yuan(pro.price)
              for (let j = 0; j < pro.goodsDescModelList.length; j++) {
                pro.goodsDescModelList[j].descPrice = urlApi.fen2Yuan(pro.goodsDescModelList[j].descPrice)
              }
              temparr.push(pro)
            }
            this.setData({
              salelistArr: temparr,
              pageNumber: temcurpage
            })
            
          }
        if(res.page.list.length<10){
          this.setData({
            scrolowerLoad: false
          })
        }
      })
  },
  // 上拉加载更多
  scrolower: function (e) {
    this.setData({
      scrolowerLoad: true
    })
    if (this.data.salelistArr.length<10){
      this.data.pageNumber = 1
      this.getchooseGoodslist()
    }else{
      this.data.pageNumber++
      this.getchooseGoodslist()
    }
    
  },

  checktap(e) {
    var idx = e.currentTarget.dataset.idx
    var pro = this.data.salelistArr[idx]
    this.setData({
      chooseid: pro.id ,
      chooseProduct: pro
    })
  },
  nextBrnTap: function () {

    if (!this.data.chooseProduct){
      wx.showToast({
        icon: 'none',
        title: '请选择秒杀商品',
      })
    }else{
      //传递字典数据过去
      // wx.navigateTo({
      //   url: '../SecKillSetting/SecKillSetting?guigeid=' + this.data.guigeid + '&chooseProduct=' + this.data.chooseProductJson + '&goodsid=' + this.data.goodsid,
      // })
      var temsalePro = this.data.chooseProduct
      var temparr = []
      for (let i = 0; i < temsalePro.goodsDescModelList.length; i++) {
        let pro = temsalePro.goodsDescModelList[i]
        temparr.push({ 'goodsDescId': pro.id, 'seckillPrice': '', 'seckillNum': '', 'specificationItems': pro.specificationItems, 'descPrice': pro.descPrice, 'number': pro.number})
      }
      this.setData({
        guigeshow: true,
        guigeInputArr: temparr
      })
    }
  },
  avatarError(e) {
    var errorImgIndex = e.currentTarget.dataset.idx
    var tempshop = this.data.salelistArr
    tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
    this.setData({
      salelistArr: tempshop
    })
  },
  //选择规格
  chooseguigetap: function (e) {
    
  },
  //填写秒杀价
  guigepriceinput: function(e){
    var idx = e.currentTarget.dataset.idx
    var temp = this.data.guigeInputArr
    temp[idx].seckillPrice = e.detail.value
    this.setData({
      guigeInputArr: temp
    })
  },
  //填写活动库存
  guigenuminput: function(e){
    var idx = e.currentTarget.dataset.idx
    var temp = this.data.guigeInputArr
    temp[idx].seckillNum = e.detail.value
    this.setData({
      guigeInputArr: temp
    })
  },
  //填写完秒杀价和活动库存下一步
  hideModalsure: function () {
    //判断有没有填写一个完整的秒杀价和活动库存，所有秒杀价必须小于原价
    var wanzhang = 0
  for(let i=0;i<this.data.guigeInputArr.length;i++){
    let guigenum = i+1
    let pro = this.data.guigeInputArr[i]
    if (Number(pro.seckillPrice)>0){
      if (Number(pro.seckillNum)>0){

      }else{
        wx.showToast({
          icon: 'none',
          title: '第' + guigenum + '个规格的活动库存必须大于0',
        })
        return;
      }
    }
    if (Number(pro.seckillNum) > 0) {
      if (Number(pro.seckillPrice) > 0) {

      } else {
        wx.showToast({
          icon: 'none',
          title: '第' + guigenum + '个规格的秒杀价必须大于0',
        })
        return;
      }
    }
    if (Number(pro.seckillNum) > 0 && Number(pro.seckillPrice) > 0) {
      if (Number(pro.descPrice)<=Number(pro.seckillPrice)){
        wx.showToast({
          icon: 'none',
          title: '第'+guigenum+'个规格的秒杀价必须小于原价',
        })
        return;
      }
      wanzhang++
    }
  }
    if (wanzhang == 0) {
      wx.showToast({
        icon: 'none',
        title: '最少填写一组规格的秒杀价和活动库存',
      })
      return;
    }
  let productJson = JSON.stringify(this.data.chooseProduct)
  let inputArr = JSON.stringify(this.data.guigeInputArr)
    wx.navigateTo({
      url: '../SecKillSetting/SecKillSetting?inputArr=' + inputArr + '&chooseProduct=' + productJson,
      })
  },
  hideModal:function () {
    this.setData({
      guigeshow: false
    })
  },
  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.searchtitle = e.detail.value
    if (!e.detail.value) {
      this.data.pageNumber = 1
      this.getchooseGoodslist()
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    this.data.pageNumber = 1
    this.getchooseGoodslist()
  },

})