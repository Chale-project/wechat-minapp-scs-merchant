// pages/StoreManager/CaterProList/CaterProList.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    procaterid:"",
    salelistArr:'',
    chooseProduct:[],
    wheredata:{},
    saleselect:true,
    recommen:'',
    choosepro:false,//是否重新选批量商品
    isAllChoose:false,
    showchooseview:true,//出售中显示全选栏,下架中不显示
    screenHeighth: 0,
    isPutOrOut:'put',
    scrolowerLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.data.procaterid = options.procaterid
    if (options.recommen == 'procom'){
      //商品推荐列表
      this.setData({
        recommen: options.recommen
      })
    }
    else{
      this.setData({
        chooseProduct: app.globalData.limitProduct
      })
      console.log('chooseProduct', app.globalData.limitProduct)
    }
    this.proalllistData('put')
  },
  //区分上架和下架商品
  proalllistData: function (putorout) {
    //判断
    let param = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "isMarketable": putorout, "categoryId": this.data.procaterid ? this.data.procaterid :'noCate', "shopId": wx.getStorageSync("chooseshopid")} }
    console.log('商品para',param)
    urlApi.getInfo(rootUrls.goodslistUrl, param, "POST")
      .then(res => {
        wx.hideLoading()
        console.log('商品',res)
          if (this.data.pageNumber == 1) {
            this.setData({
              salelistArr: res.page.list,
              wheredata: res.page.where
            })
          } else {
            var temparr = this.data.salelistArr
            for (let a = 0; a < res.page.list.length; a++) {
              temparr.push(res.page.list[a])
            }
            if (res.page.list.length < 10) {
              this.setData({
                scrolowerLoad: false
              })
            }
            this.setData({
              salelistArr: temparr,
              pageNumber: res.page.currentPage
            })
          }
          //根据当前的商品list显示选中状态,获取id
          var proarr = this.data.salelistArr
          var nochoose = true
          if (this.data.recommen == 'procom'){
            var selarr = []
            for (let i = 0; i < proarr.length; i++) {
              var pro = proarr[i]
              //第一次是以推荐的为选中，第二次以选中为主
              if (pro.isRecommend == 'recommend' || pro.proSelecte == true) {
                  pro.proSelecte = true
                selarr.push(proarr[i])
                }else{
                  nochoose = false
                  pro.proSelecte = false
                }
            }
            if (nochoose && this.data.wheredata.put>0){
              //全选且上架的商品存在
              this.setData({
                isAllChoose:true
              })
            }
            this.setData({
              chooseProduct:selarr
            })
          }else{
            for (let i = 0; i < proarr.length; i++) {
              var pro = proarr[i]
              for (let j = 0; j < this.data.chooseProduct.length; j++) {
                var protwo = this.data.chooseProduct[j]
                if (pro.id == protwo.id || pro.proSelecte == true) {
                  pro.proSelecte = true
                }else{
                  pro.proSelecte = false
                }
              }
            }
          }
          this.setData({
            salelistArr:proarr
          })
      })
  },
  scrolower: function () {
    //判断是上架还是下架 10/10 12/20
    this.setData({
      scrolowerLoad: true
    })
      this.data.pageNumber++
      this.proalllistData(this.data.isPutOrOut)
  },
  checkboxChange(e) {
    //给选中的数据重新赋值
    this.data.choosepro = true
    var allcurchoose = true
    var temparr = []
    console.log('已选中的商品',e)
    var temsalelistarr = this.data.salelistArr
    for (let i = 0; i < temsalelistarr.length;i++){
     temsalelistarr[i].proSelecte = false
      if (temsalelistarr[i].isRecommend) {
        temsalelistarr[i].isRecommend = "noRecommend"
      }
     
    }
    //取出选中的索引
    for (let i = 0; i < e.detail.value.length; i++) {
      var index = e.detail.value[i]
      let pro = this.data.salelistArr[index]
      temsalelistarr[index].proSelecte = true
      temparr.push(pro)
    }
    if (this.data.salelistArr.length == temparr.length){
      allcurchoose = true
    }else{
      allcurchoose = false
    }
    this.setData({
      chooseProduct: temparr,
      isAllChoose:allcurchoose,
      salelistArr: temsalelistarr
    })
    console.log('选择的商品列表', this.data.salelistArr)
  },
  //确认
  surechoosetap: function () {
    var idsarr = []
    if (this.data.recommen == 'procom'){
      if (this.data.choosepro){
        wx.showLoading({
          title: '正在推荐商品',
        })
        for (let i = 0; i < this.data.chooseProduct.length; i++) {
          //拼接id
          idsarr.push(this.data.chooseProduct[i].id)
        }
        var ids = idsarr.join(",")
        
        this.recommenprolist(ids)
      }
      else{
        wx.navigateBack({
          delta: 2
        })
      }
    }else{
      app.globalData.limitProduct = this.data.chooseProduct
      wx.navigateBack({
        delta: 2
      })
    }

    
  },
  //出售
  saleviewtap: function () {
    this.data.pageNumber = 1
    this.data.isPutOrOut = 'put'
    this.proalllistData('put')
    this.setData({
      saleselect: true,
      showchooseview: true
    })
  },
  //下架
  pullproviewtap: function () {
    this.data.pageNumber = 1
    this.data.isPutOrOut = 'out'
    //隐藏底部选中栏
    this.proalllistData('out')
    this.setData({
      saleselect: false,
      showchooseview: false
    })
  },
  //批量推荐商品
  recommenprolist:function (ids) {
    if(!ids){
      ids = "all," + this.data.procaterid
    }
    console.log('商品ids', ids)
    urlApi.getInfo(rootUrls.prorecommenUrl + ids, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '推荐成功',
        })
        wx.navigateBack({
          delta: 2
        })
      })
  },
  //全选
  allchoosetap: function () {
    this.data.choosepro = true
    var temchoose = this.data.isAllChoose
    this.setData({
      isAllChoose: !temchoose
    })
    var temparr = this.data.salelistArr
    if (this.data.isAllChoose){
      //全部选中
        for (let i = 0; i < temparr.length; i++) {
              var pro = temparr[i]
              pro.proSelecte = true
        }
        this.setData({
          salelistArr: temparr,
          chooseProduct: temparr
        })
    }else{
      //全部取消选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = false
      }
      this.setData({
        salelistArr: temparr,
        chooseProduct: []
      })
    }
  }
})
