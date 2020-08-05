// pages/mainClass/OrderManage/OrderManage.js

var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchtitle: "",
    state: "waitSending",
    pos: 1,
    page1: 1,
    page2: 1,
    page3: 1,
    page4: 1,
    page5: 1,
    dataList1: '',
    dataList2: '',
    dataList3: '',
    dataList4: '',
    dataList5: '',
    id: '',
    name: '',
    phone: '',
    scanResult: "",
    productList: [],
    enterCode: "",
    name: "",
    phone: "",
    isChooseOther: false,
    peoList: []
  },

  onChange: function(event) {
    this.data.pos = event.detail.index
    switch (this.data.pos) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.data.state = 'unpay'
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.data.state = 'waitSending'
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        this.data.state = 'waitReceiving'
        break
      case 3:
        this.data.page4 = 1
        this.data.dataList4 = []
        this.data.state = 'success'
        break
      case 4:
        this.data.page5 = 1
        this.data.dataList5 = []
        this.data.state = ''
        break
    }
    this.getOrderListData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    // wx.showLoading()
    // this.getOrderListData()
  },


  toSearch: function() {
    wx.navigateTo({
      url: '/pages/mainClass/OrderSearchPage/OrderSearchPage'
    })
  },

  // 输入框输入内容时 清空内容
  searchnameinput: function(e) {
    this.data.searchtitle = e.detail.value
  },
  // 点击输入搜索
  searchbutton: function() {
    wx.navigateTo({
      url: '/pages/mainClass/OrderSearchPage/OrderSearchPage?text=' + this.data.searchtitle + '&state=' + this.data.state,
    })
  },

  hideModal11: function() {
    this.setData({
      ScanDetail: ''
    })
  },
  scanSure: function() {
    wx.showLoading()
    this.scanProduct()
    this.setData({
      ScanDetail: ''
    })
  },

  //扫码核销
  scan: function() {

    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager3') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }

    let that = this
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res.result)
        that.getOrderDetail(res.result)
      }
    })
  },

  //获取订单详情
  getOrderDetail: function(id) {
    let that = this
    urlApi.getInfo(rootUrls.getOrderDetail + id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {

          for (let i = 0; i < res.info.orderDescModelList.length; i++) {
            res.info.orderDescModelList[i].price = urlApi.fen2Yuan(res.info.orderDescModelList[i].price)
          }

          that.data.scanResult = res.info.verificationCode
          that.setData({
            ScanDetail: 'show',
            orderDescModelList: res.info.orderDescModelList
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //选择配送人员
  chooseThis: function(e) {
    var pos = e.currentTarget.dataset.index
    if (this.data.peoList[pos].chooseState) {
      this.data.peoList[pos].chooseState = false
      this.data.name = ""
      this.data.phone = ""
    } else {
      for (var i = 0; i < this.data.peoList.length; i++) {
        this.data.peoList[i].chooseState = false
      }
      this.data.peoList[pos].chooseState = true
      this.data.name = this.data.peoList[pos].deliverymanName
      this.data.phone = this.data.peoList[pos].deliverymanPhone
    }

    if (this.data.peoList[pos].deliverymanName == "其它") {
      this.data.name = this.data.peoList[pos].name
      this.data.phone = ""
      this.setData({
        isChooseOther: this.data.peoList[pos].chooseState
      })
    } else {
      this.setData({
        isChooseOther: false
      })
    }

    this.setData({
      peoList: this.data.peoList,
      name: this.data.name,
      phone: this.data.phone
    })
  },



  //查询送货员列表和上次配送人信息
  getDeliveryMan: function() {
    let that = this
    urlApi.getInfo(rootUrls.deliveryman + wx.getStorageSync("chooseshopid"), {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          for (var i = 0; i < res.result.deliverymanList.length; i++) {
            if (this.data.phone == res.result.deliverymanList[i].deliverymanPhone && this.data.name == res.result.deliverymanList[i].deliverymanName) {
              
                res.result.deliverymanList[i].chooseState = true
              
            } else {
              res.result.deliverymanList[i].chooseState = false
            }
          }

          var json = {
            "addDataTime": null,
            "modifyDataTime": null,
            "deliverymanName": "其它",
            "deliverymanPhone": "",
            "deliverymanType": "",
            "name": ""
          }
          res.result.deliverymanList.push(json)

          this.setData({
            peoList: res.result.deliverymanList,
            'isShowSend': true
          })

        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },





  arrivedGoods: function(e) {
    this.data.id = e.currentTarget.dataset.item
    wx.showLoading()
    this.arrivdProductOut()
  },


  //已送达
  arrivdProductOut: function() {
    urlApi.getInfo(rootUrls.orderArrived + this.data.id, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            icon: 'none',
            title: "已送达",
          })
          switch (this.data.pos) {
            case 0:
              this.data.page1 = 1
              this.data.dataList1 = []
              break
            case 1:
              this.data.page2 = 1
              this.data.dataList2 = []
              break
            case 2:
              this.data.page3 = 1
              this.data.dataList3 = []
              break
            case 3:
              this.data.page4 = 1
              this.data.dataList4 = []
              break
            case 4:
              this.data.page5 = 1
              this.data.dataList5 = []
              break
          }
          this.getOrderListData()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //查看取货码
  showCode: function(e) {
    this.setData({
      showVerificationCode: 'show',
      verificationCode: e.currentTarget.dataset.item
    })
  },
  hideModal1: function() {
    this.setData({
      showVerificationCode: ''
    })
  },

  //获取订单列表
  getOrderListData: function() {
    let that = this
    var pos = 1
    switch (this.data.pos) {
      case 0:
        pos = this.data.page1
        break
      case 1:
        pos = this.data.page2
        break
      case 2:
        pos = this.data.page3
        break
      case 3:
        pos = this.data.page4
        break
      case 4:
        pos = this.data.page5
        break
    }


    urlApi.getInfo(rootUrls.orderList, {
        'currentPage': pos,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'state': this.data.state // unpay 未支付 paid已支付 waitSending 待发货 waitReceiving 待收货  shipped 已发货  receipted  已签收  cancel已取消 refund售后  success完成',
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {

          for (let i = 0; i < res.page.list.length; i++) {
            res.page.list[i].goodsPrice = urlApi.fen2Yuan(res.page.list[i].goodsPrice)
            res.page.list[i].payment = urlApi.fen2Yuan(res.page.list[i].payment)

            if (res.page.list[i].state == "waitReceiving" && res.page.list[i].deliveryType == "home") {
              res.page.list[i].isShowArrived = false
            } else {
              res.page.list[i].isShowArrived = true;
            }

            for (let j = 0; j < res.page.list[i].orderDescModelList.length; j++) {
              res.page.list[i].orderDescModelList[j].price = urlApi.fen2Yuan(res.page.list[i].orderDescModelList[j].price)
            }
          }



          switch (that.data.pos) {
            case 0:
              if (that.data.page1 == 1) {
                that.data.dataList1 = []
              }
              that.data.dataList1 = that.data.dataList1.concat(res.page.list)
              this.setData({
                dataList: that.data.dataList1
              })

              break
            case 1:
              if (that.data.page2 == 1) {
                that.data.dataList2 = []
              }
              that.data.dataList2 = that.data.dataList2.concat(res.page.list)
              this.setData({
                dataList2: that.data.dataList2
              })
              break
            case 2:
              if (that.data.page3 == 1) {
                that.data.dataList3 = []
              }
              that.data.dataList3 = that.data.dataList3.concat(res.page.list)
              this.setData({
                dataList3: that.data.dataList3
              })
              break
            case 3:
              if (that.data.page4 == 1) {
                that.data.dataList4 = []
              }
              that.data.dataList4 = that.data.dataList4.concat(res.page.list)
              this.setData({
                dataList4: that.data.dataList4
              })
              break
            case 4:
              if (that.data.page5 == 1) {
                that.data.dataList5 = []
              }
              that.data.dataList5 = that.data.dataList5.concat(res.page.list)
              this.setData({
                dataList5: that.data.dataList5
              })
              break
          }

        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  hideModal(e) {
    this.setData({
      'isShowSend': false,
      'isShowTiHuo': false,
      modalName: ''
    })
  },
  //发货
  toSend: function(e) {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager2') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }

    this.data.id = e.currentTarget.dataset.item
    console.log(this.data.id)
    this.data.isChooseOther = false
    this.setData({
      isChooseOther: this.data.isChooseOther 
    })


    this.getDeliveryMan()


  },

  //订单详情
  toOrderDetail: function(e) {

    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager1') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }


    var id = e.currentTarget.dataset.item
    var type = e.currentTarget.dataset.type
    console.log(id)
    if (type == "immediately") {
      wx.navigateTo({
        url: '/pages/mainClass/PayDetail/PayDetail?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/OrderDetail/OrderDetail?id=' + id,
      })
    }
  },
  //订单评价
  toOrderComment: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/mainClass/OrderComment/OrderComment?=id' + id,
    })
  },

  onClose: function() {
    this.setData({
      'isShowSend': false
    })
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
    this.setData({
      textValue: ""
    })
    switch (this.data.pos) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        this.data.state = 'unpay'
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        this.data.state = 'waitSending'
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        this.data.state = 'waitReceiving'
        break
      case 3:
        this.data.page4 = 1
        this.data.dataList4 = []
        this.data.state = 'success'
        break
      case 4:
        this.data.page5 = 1
        this.data.dataList5 = []
        this.data.state = ''
        break
    }
    this.getOrderListData()
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

    wx.showLoading()
    switch (this.data.pos) {
      case 0:
        this.data.page1 = 1
        this.data.dataList1 = []
        break
      case 1:
        this.data.page2 = 1
        this.data.dataList2 = []
        break
      case 2:
        this.data.page3 = 1
        this.data.dataList3 = []
        break
      case 3:
        this.data.page4 = 1
        this.data.dataList4 = []
        break
      case 4:
        this.data.page5 = 1
        this.data.dataList5 = []
        break
    }
    this.getOrderListData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading()
    switch (this.data.pos) {
      case 0:
        this.data.page1++
          break
      case 1:
        this.data.page2++
          break
      case 2:
        this.data.page3++
          break
      case 3:
        this.data.page4++
          break
      case 4:
        this.data.page5++
          break
    }
    this.getOrderListData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //点击确定发货
  makeSureSend: function() {
    if (this.data.isChooseOther) {
      if (!this.data.name) {
        wx.showToast({
          icon: 'none',
          title: '请输入配送人姓名',
        })
        return
      }
      if (!this.data.phone) {
        wx.showToast({
          icon: 'none',
          title: '请输入配送人手机号',
        })
        return
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(this.data.phone)) {
        wx.showToast({
          icon: 'none',
          title: '输入的手机号有误',
        })
        return;
      }
    } else {
      if (!this.data.name) {
        wx.showToast({
          icon: 'none',
          title: '请选择配送人员',
        })
        return
      }
    }

    this.deliverymanSave()
    wx.showLoading()
    this.sendProductOut()

  },

  inputDeliveryMan: function(e) {
    this.data.name = e.detail.value
  },

  inputDeliveryPhone: function(e) {
    this.data.phone = e.detail.value
  },

  //保存配送人信息
  deliverymanSave: function() {
    urlApi.getInfo(rootUrls.deliverymanSave + wx.getStorageSync("chooseshopid") + "/" + this.data.name +
        "/" + this.data.phone, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {} else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },

  //发货
  sendProductOut: function() {
    urlApi.getInfo(rootUrls.sendProductOut, {
        'deliveryman': this.data.name,
        'deliverymanPhone': this.data.phone,
        'id': this.data.id
      }, "PUT")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        this.setData({
          'isShowSend': false
        })
        if (res.code == 0) {
          wx.showToast({
            icon: 'none',
            title: "发货成功",
          })
          this.data.page2 = 1
          this.data.dataList2 = []
          this.getOrderListData()

        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //图片加载错误
  avatarError: function(e) {


  },

  //完成提货
  pickGoods: function(e) {

    this.data.id = e.currentTarget.dataset.item
    console.log(this.data.id)

    this.setData({
      modalName: 'show'
    })
  },



  getAll: function() {
    wx.showLoading()
    this.pickGoodsData()
  },

  inputTiHuoMa: function(e) {
    this.data.enterCode = e.detail.value
  },

  tiHuoSure: function(e) {
    console.log(e)
    if (!this.data.enterCode) {
      wx.showToast({
        title: '请输入取货码',
        icon: "none"
      })
      return
    }

    if (!urlApi.isNumber(this.data.enterCode)) {
      wx.showToast({
        title: '请输入正确的取货码',
        icon: "none"
      })
      return
    }

    this.setData({
      isShowTiHuo: false
    })
    wx.navigateTo({
      url: '/pages/mainClass/CodeSearchOrder/CodeSearchOrder?code=' + this.data.enterCode
    })
  },

  scan1: function() {
    if (app.globalData.isShopOperator) {
      var canenter = '0'
      for (let i = 0; i < app.globalData.menuAuth.length; i++) {
        let pro = app.globalData.menuAuth[i]
        if (pro == 'orderManager3') {
          canenter = '1'
        }
      }
      if (canenter != '1') {
        wx.showToast({
          icon: 'none',
          title: '您暂无此权限',
        })
        return
      }
    }
    this.setData({
      isShowTiHuo: true
    })
  },

  //完成提货
  pickGoodsData: function() {
    let that = this
    urlApi.getInfo(rootUrls.pickGoods + that.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          this.data.page3 = 1
          this.data.dataList3 = []
          this.getOrderListData()

          wx.redirectTo({
            url: '/pages/mainClass/GetSuccess/GetSuccess',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },


  //扫码核销
  scanProduct: function(verificationCode) {
    let that = this
    urlApi.getInfo(rootUrls.scanVerification + wx.getStorageSync("chooseshopid") + "/" + that.data.scanResult, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {
          that.setData({
            ScanDetail: ''
          })
          this.data.page3 = 1
          this.data.dataList3 = []
          this.getOrderListData()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },




})