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
    procaterid: "",
    salelistArr: '',
    chooseProduct: [],
    wheredata: {},
    saleselect: true,
    recommen: '',
    choosepro: false, //是否重新选批量商品
    isAllChoose: false,
    showchooseview: true, //出售中显示全选栏,下架中不显示
    screenHeighth: 0,
    isPutOrOut: 'put',
    scrolowerLoad: false,
    chooseIds: []
  },
  onUnload: function() {
    this.data.chooseProduct = []

    for (let i = 0; i < this.data.salelistArr.length; i++) {
      if (this.data.salelistArr[i].proSelecte) {
        this.data.chooseProduct.push(this.data.salelistArr[i])
      }
    }
    app.globalData.limitProduct = this.data.chooseProduct
    this.data.chooseIds = []
    for (let i = 0; i < this.data.chooseProduct.length; i++) {
      //拼接id
      this.data.chooseIds.push(this.data.chooseProduct[i].id)
    }
    console.log("选择id===" + this.data.chooseIds)
    // if (this.data.chooseIds.length <= 0) {
    //   return
    // }

    if (app.globalData.couponProductList.length == 0) {
      if (this.data.chooseIds.length <= 0) {
        // var json = {
        //   'firstId': this.data.procaterid,
        //   'secondId': []
        // }
      } else {
        var json = {
          'firstId': this.data.procaterid,
          'secondId': this.data.chooseIds
        }
      }

      app.globalData.couponProductList.push(json)
    } else {
      var position = -1;
      for (let i = 0; i < app.globalData.couponProductList.length; i++) {
        if (app.globalData.couponProductList[i].firstId == this.data.procaterid) {
          if (this.data.chooseIds.length <= 0) {
            app.globalData.couponProductList[i].secondId = []

          } else {
            app.globalData.couponProductList[i].secondId = this.data.chooseIds
          }
          position = i;
          break
        }
      }
      if (position == -1) {
        if (this.data.chooseIds.length <= 0) {
          var json = {
            'firstId': this.data.procaterid,
            'secondId': []
          }
        } else {
          var json = {
            'firstId': this.data.procaterid,
            'secondId': this.data.chooseIds
          }
        }
        app.globalData.couponProductList.push(json)
      }
    }
    console.log('选择的商品列表', app.globalData.couponProductList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.data.procaterid = options.procaterid

    this.setData({
      chooseProduct: app.globalData.limitProduct
    })
    console.log('chooseProduct', app.globalData.limitProduct)

    this.proalllistData('put')
  },
  //区分上架和下架商品
  proalllistData: function(putorout) {
    //判断
    let param = {
      "currentPage": this.data.pageNumber,
      "pageSize": 10,
      "where": {
        "isMarketable": putorout,
        "categoryId": this.data.procaterid ? this.data.procaterid : 'noCate',
        "shopId": wx.getStorageSync("chooseshopid")
      }
    }
    urlApi.getInfo(rootUrls.goodslistUrl, param, "POST")
      .then(res => {
        wx.hideLoading()
        if (this.data.pageNumber == 1) {
          this.setData({
            salelistArr: res.page.list,
            wheredata: res.page.where
          })
        } else {
          var temparr = this.data.salelistArr
          for (let a = 0; a < res.page.list.length; a++) {
            res.page.list[a].proSelecte = false
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

        var secondIds = []
        console.log(app.globalData.couponProductList)
        for (let i = 0; i < app.globalData.couponProductList.length; i++) {
          if (!app.globalData.couponProductList[i].firstId) {
            continue
          }
          if (this.data.procaterid == app.globalData.couponProductList[i].firstId) {
            secondIds = app.globalData.couponProductList[i].secondId
          }
        }
        console.log(secondIds)
        for (let i = 0; i < proarr.length; i++) {
          var pro = proarr[i].id
          for (let j = 0; j < secondIds.length; j++) {
            var protwo = secondIds[j]

            if (pro == protwo) {
              proarr[i].proSelecte = true
              break
            } else {
              proarr[i].proSelecte = false
            }
          }
        }

        this.setData({
          salelistArr: proarr
        })
      })
  },
  scrolower: function() {
    //判断是上架还是下架 10/10 12/20
    this.setData({
      scrolowerLoad: true
    })
    this.data.pageNumber++
      this.proalllistData(this.data.isPutOrOut)
  },
  checkboxChange: function(e) {
    // console.log("wftc==", e.currentTarget.dataset.idx)
    var pos = e.currentTarget.dataset.idx
    // for (let i = 0; i < this.data.salelistArr.length; i++) {
    //   this.data.salelistArr[i].proSelecte = false
    // }

    // for (let i = 0; i < e.detail.value.length; i++) {
    //   var pos = e.detail.value[i]
    //   if (i == e.detail.value.length - 1) {
    //     continue
    //   }
    //   this.data.salelistArr[pos].proSelecte = true
    // }

    if (this.data.salelistArr[pos].proSelecte) {
      this.data.salelistArr[pos].proSelecte = false
    } else {
      this.data.salelistArr[pos].proSelecte = true
    }


    this.setData({
      salelistArr: this.data.salelistArr
    })

  },
  //确认
  surechoosetap: function() {
    var idsarr = []
    if (this.data.recommen == 'procom') {
      if (this.data.choosepro) {
        wx.showLoading({
          title: '正在推荐商品',
        })
        for (let i = 0; i < this.data.chooseProduct.length; i++) {
          //拼接id
          idsarr.push(this.data.chooseProduct[i].id)
        }
        var ids = idsarr.join(",")

        this.recommenprolist(ids)
      } else {
        wx.navigateBack({
          delta: 2
        })
      }
    } else {
      app.globalData.limitProduct = this.data.chooseProduct
      wx.navigateBack({
        delta: 2
      })
    }


  },
  //出售
  saleviewtap: function() {
    this.data.pageNumber = 1
    this.data.isPutOrOut = 'put'
    this.proalllistData('put')
    this.setData({
      saleselect: true,
      showchooseview: true
    })
  },
  //下架
  pullproviewtap: function() {
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
  recommenprolist: function(ids) {
    if (!ids) {
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
  allchoosetap: function() {
    this.data.choosepro = true
    var temchoose = this.data.isAllChoose
    this.setData({
      isAllChoose: !temchoose
    })
    var temparr = this.data.salelistArr
    if (this.data.isAllChoose) {
      //全部选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = true
      }
      this.setData({
        salelistArr: temparr,
        chooseProduct: temparr
      })
    } else {
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