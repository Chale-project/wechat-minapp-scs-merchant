// pages/StoreManager/StoreSale/StoreSale.js
var urlApi = require('../utils/util.js')
var rootUrls = require('../utils/rootUrl.js')

function loadNav(self) {
  self.setData({
    'navtitledata': [{
      "name": "添加时间",
    },
      {
        "name": "总销量",
      }, {
        "name": "库存",
      }],
    'pageNumber': 1,
    'kucunSel': '0',
    'shengOrJiang0': true,
    'shengOrJiang1': true,
    'shengOrJiang2': true,
    'shengOrJiang3':true,
    'isRefreshing':false,
    'scrolowerLoad': false
  })
}
function adjectivePageNumber(self){
  self.setData({
    'pageNumber': 1,
  })
}
function choosekucun(self, idx, selindex, protitle, choosecaterid){
  //点击的显示排序标记,再次点击同一个改顺序
  var lastIdx = wx.getStorageSync('kuncunIdx')
  var temp = true
  if (idx == 0){
    var shenJian1 = self.data.shengOrJiang0
    //连续点击两次时
    if (lastIdx == idx) {
      //保存每个idx对应的升降
      self.setData({
        'shengOrJiang0': !shenJian1,
      })
    }
    temp = self.data.shengOrJiang0
  }else if(idx==1){
    var shenJian2 = self.data.shengOrJiang1
    if (lastIdx == idx) {
      //保存每个idx对应的升降
      self.setData({
        'shengOrJiang1': !shenJian2,
      })
    }
    temp = self.data.shengOrJiang1
  }else{
    var shenJian3 = self.data.shengOrJiang2
    if (lastIdx == idx) {
      //保存每个idx对应的升降
      self.setData({
        'shengOrJiang2': !shenJian3,
      })
    }
    temp = self.data.shengOrJiang2
  }
  wx.setStorageSync('kuncunIdx', idx)
  self.setData({
    'kucunSel': idx,
    'shengOrJiang3': temp
  })
  //刷新数据
  prolistData(self, selindex, protitle, choosecaterid)
}
function firstload(self, selindex, protitle, choosecaterid) {
  self.data.pageNumber = 1
  prolistData(self, selindex, protitle, choosecaterid)
}
function nextload(self, selindex, protitle, choosecaterid){
  self.setData({
    scrolowerLoad: true
  })
  self.data.pageNumber++
  prolistData(self, selindex, protitle, choosecaterid)
}
function prolistData(self, selindex, protitle, choosecaterid) {
  // wx.showLoading({
  //   title: '加载中...',
  // })
  if(self.data.isRefreshing){
    return
  }
  self.data.isRefreshing = true
  var paixu = ""
   if (self.data.kucunSel == 1){
    //销量
    if (self.data.shengOrJiang3 == true) {
      paixu = "storeAsc"
    } else {
      paixu = "storeDesc"
    }
  }else if (self.data.kucunSel == 2){
    //库存
    if (self.data.shengOrJiang3 == true) {
      paixu = "numAsc"
    } else {
      paixu = "numDesc"
    }
  }else{
    //时间
    if (self.data.shengOrJiang3 == true) {
      paixu = "timeAsc"
    } else {
      paixu = "timeDesc"
    }
  }
  //判断点击的是否是一级分类
  var url = ''
  if (self.data.isonecatertap){
    url = rootUrls.onecaterallproUrl
  }else{
    url = rootUrls.goodslistUrl
  }
  var para = { "shopId": wx.getStorageSync("chooseshopid"), "isMarketable": selindex == 0 ? "put" : "out", [paixu]: "true", "title": protitle, "categoryId": choosecaterid }
  // isMarketable
  urlApi.getInfo(url, { "currentPage": self.data.pageNumber, "pageSize": 10, "where": para }, 'POST')
    .then(res => {
      self.data.isRefreshing = false
      wx.hideLoading()
        //pageNumber==1清空数组其余时候累加
        if(self.data.pageNumber == 1) {
          var temparr = []
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          self.setData({
            salelistArr: temparr,
            wheredata: res.page.where,
          })
        }else{
          var temparr = self.data.salelistArr
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          //判断如果res.page.list返回0则显示没有更多数据了,上拉时底部显示加载动画
          self.setData({
            salelistArr: temparr,
            wheredata: res.page.where,
            pageNumber: res.page.currentPage
          })
        }
        if(res.page.list.length < 10){
          self.setData({
            scrolowerLoad: false
          })
        }
    })
}

function avatarError(self,e) {
  var errorImgIndex = e.currentTarget.dataset.idx
  var tempshop = self.data.salelistArr
  tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
  self.setData({
    salelistArr: tempshop
  })
}

module.exports = {
  loadNav: loadNav,
  adjectivePageNumber: adjectivePageNumber,
  choosekucun: choosekucun,
  prolistData: prolistData,
  avatarError: avatarError,
  nextload: nextload,
  firstload: firstload
}