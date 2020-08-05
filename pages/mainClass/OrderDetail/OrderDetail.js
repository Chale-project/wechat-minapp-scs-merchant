// pages/mainClass/OrderDetail/OrderDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    basicsList: [{
      name: '提交订单'
    }, {
      name: '买家付款'
    }, {
      name: '商家发货'
    }, {
      name: '确认收货'
    }, ],
    id: "",
    num: 0,
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    wx.showLoading()
    this.getOrderDetail()
  },

  //获取订单详情
  getOrderDetail: function() {
    let that = this
    urlApi.getInfo(rootUrls.getOrderDetail + this.data.id, {}, "GET")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.code == 0) {

          if (res.info.orderDescModelList!= null) {
            for (let i = 0; i < res.info.orderDescModelList.length; i++) {
              res.info.orderDescModelList[i].price = urlApi.fen2Yuan(res.info.orderDescModelList[i].price)
            }
          }



          that.setData({
            dataList: res.info.orderDescModelList, //商品
            receiver: res.info.receiver, //收货人
            receiverMobile: res.info.receiverMobile, //收货人手机号
            receiverAddress: res.info.receiverAddress, //收货人地址
            receiver: res.info.receiver, //收货人
            goodsPrice: urlApi.fen2Yuan(res.info.goodsPrice), //商品总金额
            deliveryCost: urlApi.fen2Yuan(res.info.deliveryCost), //配送费
            couponAmount: urlApi.fen2Yuan(res.info.couponAmount), //优惠金额
            orderId: res.info.orderId, //订单id
            addDataTime: res.info.addDataTime, //下单时间 
            onsignTime: res.info.onsignTime, //发货时间 
            paymentTime: res.info.paymentTime, //付款时间 
            payment: urlApi.fen2Yuan(res.info.payment),
            state: res.info.state, //订单状态
            deliveryman: res.info.deliveryman,
            deliverymanPhone: res.info.deliverymanPhone,
            memberAmount: urlApi.fen2Yuan(res.info.memberAmount), //会员折扣
            buyerMessage: res.info.buyerMessage,
            isShowAddress: res.info.orderDescModelList <= 0 || res.info.receiver == null,
            nickname: res.info.buyerNick,
            pointsDeduction: urlApi.fen2Yuan(res.info.pointsDeduction),
            pickPhoneNumber: res.info.pickPhoneNumber,
            orderType: res.info.orderType,
            arrivedTime: res.info.arrivedTime
          })

          switch (res.info.payType) {
            case "weixin":
              that.setData({
                payType: "微信"
              })
              break
            case "balance":
              that.setData({
                payType: "余额"
              })
              break
            case "alipay":
              that.setData({
                payType: "支付宝"
              })
              break
            default:
              that.setData({
                payType: "微信/账号余额"
              })
              break
          }

          if (!that.data.isShowAddress) {
            that.data.phone = res.info.receiverMobile;
            console.log("1", that.data.phone)
          } else {
            if (that.data.orderType == 'virtualGoods') {
              that.data.phone = res.info.orderDescModelList[0].account;
              console.log("2", that.data.phone)
            } else {
              that.data.phone = res.info.pickPhoneNumber;
              console.log("3", that.data.phone)
            }
          }

          if (res.info.orderDescModelList.length > 0) {
            that.setData({
              account: res.info.orderDescModelList[0].account
            })
          }

          //unpay 未支付 waitSending 待发货 waitReceiving 待收货   receipted  已签收/已取货  cancel已取消  success完成',
          if (res.info.state == 'unpay') {
            that.data.num = 0
          } else if (res.info.state == 'waitSending') {
            that.data.num = 1
          } else if (res.info.state == 'waitReceiving') {
            that.data.num = 2
          } else if (res.info.state == 'receipted') {
            that.data.num = 3
          } else if (res.info.state == 'arrived') {
            that.data.num = 2
          }  else if (res.info.state == 'cancel') {
            that.data.basicsList = [{
              name: '提交订单'
            }, {
              name: '取消订单'
            }]
            that.data.num = 1
          } else if (res.info.state == 'success') {
            that.data.num = 3
          }
          this.setData(({
            num: that.data.num,
            basicsList: that.data.basicsList
          }))
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  //拨打电话
  call: function() {
    if (!this.data.phone || this.data.phone == null) {
      wx.showToast({
        icon: "none",
        title: "未获取到用户的手机号",
      })
      return
    }

    wx.makePhoneCall({
      phoneNumber: this.data.phone,
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