//app.js
var urlApi = require('/utils/util.js')
var rootUrls = require('/utils/rootUrl.js')
App({
  onLaunch: function(ops) {
    //检查版本更新
    this.checkEditionUpdate()
    this.countDown()
  },
  onShow: function() {

  },
  checkEditionUpdate:function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  countDown: function () {
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    setInterval(function () {
      // console.log('以前token', wx.getStorageSync('access_token'))
      urlApi.getInfo(rootUrls.refreshtokenUrl, {}, "POST")
        .then(res => {
          wx.setStorageSync('access_token', res.access_token)
          // console.log('1分钟', wx.getStorageSync('access_token'))
        })
        
    }, 30*60*1000)
  },
  globalData: {
    userInfo: null,
    couponData: [],
    limitProduct: [],
    caterIdlist: [],
    couponProductList:[],
    groupList:{},
    groupEditSize:[],
    menuAuth:[],
    isShopOperator:false
  }
})

