// pages/StoreManager/ProDetail/ProDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentdata: [{ "id": 1, "textdetail": ""}],
    show:false,
    editdata:["删除","上移","插入"],
    popdata: [{ "title": "文字", "pic": "/pages/images/addStore/detailtext.png" }, { "title": "图片", "pic": "/pages/images/addStore/detailimage.png" }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var spec = wx.getStorageSync('shopspec')
    //转化为数组
    
  },
  //文字输入框
  textareatap: function (e) {
    var idf = e.currentTarget.dataset.idf
    var temparr = this.data.contentdata
    temparr[idf].textdetail = e.detail.value
    this.setData({
      contentdata:temparr
    })
    console.log(1, e.detail.value)
  },

  //图片选择框
  ChooseImage(e) {
    //idx
    var temarr = this.data.contentdata
    var idf = e.currentTarget.dataset.idf
    var temcount = temarr[idf].imgList.length
    //此处要选择上传到服务器的图片
    wx.chooseImage({
      count: 8 - temcount, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        //上传到服务器
        this.uploadimage(res.tempFilePaths, temarr, idf)
      }
    });
  },
  uploadimage: function (tempFilePaths, temarr, idf) {
    wx.showLoading({
      title: '正在上传',
    })
    var imagehttparr = []
    for (let i = 0; i < tempFilePaths.length; i++) {
      urlApi.getuploadInfo(rootUrls.uploadfileUrl, tempFilePaths[i], "post")
        .then(res => {
          wx.hideLoading()
          var result = JSON.parse(res)
          if (result.code == 0) {
            imagehttparr.push(result.url)
          }
          else {
            wx.showToast({
              title: result.msg,
            })
          }
          if (i == tempFilePaths.length - 1) {
            if (temarr[idf].imgList.length > 0) {
              for (let i = 0; i < imagehttparr.length; i++) {
                temarr[idf].imgList.push(imagehttparr[i])
              }
            } else {
              temarr[idf].imgList = imagehttparr
            }
            this.setData({
              contentdata: temarr
            })
          }
        })
  }
  },
  ViewImage(e) {
    var temarr = this.data.contentdata
    var idf = e.currentTarget.dataset.idf
    wx.previewImage({
      urls: temarr[idf].imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    var temarr = this.data.contentdata
    var idf = e.currentTarget.dataset.idf
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          temarr[idf].imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            contentdata: temarr
          })
        }
      }
    })
  },
  //删除 上移 插入
  editviewtap: function (e) {
    var index = e.currentTarget.dataset.idy;
    var idf = e.currentTarget.dataset.idf;
    var temparr = this.data.contentdata
    console.log(1,index,e)
    if(index == 0){
      //删除
      if(temparr.length>1){
        temparr.splice(idf, 1)
        this.setData({
          contentdata: temparr
        })
      }
    }else if (index == 1){
      //上移到最顶部
      //获取当前index放在数组的第一个
      if (idf > 0) {
        var change = temparr[idf]
        temparr.splice(idf, 1)
        temparr.splice(0,0,change)//删除第一位0个元素添加元素
        this.setData({
          contentdata: temparr
        })
      }
    }else{
      //插入
      this.setData({
        show: true
      })
    }
  },
  onClose: function () {
    this.setData ({
      show: false
    })
  },
  textandpictap : function (e) {
    var index = e.currentTarget.dataset.idx;
    var temparr = this.data.contentdata
    if (index == 0){
      //插入文字
      temparr.push({ "id": 1, "textdetail": ""})
    }else{
      //插入图片
      temparr.push({ "id": 2, 'imgList': []})
    }
    this.setData({
      show: false,
      contentdata: temparr
    })
  },
  savebtntap: function () {
    console.log(2, this.data.contentdata)
    //保存添加的内容
    var temparr = this.data.contentdata
    var temstr = ""
    for (let i = 0; i < temparr.length;i++){
      var dic = temparr[i]
        //文本
      var textdetail = '' 
      if(dic.textdetail){
        textdetail = dic.textdetail
      }
      var imgstr = ""
      if (dic.imgList){
        for (let j = 0; j < dic.imgList.length; j++) {
          var str = "<img src=" + "'" + dic.imgList[j] + "'"+' '+"mode=aspectFix"+' '+"style='width:100%'/>"
          imgstr = imgstr + str
        }
      }
      temstr = temstr + textdetail+imgstr
      console.log(1, temstr, dic.imgList)
      wx.setStorageSync('shopspec', encodeURIComponent(temstr))
  }
    wx.navigateBack({
      
    })
  }
})