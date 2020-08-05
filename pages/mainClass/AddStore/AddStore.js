// pages/mainClass/AddStore/AddStore.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var verInputApi = require('../../../utils/rules.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titledata: [{
      "icon":"/pages/images/addStore/name_store.png",
      "name":"店铺名称",
      "holder":"必填,2-20个字符"
    },
      {
        "icon": "/pages/images/addStore/store_logo.png",
        "name": "店铺Logo",
        "holder": "选填"
      }, {
        "icon": "/pages/images/addStore/store_type.png",
        "name": "主营类目",
        "holder": "必填"
      }, {
        "icon": "/pages/images/addStore/store_location.png",
        "name": "省/市/区",
        "holder": "必填"
      }, {
        "icon": "",
        "name": "详细地址",
        "holder": "必填"
      }, {
        "icon": "/pages/images/addStore/store_iphone.png",
        "name": "客服电话",
        "holder": "手机或区号-固话(必填)"
      }, {
        "icon": "/pages/images/addStore/store_requestCode.png",
        "name": "邀请码",
        "holder": "请填写收到的邀请码"
      }
    ],
    currentaddress:{},
    iconfilePath:"",
    showimagefilePath:"",
    columns:["零售","餐饮","外卖"],
    choosepicker: false,
    currentSex:"必填",
    storename:"",
    shencity:"必填",
    addressdetail:"必填",
    kefudianhu:"",
    requestcode:"",
    selinputindex:"",
    addressshow:false,
    uploadGoodImageUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function (options) {
    console.log('-', this.data.uploadGoodImageUrl)
    this.setData({
      iconfilePath: this.data.uploadGoodImageUrl,
      showimagefilePath: this.data.uploadGoodImageUrl
    })
  },
  maptap:function (e) {
    var tag = e.currentTarget.dataset.idx
    this.data.selinputindex = tag
    if (tag == 1){
      this.uploadicon()
    }else if (tag == 2){
      this.setData({
        choosepicker: true
      })
    }else if (tag==3||tag==4){
      this.getlocationwithmap()
    }
    
  },
  uploadicon:function () {
    //跳转到图片裁剪页面
    wx.navigateTo({
      url: '/pages/mainClass/cutInside/cutInside?uploadGoodImageUrl=' + this.data.uploadGoodImageUrl + '&isfrom=' + 'AddStore' + '&imageidx=' + '',
    })
    // return
    // urlApi.getPicutreInfo()
    //   .then(restwo => {
    //     this.setData({
    //       iconfilePath: restwo.url,
    //       showimagefilePath: restwo.url
    //     })
    //   })
  },
  //图片加载出错，替换为默认图片
  avatarError: function (e) {
    this.setData({
      showimagefilePath: "/pages/images/addStore/chooseStoreLogo.png"
    })
  },
  getlocationwithmap:function () {
    let that = this
    that.chooseadressfun ()
  },
  chooseadressfun:function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          currentaddress: res,
          shencity: res.address,
          addressdetail: res.name
        })
      },
      fail: function(err) {
        console.log('err',err)
        if (err.errMsg == 'chooseLocation:fail cancel'){
          wx.showToast({
            icon: 'none',
            title: '您已取消选择地址',
          })
        }else{
          that.setData({
            addressshow: true
          })
        }
      }
    })
  },
  addressonClose: function () {
    this.setData({
      addressshow: false
    })
  },
  surebuttontap: function () {
    this.setData({
      addressshow: false
    })
    wx.openSetting({
      success(res) {
      },
      fail(err) {
      }
    })
  },
  sureAddStoreTap: function () {
    if (this.data.storename.length<2){
      wx.showToast({
        icon: 'none',
        title: '请输入2-20字符的名称',
      })
    } else if (this.data.iconfilePath.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请选择logo',
      })
    } 
    else if (this.data.currentSex == '必填' || this.data.currentSex.length<1){
      wx.showToast({
        icon: 'none',
        title: '请选择主营类目',
      })
    } else if (this.data.shencity == '必填' || this.data.addressdetail == '必填' || this.data.shencity.length < 1 || this.data.addressdetail.length<1) {
      wx.showToast({
        icon: 'none',
        title: '请选择地址',
      })
    }else if (!verInputApi.checkPhoneNumtwo(this.data.kefudianhu) && !verInputApi.checkTeltwo(this.data.kefudianhu)) {
        wx.showToast({
          icon: 'none',
          title: '手机或座机号不正确',
        })
    } else if (!this.data.requestcode){
      wx.showToast({
        icon:'none',
        title: '请填写收到的邀请码',
      })
    }
    else{
      this.addstoredata()
    }
    
  },
  addstoredata: function () {
    wx.showLoading({
      title: '创建店铺中...',
    })
    //地址和logo
    let para = { "shopLogo": this.data.iconfilePath, "shopAddress": this.data.shencity, "phoneNumber": this.data.kefudianhu, "shopLatitude": this.data.currentaddress.latitude, "shopLongitude": this.data.currentaddress.longitude, "shopName": this.data.storename, "shopType": this.data.currentSex, "invitationCode": this.data.requestcode}
    console.log('店铺添加',para)
    urlApi.getInfo(rootUrls.addshopUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        wx.navigateBack({
          })
      })
  },
  onchooseYearCancel() {

    this.setData({
      choosepicker: false
    })
  },
  onChooseYearConfirm(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    var choosesex = event.detail.value
    this.setData({
      currentSex: choosesex,
      choosepicker: false
    })
  },
  inputnametap: function (e) {
    if (this.data.selinputindex==0){
      this.setData({
        storename: e.detail.value
      })
    } else if (this.data.selinputindex==5){
      this.setData({
        kefudianhu: e.detail.value
      })
    } else if (this.data.selinputindex==6){
      this.setData({
        requestcode: e.detail.value
      })
    }
    
  }
})