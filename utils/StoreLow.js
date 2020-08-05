// pages/StoreManager/StoreLow/StoreLow.js
var urlApi = require('../utils/util.js')
var rootUrls = require('../utils/rootUrl.js')

function loadNav(self,selindex) {
  self.setData({
    'pageNumber': 1,
    'scrolowerLoadstore': false
  })
}
function adjectivePageNumber(self) {
  self.setData({
    'pageNumber': 1,
  })
}
function refreshSalelistData(self,tempArr) {
  self.setData({
    'storesalelistArr': tempArr,
  })
}
// 获取数据
function proalllistData(self, saleorlowindex, protitle, choosecaterid) {
  var url = ''
  if (self.data.isonecatertap) {
    url = rootUrls.onecaterallproUrl
  } else {
    url = rootUrls.goodslistUrl
  }
  let para = { "currentPage": self.data.pageNumber, "pageSize": 10, "where": { "isMarketable": saleorlowindex == 0 ? "put" : "out", "shopId": wx.getStorageSync("chooseshopid"), "categoryId": choosecaterid, "title": protitle } }
  // console.log('刷新',url,para)
  urlApi.getInfo(url, para, "POST")
    .then(res => {
      console.log('批量管理',res)
      wx.hideLoading()
        if (self.data.pageNumber == 1) {
          var temparr = []
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          self.setData({
            storesalelistArr: temparr,
            storewheredata: res.page.where,
          })
        } else {
          var temparr = self.data.storesalelistArr
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            pro.price = urlApi.fen2Yuan(pro.price)
            temparr.push(pro)
          }
          self.setData({
            storesalelistArr: temparr,
            storewheredata: res.page.where,
            pageNumber: res.page.currentPage
          })
        }
      if (self.data.storesalelistArr.length > self.data.selidsArr.length){
        self.setData({
          isAllChoose : false
        })
      }
      if (res.page.list.length < 10) {
        self.setData({
          scrolowerLoadstore: false
        })
      } 
    })
}

//虚拟商品列表
// adjectiveShopUrl

function firstload(self, selindex, protitle, choosecaterid) {
  self.data.pageNumber = 1
  proalllistData(self, selindex, protitle,choosecaterid)
}
function nextload(self, selindex, protitle, choosecaterid) {
  self.setData({
    scrolowerLoadstore: true
  })
  self.data.pageNumber++
  console.log('分类', choosecaterid)
  proalllistData(self, selindex, protitle, choosecaterid)
  
}
function avatarErrorstore(self, e) {
  var errorImgIndex = e.currentTarget.dataset.idx
  var tempshop = self.data.storesalelistArr
  tempshop[errorImgIndex].coverImage = "/pages/images/storeManager/productIcon.png"
  self.setData({
    storesalelistArr: tempshop
  })
}
module.exports = {
  loadNav: loadNav,
  proalllistData: proalllistData,
  firstload: firstload,
  nextload: nextload,
  adjectivePageNumber: adjectivePageNumber,
  refreshSalelistData: refreshSalelistData,
  avatarErrorstore: avatarErrorstore
}