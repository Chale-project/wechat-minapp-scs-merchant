// pages/StoreManager/ProChooseList/ProChooseList.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secdata: [],
    recommen: '',
    caterIdlist: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.recommen = options.recommen
    this.data.caterIdlist = app.globalData.caterIdlist
    console.log(this.data.caterIdlist)
    this.getcaterlist()
  },


  onShow: function(options) {
    if (app.globalData.couponProductList.length == 0) {
      return
    }
    for (let j = 0; j < app.globalData.couponProductList.length; j++) {
      var addtocateridlist = true;
      if (!app.globalData.couponProductList[j].firstId) {
        continue
      }
      var id = app.globalData.couponProductList[j].firstId
      for (let i = 0; i < this.data.secdata.length; i++) {
        if (id == this.data.secdata[i].id) {
          this.data.secdata[i].proSelecte = true
        }
        if (this.data.secdata[i].sublevels) {
          for (let k = 0; k < this.data.secdata[i].sublevels.length; k++) {
            if (id == this.data.secdata[i].sublevels[k].id) {
              this.data.secdata[i].sublevels[k].proSelecte = true
            }
          }
        }
      }


      for (let i = 0; i < this.data.caterIdlist.length; i++) {
        if (id == this.data.caterIdlist[i]) {
          addtocateridlist = false
        }
      }

      if (addtocateridlist) {
        this.data.caterIdlist.push(id)
      }
    }
    console.log("onshow==", this.data.secdata)
    this.setData({
      secdata: this.data.secdata
    })
  },


  saveData: function() {
    if (this.data.caterIdlist.length == 0) {
      app.globalData.couponProductList = []
    }
    console.log("最终选择数据", app.globalData.couponProductList)
    wx.navigateBack({})
  },



  //获取分类列表
  getcaterlist: function() {
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.procaterlistUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        // 调用获取用户信息接口,用户信息存储在偏好
        console.log(1, res, 1)
        var tempsecdata = res.list

        for (let i = 0; i < tempsecdata.length; i++) {
          var id1 = tempsecdata[i].id
          for (let j = 0; j < this.data.caterIdlist.length; j++) {
            var chooseId = this.data.caterIdlist[j]
            if (id1 == chooseId) {
              tempsecdata[i].proSelecte = true
              break
            } else {
              tempsecdata[i].proSelecte = false
            }
          }
        }
        for (let i = 0; i < tempsecdata.length; i++) {
          var child = tempsecdata[i].sublevels
          if (child != null) {
            for (let k = 0; k < child.length; k++) {
              var originid2 = child[k].id
              for (let j = 0; j < this.data.caterIdlist.length; j++) {
                var chooseId = this.data.caterIdlist[j]
                if (originid2 == chooseId) {
                  tempsecdata[i].sublevels[k].proSelecte = true
                  break
                } else {
                  tempsecdata[i].sublevels[k].proSelecte = false
                }
              }
            }
          }
        }
        this.setData({
          secdata: tempsecdata
        })
      })
  },
  //收起和展开分类
  shoutap: function(e) {
    var selectindex = e.currentTarget.dataset.idx
    var temparrlist = this.data.secdata
    if (temparrlist[selectindex].name == "未分类") {
      wx.navigateTo({
        url: '../CaterProList2/CaterProList2?procaterid=' + 'noCate' + '&recommen=' + this.data.recommen,
      })
    } else {
      if (temparrlist[selectindex].sublevels.length > 0) {
        //有子分类
        temparrlist[selectindex].showorhide = !temparrlist[selectindex].showorhide
        this.setData({
          secdata: temparrlist
        })
      } else {
        //无子分类
        wx.navigateTo({
          url: '../CaterProList2/CaterProList2?procaterid=' + temparrlist[selectindex].id + '&recommen=' + this.data.recommen,
        })
      }
    }
  },
  shousectap: function(e) {
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var temparrlist = this.data.secdata
    //无子分类
    wx.navigateTo({
      url: '../CaterProList2/CaterProList2?procaterid=' + temparrlist[idx].sublevels[idy].id + '&recommen=' + this.data.recommen,
    })
  },

  check1: function(e) {
    var pos = e.currentTarget.dataset.idx
    if (this.data.secdata[pos].proSelecte) {
      this.data.secdata[pos].proSelecte = false
      for (let i = 0; i < this.data.caterIdlist.length; i++) {
        var chooseId = this.data.caterIdlist[i]
        if (this.data.secdata[pos].id == chooseId) {
          this.data.caterIdlist.splice(i, 1)
          break
        }
      }


      var isDelete = true;
      for (let j = 0; j < app.globalData.couponProductList.length; j++) {
        if (!app.globalData.couponProductList[j].firstId) {
          continue
        }
        if (app.globalData.couponProductList[j].firstId == this.data.secdata[pos].id) {
          // if (app.globalData.couponProductList[j].secondId.length == 0) {
          app.globalData.couponProductList.splice(j, 1)
          break
          // } else {
          //   app.globalData.couponProductList[j].firstId = ""
          //   break
          // }
        }
      }

    } else {
      this.data.secdata[pos].proSelecte = true
      var isAdd = true;
      for (let i = 0; i < this.data.caterIdlist.length; i++) {
        var chooseId = this.data.caterIdlist[i]
        if (this.data.secdata[pos].id == chooseId) {
          isAdd = false
          break
        }
      }
      if (isAdd) {
        this.data.caterIdlist.push(this.data.secdata[pos].id)
      }


      var addToGlobal = true;
      for (let j = 0; j < app.globalData.couponProductList.length; j++) {
        if (!app.globalData.couponProductList[j].firstId) {
          continue
        }
        if (app.globalData.couponProductList[j].firstId == this.data.secdata[pos].id) {
          addToGlobal = false
        }
      }
      if (addToGlobal) {
        var json = {
          'firstId': this.data.secdata[pos].id,
          'secondId': []
        }
        app.globalData.couponProductList.push(json)
      }
    }

    console.log("列表数据", this.data.caterIdlist)
    app.globalData.caterIdlist = this.data.caterIdlist

    this.setData({
      caterIdlist: this.data.caterIdlist,
      secdata: this.data.secdata
    })
  },

  check2: function(e) {
    var pos1 = e.currentTarget.dataset.idx
    var pos2 = e.currentTarget.dataset.idy

    if (this.data.secdata[pos1].sublevels[pos2].proSelecte) {
      this.data.secdata[pos1].sublevels[pos2].proSelecte = false
      for (let i = 0; i < this.data.caterIdlist.length; i++) {
        var chooseId = this.data.caterIdlist[i]
        if (this.data.secdata[pos1].sublevels[pos2].id == chooseId) {
          this.data.caterIdlist.splice(i, 1)
          break
        }
      }

      var isDelete = true;
      for (let j = 0; j < app.globalData.couponProductList.length; j++) {
        if (!app.globalData.couponProductList[j].firstId) {
          continue
        }
        if (app.globalData.couponProductList[j].firstId == this.data.secdata[pos1].sublevels[pos2].id) {
          // if (app.globalData.couponProductList[j].secondId.length == 0) {
          app.globalData.couponProductList.splice(j, 1)
          break
          // } else {
          //   app.globalData.couponProductList[j].firstId = ""
          //   break
          // }
        }
      }


    } else {
      this.data.secdata[pos1].sublevels[pos2].proSelecte = true
      var isAdd = true;
      for (let i = 0; i < this.data.caterIdlist.length; i++) {
        var chooseId = this.data.caterIdlist[i]
        if (this.data.secdata[pos1].sublevels[pos2].id == chooseId) {
          isAdd = false
          break
        }
      }
      if (isAdd) {
        this.data.caterIdlist.push(this.data.secdata[pos1].sublevels[pos2].id)
      }

      var addToGlobal = true;
      for (let j = 0; j < app.globalData.couponProductList.length; j++) {
        if (!app.globalData.couponProductList[j].firstId) {
          continue
        }
        if (app.globalData.couponProductList[j].firstId == this.data.secdata[pos1].sublevels[pos2].id) {
          addToGlobal = false
        }
      }
      if (addToGlobal) {
        var json = {
          'firstId': this.data.secdata[pos1].sublevels[pos2].id,
          'secondId': []
        }
        app.globalData.couponProductList.push(json)
      }

    }

    app.globalData.caterIdlist = this.data.caterIdlist
    console.log("list", app.globalData.couponProductList)
    this.setData({
      caterIdlist: this.data.caterIdlist,
      secdata: this.data.secdata,
    })
  },

})