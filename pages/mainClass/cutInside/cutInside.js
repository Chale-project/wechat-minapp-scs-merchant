// pages/mainClass/cutInside/cutInside.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
import WeCropper from '../../we-cropper/we-cropper.js'
import config from './config/index.js'

const app = getApp()
// const config = app.globalData.config

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
      boundStyle: {
        color: '#aff',
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    },
    uploadGoodImageUrl:'',
    isfrom:'',
    imageidx: ''
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage() {
    let that = this
    wx.showLoading({
      icon: 'none',
      title: '上传中',
    })
    that.cropper.getCropperImage(function (path, err) {
      if (err) {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      } else {
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [path] // 需要预览的图片http链接列表
        // })
        that.uploadserve(path)
      }
    })
  },
  uploadserve:function(imagePath) {
    let that = this
    urlApi.getuploadInfo(rootUrls.uploadfileUrl, imagePath, "post")
        .then(res => {
          wx.hideLoading()
          var result = JSON.parse(res)
          if (result.code == 0) {
            //console.log('上传的图片链接',result)返回result.url
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            if (that.data.isfrom =='ShopGuangErGao'){
              var temppics = prevPage.data.navtitledata
              temppics[that.data.imageidx].picPath = result.url
              prevPage.setData({
                navtitledata: temppics
              })
              wx.navigateBack({
                delta: 1
              })
            } else if (that.data.isfrom == 'AddProduce'){
              var temppics = prevPage.data.itemallarr
              temppics[that.data.imageidx].itemImages = result.url
              prevPage.setData({
                itemallarr: temppics
              })
              wx.navigateBack({
                delta: 1
              })
            } else if (that.data.isfrom == 'ShopData'){
              that.modifydata('shopLogo', result.url)
            }
            else{
              prevPage.setData({
                uploadGoodImageUrl: result.url,
              })
              wx.navigateBack({
                delta: 1
              })
            }
          }
          else {
            wx.showToast({
              icon: 'none',
              title: result.msg,
            })
          }
        })
  },
  //修改logo
  modifydata: function (name, value) {
    wx.showLoading({
      title: '保存中...',
    })
    var para = { "shopId": wx.getStorageSync("chooseshopid"), [name]: value }
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          wx.setStorageSync('shopLogo', value)
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
  uploadTap() {
    let that = this
    // urlApi.getPicutreInfo()
    //   .then(restwo => {
    //     that.cropper.pushOrign(restwo.url)
    //   })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //压缩图
      success(res) {
        const tempFilePaths = res.tempFilePaths
        var tempFilesSize = res.tempFiles[0].size ////获取图片的大小，单位B
        // console.log('图片大小', tempFilesSize, res)
        if (tempFilesSize <= 2000000) {
          that.cropper.pushOrign(res.tempFilePaths[0])
        } else { //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于2M!',
            icon: 'none'
          })
        }
      }
    })
  },
  onLoad(option) {
    this.setData({
      uploadGoodImageUrl: option.uploadGoodImageUrl,
      isfrom: option.isfrom,
      imageidx: option.imageidx
    })
    console.log('传递', this.data.uploadGoodImageUrl)
    const { cropperOpt } = this.data
    if (this.data.isfrom == 'ShopGuangErGao'){
      cropperOpt.boundStyle.color = '#ffe'
      cropperOpt.cut = {
        x: (width - 375) / 2,
        y: (height - 250) / 2,
        width: 375,
        height: 250
      }
    }
    this.setData({ cropperOpt })

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    if (this.data.uploadGoodImageUrl) {
      this.cropper.pushOrign(this.data.uploadGoodImageUrl)
    }
  }
})
