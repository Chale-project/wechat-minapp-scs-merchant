// pages/ShopsPower/ShopsJobManager/ShopsJobManager.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountlistArr:'',
    ischoosejob:'',
    tapEdit:false,//点击了编辑按钮
    pageNumber:'1',
    screenHeighth: 0,
    scrolowerLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.ischoosejob){
      this.setData({
        ischoosejob: options.ischoosejob
      })
    }
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
  },
  onShow: function (options) {
    //岗位管理列表
    this.data.pageNumber = 1
    this.getjoblist()
  },
  getjoblist:function () {
    let para = { "currentPage": this.data.pageNumber, "pageSize": 10, "where": { "shopId": wx.getStorageSync("chooseshopid")}}
    urlApi.getInfo(rootUrls.searchShopRoleListUrl, para, "post")
      .then(res => {
        console.log('list',res)
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
    this.getjoblist()
  },
  //新建岗位
  addnewjobtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsAddNewJob/ShopsAddNewJob?addedit=' + 'false',
    })
  },
  //编辑岗位
  editejobtap: function (e) {
    this.data.tapEdit = true
    //获取roleid
    var idx = e.currentTarget.dataset.idx
    let id = this.data.accountlistArr[idx].id
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsAddNewJob/ShopsAddNewJob?addedit=' + 'true' + '&roleid=' + id,
    })
  },
  //选择岗位
  jobmanager: function (e) {
    if (this.data.ischoosejob == 'true' && !this.data.tapEdit){
      let index = e.currentTarget.dataset.idx
      let roleid = this.data.accountlistArr[index].id
      let roleName = this.data.accountlistArr[index].roleName
      var pages = getCurrentPages();   //当前页面
      var prevPage = pages[pages.length - 2];   //上一页面
      prevPage.setData({
        //直接给上一个页面赋值
        chooseRoleId: roleid,
        chooseRoleName: roleName
      })
      wx.navigateBack({
        
      })
    }
    this.data.tapEdit = false
  }
  
})