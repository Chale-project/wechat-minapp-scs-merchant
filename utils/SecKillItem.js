// pages/mainClass/SecKillItem/SecKillItem.js
var urlApi = require('../utils/util.js')
var rootUrls = require('../utils/rootUrl.js')
import Dialog from '../vantUi/dialog/dialog'

function loadNav(self) {
  self.setData({
    'pageNumber': 1,
    'scrolowerLoad': false
  })
}
function adjectivePageNumber(self) {
  self.data.pageNumber = 1
}
function firstload(self, caterIndex) {
  self.data.pageNumber = 1
  prolistData(self, caterIndex)
}
function nextload(self, caterIndex) {
  self.setData({
    scrolowerLoad: true
  })
  if (self.data.salelistArr.length<10){
    self.data.pageNumber = 1
    prolistData(self, caterIndex)
  }else{
    self.data.pageNumber++
    prolistData(self, caterIndex)
  }
}
function prolistData(self,caterIndex) {
  var prostate = ""
  if (caterIndex == 1){
    prostate = "notStarted"
  }else if(caterIndex == 2){
    prostate = "started"
  }else if(caterIndex == 3){
    prostate = "over"
  }else{
    prostate = ""
  }
  //修改key的值
  var para = { "shopId": wx.getStorageSync("chooseshopid"), "state": prostate}
  // isMarketable
  urlApi.getInfo(rootUrls.getSeckillGoodsUrl, { "currentPage": self.data.pageNumber, "pageSize": 10, "where": para }, "POST")
    .then(res => {
      console.log('商品列表',res)
      wx.hideLoading()
        //pageNumber==1清空数组其余时候累加
        if (self.data.pageNumber == 1) {
          
          var temparr = []
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.seckillPrice = urlApi.fen2Yuan(pro.seckillPrice)
            pro.originalPrice = urlApi.fen2Yuan(pro.originalPrice)
            temparr.push(pro)
          }
          self.setData({
            salelistArr: temparr
          })
        } else {
          var temparr = self.data.salelistArr
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.seckillPrice = urlApi.fen2Yuan(pro.seckillPrice)
            pro.originalPrice = urlApi.fen2Yuan(pro.originalPrice)
            temparr.push(pro)
          }
          self.setData({
            salelistArr: temparr,
            pageNumber: res.page.currentPage
          })
        }
        if(res.page.list.length<10){
          self.setData({
            scrolowerLoad: false
          })
        }
    })
}

function avatarError(self, e) {
  var errorImgIndex = e.currentTarget.dataset.idx
  var tempshop = self.data.salelistArr
  tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
  self.setData({
    salelistArr: tempshop
  })
}

function deletprowithId(self, id, caterIndex){
  Dialog.confirm({
    title: '提示',
    message: '是否确定删除该商品'
  })
    .then(() => {
      // on confirm
      //调用删除接口
      deletecaterwithid(self, id, caterIndex)
    }).catch(() => {
      // on cancel
    })
}
function deletecaterwithid(self, pid, caterIndex) {
  wx.showLoading({
    title: '删除中...',
  })
  urlApi.getInfo(rootUrls.deletseckillGoodsUrl + pid, {}, "PUT")
    .then(res => {
      console.log('删除', res)
      if (res.code == 0) {
        prolistData(self, caterIndex)
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
        })
      }
    })
}

module.exports = {
  loadNav: loadNav,
  prolistData: prolistData,
  avatarError: avatarError,
  nextload: nextload,
  firstload: firstload,
  deletprowithId: deletprowithId,
  adjectivePageNumber: adjectivePageNumber
}