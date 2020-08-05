var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false,
    currentHtml: "",
    delta: {},
    popdata: [{
      "title": "文字",
      "pic": "/pages/images/addStore/detailtext.png"
    }, {
      "title": "图片",
      "pic": "/pages/images/addStore/detailimage.png"
    }],
    currentsubject: "",
    tempimagearr: ''
  },
  onLoad: function(options) {
    // let that = this;
    // WxParse.wxParse('article', 'html', wx.getStorageSync('qcurrentHtml'), that, 5)
    console.log('subject', options.subject, wx.getStorageSync('shopspec'))
    if (options.subject == "1") {
      wx.setNavigationBarTitle({
        title: '商品详情'
      })
      this.data.currentsubject = "1"
      //详情
      var prosec = wx.getStorageSync('shopspec')
      if (prosec && prosec != null && prosec != 'null') {
        this.setData({
          currentHtml: decodeURIComponent(prosec)
        })
        console.log('html', this.data.currentHtml)
        this.onEditorReady()
      } else {
        this.onEditorReady()
      }
    } else {
      wx.setNavigationBarTitle({
        title: '店铺介绍'
      })
      this.data.currentsubject = "0"
      this.getshopinfo()
    }
  },
  onShow: function(options) {

  },
  getshopinfo: function() {
    // getshopinfoUrl
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.getshopinfoUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()

        if (res.result.shopIntro && res.result.shopIntro != null && res.result.shopIntro != 'null') {
          this.setData({
            currentHtml: decodeURIComponent(res.result.shopIntro)
          })
          this.onEditorReady()
        }

      })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context
      that.temsetContents()
    }).exec()

  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    })
  },
  temsetContents() {
    let that = this
    that.editorCtx.setContents({
      html: that.data.currentHtml,
      success: function(res) {
        console.log('显示')
        var prosec = wx.getStorageSync('shopspec')
        // if (prosec && prosec != null && prosec != 'null') {

        // }else{
        //   if (that.data.tempimagearr){
        //     //初始化详情图
        //     for (let i = 0; i < that.data.tempimagearr.length; i++) {
        //       that.editorCtx.insertImage({
        //         src: that.data.tempimagearr[i],
        //         data: {
        //           // id: 'abcd',
        //           // role: 'god'
        //         },
        //         success: function () {
        //           console.log('insert image success')
        //         }
        //       })
        //     }
        //   }
        // }

      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  textandpictap: function(e) {
    var index = e.currentTarget.dataset.idx;
    if (index == 0) {
      //插入文字
      this.insertDivider()
    } else {
      //插入图片
      this.insertImage()
    }
  },
  insertImage() {
    // const that = this
    //批量选择9张
    // urlApi.getPicutreInfo()
    //   .then(restwo => {
    //       that.editorCtx.insertImage({
    //         src: restwo.url,
    //       data: {
    //       // id: 'abcd',
    //       // role: 'god'
    //       },
    //       success: function () {
    //         console.log('insert image success')
    //       }
    //     })
    //   })
    this.caramtap()
  },
  // 上传图片
  caramtap: function() {
    let that = this
    wx.chooseImage({
      count: '9',
      sizeType: ['compressed'], //压缩图
      success(res) {
        const tempFilePaths = res.tempFilePaths
        // 此处需要先上传服务器(考虑批量上传),获取的图片顺序显示为选择的顺序
        wx.showLoading({
          title: '正在添加',
        })
        var imagehttparr = []
        var totalsuccessupload = 0
        var totalfailedupload = 0
        for (let i = 0; i < tempFilePaths.length; i++) {
          urlApi.getuploadInfo(rootUrls.uploadfileUrl, tempFilePaths[i], "post")
            .then(res => {
              var result = JSON.parse(res)
              if (result.code == 0) {
                totalsuccessupload++
                //添加一个标记
                imagehttparr.push({
                  'imageurl': result.url,
                  'idx': i
                })

              } else {
                totalfailedupload++
                wx.showToast({
                  icon: 'none',
                  title: result.msg,
                })
              }
              //有可能到最后一次上传完成上一次上传还未完成,上传成功和上传失败的总数量不变
              if (totalsuccessupload + totalfailedupload == tempFilePaths.length) {
                wx.hideLoading()
                //倒序
                imagehttparr.sort(function(x, y) {
                  return y['idx'].toString().localeCompare(x['idx'].toString());
                })
                var tempimagearr = []
                for (let j = imagehttparr.length - 1; j >= 0; j--) {
                  let imagepic = imagehttparr[j].imageurl
                  tempimagearr.push(imagepic)
                }
                // that.setData({
                //   cameraurlarr: tempimagearr
                // })
                //添加到详情
                // console.log('iamgeArr',tempimagearr)
                that.editImageArr(tempimagearr)
                if (totalfailedupload > 0) {
                  wx.showToast({
                    icon: 'none',
                    title: '有' + totalfailedupload + '张图片上传失败',
                  })
                }
              }
            })
        }
      }
    })

  },
  //富文本
  editImageArr: function(imageArr) {
    console.log('添加图片')
    for (let i = 0; i < imageArr.length; i++) {
      this.editorCtx.insertImage({
        src: imageArr[i],
        data: {
          // id: 'abcd',
          // role: 'god'
        },
        success: function() {
          console.log('insert image success')
        }
      })
    }
  },
  editortap: function(e) {
    this.setData({
      currentHtml: e.detail.html
    })
  },
  savebtntap: function() {
    //调用保存接口
    console.log('currentsubject', this.data.currentHtml)
    if (this.data.currentsubject == "1") {
      wx.setStorageSync('shopspec', encodeURIComponent(this.data.currentHtml))
      wx.navigateBack({

      })
    } else {
      this.modifydata()
    }
  },
  modifydata: function(name, value) {
    wx.showLoading({
      title: '保存中...',
    })
    var para = {
      "shopId": wx.getStorageSync("chooseshopid"),
      'shopIntro': encodeURIComponent(this.data.currentHtml)
    }
    console.log(para)
    urlApi.getInfo(rootUrls.shopdeliveryUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        wx.navigateBack({})
      })
  }
})