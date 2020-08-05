// pages/mainClass/ShopQrcode/ShopQrcode.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
let QR = require('../../../utils/qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCodePath:'',
    screenHeighth:0,
    saveUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.getQrCodeInfo()
  },
  getQrCodeInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.getshopcodeUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        // console.log('聚-',res)
        if (res.code == 0) {
          this.setData({
            qrCodePath: res.result
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  avatarError: function () {
    wx.showToast({
      icon: 'none',
      title: '图片无法显示',
    })
    this.setData({
      qrCodePath: ""
    })
  },
  saveQrcodeTap:function () {
    wx.showLoading({
      title: '保存中...',
    })
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.saveImageToPhoto()
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImageToPhoto()
            },
            fail() {
              wx.hideLoading()
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          })
        } else {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                that.saveImageToPhoto()
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  
  },
  // //保存图片到相册
  saveImageToPhoto: function () {
    wx.getImageInfo({
      src: this.data.qrCodePath,
      success: function (sres) {
        wx.saveImageToPhotosAlbum({
          filePath: sres.path,
          success: function (fres) {
            wx.showToast({
              icon: 'none',
              title: '已成功保存到相册',
            })
          },
          fail: function (err) {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '保存失败',
            })
          }
        })
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '保存信息失败',
        })
      }
    })
  }
})