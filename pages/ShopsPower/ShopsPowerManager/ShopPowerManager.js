// pages/ShopsPower/ShopsPowerManager/ShopPowerManager.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountlistArr: '',
    pageNumber: 1,
    scrolowerLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.pageNumber = 1
    this.accountlistdata()
  },
  accountlistdata:function (){
    let para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "shopId": wx.getStorageSync("chooseshopid") } }
    console.log('para',para)
    urlApi.getInfo(rootUrls.searchopratelistUrl, para, "post")
      .then(res => {
        console.log('shop',res)
        if (res.page.list.length < 10) {
          this.setData({
            scrolowerLoad: false
          })
        }
        this.setData({
          accountlistArr: res.page.list
        })
      })
  },
  scrolower: function () {
    //判断是上架还是下架 10/10 12/20
    this.setData({
      scrolowerLoad: true
    })
    this.data.pageNumber++
    this.accountlistdata()
  },
  //岗位管理
  jobmanagerviewtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsJobManager/ShopsJobManager',
    })
  },
  //新建子账号
  addAccountviewtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsAddSubAccount/ShopsAddSubAccount',
    })
  },
  //账号编辑
  accountitemtap: function (e) {
    let index = e.currentTarget.dataset.idx
    let operatorId = this.data.accountlistArr[index].id
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsAccountEdit/ShopsAccountEdit?operatorId=' + operatorId,
    })
  }
})