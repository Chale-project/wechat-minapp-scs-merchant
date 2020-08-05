// pages/mainClass/SkillDataShow/SkillDataShow.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titledata: [{
      "name": "秒杀价",
      "descrip": "¥ 0.00"
    },
    {
      "name": "总销量",
      "descrip": "0"
    }, {
      "name": "总销售额",
      "descrip": "¥ 0.00"
    }],
    screenHeighth: 0,
    buyOrderlistArr: [],
    pageNumber:1,
    scrolowerLoad: false,
    proid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      proid: options.proid,
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    console.log('商品id',this.data.proid)
    this.getSkillData()
  },
  getSkillData:function(){
    let para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "seckillGoodsId": this.data.proid } }
    urlApi.getInfo(rootUrls.productSkillDetailUrl, para, "post")
      .then(res => {
        console.log('报表',res)
        wx.hideLoading()
        if (this.data.pageNumber == 1) {
          this.setData({
            buyOrderlistArr: res.page.list,
            whereData: res.page.where,
            titledata: [{
              "name": "秒杀价",
              "descrip": "¥ " + urlApi.fen2Yuan(res.page.where.seckillPrice)
            },
            {
              "name": "总销量",
              "descrip": res.page.where.stockCount ? res.page.where.stockCount:0
            }, {
              "name": "总销售额",
              "descrip": "¥ " + urlApi.fen2Yuan(res.page.where.sumMoney)
            }],
          })
        } else {
          var temparr = this.data.buyOrderlistArr
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            temparr.push(pro)
          }
          this.setData({
            buyOrderlistArr: temparr,
            whereData: res.page.where,
            pageNumber: res.page.currentPage
          })
        }
        if (res.page.list.length < 10) {
          this.setData({
            scrolowerLoad: false
          })
        }
      })
  },
  // 上拉加载更多
  scrolower: function (e) {
    this.data.pageNumber++
    this.setData({
      scrolowerLoad:true
    })
    this.getSkillData()
  },
  avatarError: function (e) {
    var idx = e.currentTarget.dataset.idx
    var templistarr = this.data.buyOrderlistArr
    templistarr[idx].headPic = '/pages/images/addStore/chooseStoreLogo.png'
    this.setData({
      buyOrderlistArr: templistarr
    })
  },

})