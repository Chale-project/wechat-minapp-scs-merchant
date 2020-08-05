// pages/mainClass/ShopUser/ShopUser.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    total: "",
    seven: "",
    thirty: "",
    page: 1,
    dataList: '',
    recordTarget: '',
    bg1: 'line-red',
    bg2: 'line-grey',
    bg3: 'line-grey',
    bg4: 'line-grey',
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.type = options.type
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.setData({
      total: options.total,
      seven: options.seven,
      thirty: options.thirty,
      type: this.data.type
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  // 输入框输入内容时 清空内容
  searchnameinput: function (e) {
    this.data.nickname = e.detail.value
    if (!this.data.nickname) {
      this.data.nickname = ""
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  chooseAll: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.recordTarget = ''
    this.setData({
      bg1: 'line-red',
      bg2: 'line-grey',
      bg3: 'line-grey',
      bg4: 'line-grey'
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },
  choose2: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.recordTarget = 'goods'
    this.setData({
      bg1: 'line-grey',
      bg2: 'line-red',
      bg3: 'line-grey',
      bg4: 'line-grey'
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },
  choose3: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.recordTarget = 'shop'
    this.setData({
      bg1: 'line-grey',
      bg2: 'line-grey',
      bg3: 'line-red',
      bg4: 'line-grey'
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },
  choose4: function() {
    this.data.page = 1
    this.data.dataList = []
    this.data.recordTarget = 'car'
    this.setData({
      bg1: 'line-grey',
      bg2: 'line-grey',
      bg3: 'line-grey',
      bg4: 'line-red'
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  //查看某个用户详情数据
  toUserDetail: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/mainClass/UserDetail/UserDetail?userNumber=' + e.currentTarget.dataset.item,
    })

  },


  //用户列表
  getShopUserList: function() {
    let that = this
    urlApi.getInfo(rootUrls.customerList, {
        'currentPage': that.data.page,
        'pageSize': '10',
        'where': {
          'shopId': wx.getStorageSync("chooseshopid"), //商户id
          'type': that.data.type,
          'recordTarget': that.data.recordTarget,
          'nickname': that.data.nickname
        },
      }, "POST")
      .then(res => {
        wx.hideLoading()
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (that.data.page == 1) {
            that.data.dataList = []
          }
          for(let i=0;i<res.result.list.length;i++){
            if (res.result.list[i].lastVisiteTime==null){
              res.result.list[i].lastVisiteHour = ""
            }else{
              res.result.list[i].lastVisiteHour = urlApi.timeago(parseInt(res.result.list[i].lastVisiteTime) * 1000)
            }
            
          }

          that.data.dataList = that.data.dataList.concat(res.result.list)
          that.setData({
            dataList: that.data.dataList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
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
    this.data.page = 1
    this.data.dataList = []
    wx.showLoading({
      title: '加载中',
    })
    this.getShopUserList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('加载更多')
    this.data.page++
      wx.showLoading({
        title: '加载中',
      })
    this.getShopUserList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})