// pages/mainClass/ShopGuangErGao/ShopGuangErGao.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtitledata: [{ 'picPath': '', 'goodsId': '', 'goodsName': '', 'goodsPic': '', 'goodsPrice': '' }, { 'picPath': '', 'goodsId': '', 'goodsName': '', 'goodsPic': '', 'goodsPrice': '' }],
    guangid:'',//判断是否有添加过
    showGuangAddress:false,
    addresstitle:['商品链接','取消'],
    curproid:'',
    guangaoDic:{},//记录点击的广告
    guangaoidx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询当前广告详情
    this.getdetailguanglist()
  },
  onShow: function (options) {
    console.log('guangaoDic', this.data.guangaoDic)
    if (this.data.guangaoDic.id){
      var temparr = this.data.navtitledata
      temparr[this.data.guangaoidx].goodsId = this.data.guangaoDic.id
      temparr[this.data.guangaoidx].goodsName = this.data.guangaoDic.title
      temparr[this.data.guangaoidx].goodsPic = this.data.guangaoDic.coverImage
      temparr[this.data.guangaoidx].goodsPrice = this.data.guangaoDic.price
      this.setData({
        navtitledata: temparr
      })
    }
  },
  getdetailguanglist:function () {
    urlApi.getInfo(rootUrls.searchShopGuangUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        console.log('detail', res)
        if(res.info.id){
          this.setData({
            navtitledata: res.info.files,
            guangid: res.info.id
          })
        }
      })
  },
  deletitem:function (e) {
    var temparr = this.data.navtitledata
    var idx = e.currentTarget.dataset.idx
    temparr.splice(idx, 1)
    this.setData({
      navtitledata:temparr
    })
  },
  additem:function () {
    var temparr = this.data.navtitledata
    if(temparr.length<6){
      temparr.push({ 'picPath': '', 'goodsId': '', 'goodsName': '', 'goodsPic': '', 'goodsPrice': '' })
      this.setData({
        navtitledata: temparr
      }) 
    }else{
      wx.showToast({
        icon: 'none',
        title: '最多添加6个广告',
      })
    }
  },
  //添加广告图片
  avatarError: function (e) {

  },
  uploadtap: function (e) {
    var temptitle = this.data.navtitledata
    var idx = e.currentTarget.dataset.idx

    wx.navigateTo({
      url: '/pages/mainClass/cutInside/cutInside?uploadGoodImageUrl=' + temptitle[idx].picPath + '&isfrom=' +'ShopGuangErGao' + '&imageidx=' + idx,
    })
    // return
    // urlApi.getPicutreInfo()
    //   .then(restwo => {
    //     temptitle[idx].picPath = restwo.url
    //     this.setData({
    //       navtitledata: temptitle
    //     })
    //   })
  },
  addGuangAddressTap:function (e) {
    //记录编辑的是第几个广告
    this.setData({
      guangaoidx: e.currentTarget.dataset.idx,
      showGuangAddress: true
    })
  },
  onClose: function() {
    this.setData({
      showGuangAddress: false
    })
  },
  addressitemtap: function (e) {
    var idx = e.currentTarget.dataset.idx
   if (idx == 0){
     
      wx.navigateTo({
        url: '../ShopChooseProGuang/ShopChooseProGuang',
      })
    }
    this.setData({
      showGuangAddress: false
    })
  },
  updateprotap: function (e) {
    this.setData({
      guangaoidx: e.currentTarget.dataset.idx,
      showGuangAddress: true
    })
  },
  //保存
  savetap: function () {
    // 判断是否是第一次新增
    //判断是否有封面图,没有则提示 { 'picPath': '', 'goodsId': '', 'goodsName': '', 'goodsPic': '', 'goodsPrice': '' }
    var temparr = this.data.navtitledata
    for (let i = 0; i < temparr.length;i++){
      var temi = i+1
      if(temparr[i].picPath.length<1){
        wx.showToast({
          icon: 'none',
          title: '请选择第'+ temi +'组广告图片',
        })
        return
      }
    }
    if (this.data.guangid.length>0){
      //调用修改接口
      this.savelist('PUT')
    }else{
      //调用新增接口
      this.savelist('POST')
    }
  },
  // 保存数据
  savelist:function (getOrPost){
    wx.showLoading({
      title: '正在保存...',
    })
    let para = { "shopId": wx.getStorageSync("chooseshopid"), "files": this.data.navtitledata, 'id': this.data.guangid }
    console.log('save', para)
    urlApi.getInfo(getOrPost == 'POST' ? rootUrls.addshopGuangergaoUrl : rootUrls.changeGuangUrl, para, getOrPost)
      .then(res => {
        console.log('保存成功',res)
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
        wx.navigateBack({

        })
      })
  }
})