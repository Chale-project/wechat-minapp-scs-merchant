// pages/mainClass/Integration/Integration.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // data1: [{
    //   name: '永久有效'
    // }, {
    //   name: '从获得开始至次年最后一天'
    // }, {
    //   name: '从获得开始至第3年最后一天'
    // }, {
    //   name: '从获得开始至第4年最后一天'
    // }, {
    //   name: '从获得开始至第5年最后一天'
    // }],

    data2: [{
      name: '10'
    }, {
      name: '20'
    }, {
      name: '30'
    }, {
      name: '40'
    }, {
      name: '50'
    }],

    data3: [{
      name: '1'
    }, {
      name: '2'
    }, {
      name: '5'
    }, {
      name: '10'
    }],
    exchangePrice: "",
    exchangeRatio: "",
    expiryDate: "",
    integralStatus: "disabled",
    shoppingIntegral: "",
    sppIntStatus: false,
    choose1: "",
    choose2: "",
    choose3: "",
    isModify: false,
    integralId: "",
    choose0: 0,
    signIntegral: 'disabled',
    detail2: false,
    detail3: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    this.getIntegral()

    this.setData({
      isModify: this.data.isModify,
      btnName: "保存"
    })
  },

  //赠送比例
  integral1: function(e) {
    this.setData({
      shoppingIntegral: e.detail.value,
      choose1: e.detail.value
    })
  },
  //1积分等于多少
  integral2: function(e) {

    this.setData({
      exchangePrice: e.detail.value * 100,
      choose0: (1 / e.detail.value).toFixed(2)
    })
  },
  //抵扣比例
  integral3: function(e) {
    this.setData({
      choose3: e.detail.value,
      exchangeRatio: e.detail.value
    })
  },

  sureModal: function(e) {
    let that = this
    urlApi.getInfo(rootUrls.closeIntegral + wx.getStorageSync("chooseshopid"), {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: '积分设置已关闭',
          })
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    this.setData({
      modalName: null
    })
  },




  getIntegral: function() {
    let that = this
    urlApi.getInfo(rootUrls.getIntegral + wx.getStorageSync("chooseshopid"), {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res.info)
        if (res.code == 0) {
          if (!res.info) {
            return
          }
          that.data.isModify = true
          that.data.exchangePrice = res.info.exchangePrice //兑换金额
          that.data.choose0 = (1 / (that.data.exchangePrice / 100)).toFixed(2)
          that.data.exchangeRatio = res.info.exchangeRatio //抵扣
          that.data.integralStatus = res.info.integralStatus //积分开通 enabled启用disabled禁用
          that.data.shoppingIntegral = res.info.shoppingIntegral //购物送积分比例%
          that.data.sppIntStatus = res.info.sppIntStatus //购物送积分状态enabled启用disabled禁用
          that.data.integralId = res.info.id
          that.setData({
            choose0: that.data.choose0,
            choose1: that.data.shoppingIntegral + "",
            choose2: that.data.exchangePrice / 100 + "",
            choose3: that.data.exchangeRatio + "",
            sppIntStatus: res.info.sppIntStatus,
            isModify: that.data.isModify,
            signIntegral: res.info.signIntegral,
            btnName: "保存"
          })
          // if (that.data.integralStatus == "disabled") {
          //   that.setData({
          //     btnName: "开启"
          //   })
          // } else {
          //   that.setData({
          //     btnName: "保存"
          //   })
          // }
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  addIntegration: function() {
    let that = this
    urlApi.getInfo(rootUrls.addIntegral, {
        "id": that.data.integralId,
      "exchangePrice": that.data.exchangePrice == ""?0:that.data.exchangePrice , //兑换金额
      "exchangeRatio": that.data.exchangeRatio == "" ? 0 : that.data.exchangeRatio , //兑换比例---抵扣
        "expiryDate": "", //积分有效期
        "integralStatus": "enabled", //积分开通 enabled启用disabled禁用
        // "merchantId": wx.getStorageSync("chooseshopid"), //商户id
        "shopId": wx.getStorageSync("chooseshopid"), //店铺id
      "shoppingIntegral": that.data.shoppingIntegral == "" ? 0 : that.data.shoppingIntegral, //购物送积分比例%
        "sppIntStatus": that.data.sppIntStatus, //购物送积分状态enabled启用disabled禁用
        "signIntegral": that.data.signIntegral
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  modifyIntegration: function() {
    let that = this
    urlApi.getInfo(rootUrls.modifyIntegral, {
        "id": that.data.integralId,
        "exchangePrice": that.data.exchangePrice, //兑换金额
        "exchangeRatio": that.data.exchangeRatio, //兑换比例---抵扣
        "expiryDate": "", //积分有效期
        "integralStatus": "enabled", //积分开通 enabled启用disabled禁用
        // "merchantId": wx.getStorageSync("chooseshopid"), //商户id
        "shopId": wx.getStorageSync("chooseshopid"), //店铺id
        "shoppingIntegral": that.data.shoppingIntegral, //购物送积分比例%
        "sppIntStatus": that.data.sppIntStatus, //购物送积分状态enabled启用disabled禁用
        "signIntegral": that.data.signIntegral
      }, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  closeIntegral: function() {
    this.setData({
      modalName: 'show'
    })
  },


  chooseData2: function(e) {
    console.log(1, e)
    this.setData({
      modalName1: 'show',
      dataList1: this.data.data2
    })
  },
  d: function(e) {
    console.log(1, e)
  },
  chooseData3: function(e) {
    console.log(2, e)
    this.setData({
      modalName2: 'show',
      dataList2: this.data.data3
    })
  },

  chooseData4: function(e) {
    console.log(3, e)
    this.setData({
      modalName3: 'show',
      dataList3: this.data.data2
    })
  },
  //赠送比例
  radioChange1: function(e) {
    console.log(4, e)
    this.data.shoppingIntegral = e.detail.value
    this.setData({
      choose1: e.detail.value + "%"
    })
  },
  //1个积分等于
  radioChange2: function(e) {
    console.log(5, e)
    this.data.exchangePrice = e.detail.value
    var data = e.detail.value / 100
    switch (data) {
      case 0.01:
        this.data.choose0 = 100
        break
      case 0.02:
        this.data.choose0 = 50
        break
      case 0.05:
        this.data.choose0 = 20
        break
      case 0.1:
        this.data.choose0 = 10
        break
    }
    this.setData({
      choose2: data + "元",
      choose0: this.data.choose0
    })
  },
  //抵扣最高比例
  radioChange3: function(e) {
    console.log(6, e)
    this.data.exchangeRatio = e.detail.value
    this.setData({
      choose3: e.detail.value + "%"
    })
  },

  hideModal: function(e) {
    this.setData({
      modalName1: '',
      modalName2: '',
      modalName3: '',
      modalName: null
    })
  },

  //购物送积分
  switch1Change: function(e) {
    console.log(e)
    if (!e.detail.value) {
      this.setData({
        detail2: e.detail.value,
        modalName2: "show"
      })
    } else {
      if (e.detail.value) {
        this.data.sppIntStatus = "enabled"
      } else {
        this.data.sppIntStatus = "disabled"
      }
      this.setData({
        sppIntStatus: this.data.sppIntStatus
      })
    }
  },
  //签到领取积分 
  switch2Change: function(e) {
    if (!e.detail.value) {
      this.setData({
        detail3: e.detail.value,
        modalName3: "show"
      })
    } else {
      if (e.detail.value) {
        this.data.signIntegral = "enabled"
      } else {
        this.data.signIntegral = "disabled"
      }
      this.setData({
        signIntegral: this.data.signIntegral
      })
    }

  },

  hideModal2: function(e) {

    this.setData({
      sppIntStatus: this.data.sppIntStatus
    })
  },
  hideModal3: function(e) {
    this.setData({
      signIntegral: this.data.signIntegral
    })
  },


  sureModal2: function(e) {
    if (this.data.detail3) {
      this.data.sppIntStatus = "enabled"
    } else {
      this.data.sppIntStatus = "disabled"
    }
    this.setData({
      sppIntStatus: this.data.sppIntStatus
    })
  },

  sureModal3: function(e) {
    if (this.data.detail2) {
      this.data.signIntegral = "enabled"
    } else {
      this.data.signIntegral = "disabled"
    }
    this.setData({
      signIntegral: this.data.signIntegral
    })
  },

  closed: function(e) {
    this.data.integralStatus = "disabled"
    if (this.data.isModify) {
      this.closeIntegral()
    } else {
      wx.showToast({
        title: '请先添加积分设置',
      })
    }
  },
  save: function(e) {

    if (this.data.sppIntStatus == "enabled") {
      if (!this.data.shoppingIntegral) {
        wx.showToast({
          icon: 'none',
          title: '请输入赠送比例',
        })
        return
      }

      if (this.data.exchangePrice < 1) {
        wx.showToast({
          icon: 'none',
          title: '积分等值金额设置不得低于0.01',
        })
        return
      }


      if (this.data.exchangeRatio < 1 || this.data.exchangeRatio > 100) {
        wx.showToast({
          icon: 'none',
          title: '抵扣最高比例范围在1%到100%',
        })
        return
      }
    }else{
      if (this.data.integralStatus =="disabled"){

      }
    }

    // if (this.data.sppIntStatus == "disabled") {
    //   if (this.data.shoppingIntegral < 1 || this.data.shoppingIntegral > 100) {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '赠送比例范围在1%到100%',
    //     })
    //     return
    //   }

    // }
    // this.data.integralStatus = "enabled"
    wx.showLoading()
    if (this.data.isModify) {
      this.modifyIntegration()
    } else {
      this.addIntegration()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})