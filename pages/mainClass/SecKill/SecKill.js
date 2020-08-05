// pages/mainClass/SecKill/SecKill.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var skillItemApi = require('../../../utils/SecKillItem.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    caterIndex:2,
    shareproid:'',
    screenHeighth: 0
  },
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    skillItemApi.loadNav(this)
    wx.showLoading({
      title: '加载中...',
    })
  },
  onShow: function (options) {
    skillItemApi.prolistData(this, this.data.caterIndex)
  },
  addSpeedTap: function () {
    wx.navigateTo({
      url: '../SecKillChoose/SecKillChoose',
    })
  },
  // 图片加载失败
  avatarError: function (e) {
    skillItemApi.avatarError(this,e)
  },
  onClickindex: function (e) {
    skillItemApi.adjectivePageNumber(this)
    this.data.caterIndex = e.detail.index
    skillItemApi.prolistData(this, this.data.caterIndex)
  },
  //上拉
  scrolower: function (e) {
    skillItemApi.nextload(this, this.data.caterIndex)
  },
  //点击删除
  deletetapview: function (e) {
    let idx = e.currentTarget.dataset.idx
    skillItemApi.deletprowithId(this, this.data.salelistArr[idx].id, this.data.caterIndex)
  },
  sharetapview: function (e) {
    let idx = e.currentTarget.dataset.idx
    
  },
  //分享商品
  sharetapview: function (e) {
    // let idx = e.currentTarget.dataset.idx
    // let shareid = this.data.salelistArr[idx].id
    // this.data.shareproid = shareid
    // console.log('分享', idx, this.data.shareproid)
    // return {
    //   title: '分享秒杀商品',
    //   path: '/page/user?id=123'
    // }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      // title: '分享秒杀商品',
      // path: '/pages/mainClass/SecKill/SecKill?shareproid='+this.data.shareproid,
      path:'<navigator target="miniProgram" open-type="navigate" app-id="wx7436db30611b1d9d" path="pages/index/index" extra-data="{{}}" version="develop" bindsuccess="toMiniProgramSuccess">点击超链接打开绑定的小程序</navigator>',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  toMiniProgramSuccess(res) {
    wx.showToast({
      title: '通过超链接跳转其他小程序成功返回了'
    })
  },
  //秒杀设置详情
  skillgoodsdetaitap: function (e) {
    let idx = e.currentTarget.dataset.idx
    let choosePro =this.data.salelistArr[idx]
    wx.navigateTo({
      url: '/pages/mainClass/SkillSetDetail/SkillSetDetail?seckillid=' + choosePro.id,
    })
  },
  //报表
  datashowtapview: function (e) {
    let idx = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: '/pages/mainClass/SkillDataShow/SkillDataShow?proid='+this.data.salelistArr[idx].id,
    })
  },
  onUnload:function () {
    wx.setStorageSync('SkillSetDetailData', '')
    console.log('skill页面卸载')
  }

})