// pages/mainClass/HomeLanMuSet/HomeLanMuSet.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var verInputApi = require('../../../utils/rules.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeighth: 0,
    catervalue: '',
    addsubjectshow: false,
    subjectlistdata:'',
    subjectscrollviewLoader: false,
    pageNumber: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // homeModifySubjectUrl,
    // homeSubjectListUrl,
    // homeSubjectDetailUrl,
    // homeAddSubjectUrl
    // wx.getStorageSync("chooseshopid")
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
  },
  onShow: function () {
    this.gethomesubjectlistdata()
  },
  gethomesubjectlistdata: function () {
    var para = { 'currentPage': this.data.pageNumber, 'pageSize': 10, 'where': { 'shopId': wx.getStorageSync("chooseshopid") } }
    console.log('para', para)
    urlApi.getInfo(rootUrls.homeSubjectListUrl, para, "post")
      .then(res => {
        console.log('homelist', res)
        if (this.data.pageNumber == 1) {
          this.setData({
            subjectlistdata: res.page.list,
          })
        } else {
          var temparr = this.data.subjectlistdata
          for (let a = 0; a < res.page.list.length; a++) {
            var pro = res.page.list[a]
            temparr.push(pro)
            this.setData({
              subjectlistdata: res.page.list,
              pageNumber: res.page.currentPage
            })
          }
        }
        if(res.page.list.length<10){
          this.setData({
            subjectscrollviewLoader: false
          })
        }
      })
  },
  //上拉加载更多
  storescrolower: function () {
    this.setData({
      subjectscrollviewLoader: true
    })
    this.data.pageNumber++
    this.gethomesubjectlistdata()
  },
  //栏目详情
  topcatertap: function (e) {
    let idx = e.currentTarget.dataset.idx
    let selid = this.data.subjectlistdata[idx].id
    // urlApi.getInfo(rootUrls.homeSubjectDetailUrl + selid, {}, "get")
    //   .then(res => {
    //     console.log('homedetail', res)
    //   })
    wx.navigateTo({
      url: '/pages/mainClass/HomeLanMuPro/HomeLanMuPro?subjectsId=' + selid,
    })
  },
  inputcatertap: function (e) {
    this.setData({
      catervalue: e.detail.value
    })
  },
//新增首页栏目
  addhomeSubjecttap: function () {
    this.setData({
      catervalue: '',
      addsubjectshow: true
    })
  },
  suretap: function () {
    if(!this.data.catervalue || this.data.catervalue.length<2){
      wx.showToast({
        icon: 'none',
        title: '请输入2-10个中文名称',
      })
    } else if (!verInputApi.chinese(this.data.catervalue)){
      wx.showToast({
        icon: 'none',
        title: '请输入2-10个中文名称',
      })
    }
    else{
      wx.showLoading({
        title: '新增栏目中',
      })
      var para = { 'shopId': wx.getStorageSync("chooseshopid"), 'subjectName': this.data.catervalue }
      urlApi.getInfo(rootUrls.homeAddSubjectUrl, para, "post")
        .then(res => {
          console.log('homeaddsubject', res)
          wx.hideLoading()
          this.setData({
            addsubjectshow: false
          })
          this.gethomesubjectlistdata()
        })
    }
  },
  cancletap: function () {
    this.setData({
      addsubjectshow: false
    })
  },
  onClose(event) {
    let that = this
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '提示',
          content: '确定删除吗？',
          showCancel: true,//是否显示取消按钮
          cancelText: "否",//默认是“取消”
          cancelColor: '#000000',//取消文字的颜色
          confirmText: "是",//默认是“确定”
          confirmColor: '#ff4444',//确定文字的颜色
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              instance.close();
              let idx = event.currentTarget.dataset.idx
              let selid = that.data.subjectlistdata[idx].id
              that.deletSubject(selid)
            }
          }
        })
        break;
    }
  },
  deletSubject:function (id) {
    // homesubjectDeletUrl
    wx.showLoading({
      icon: 'none',
      title: '删除中',
    })
    urlApi.getInfo(rootUrls.homesubjectDeletUrl + id, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        this.data.pageNumber = 1
        this.gethomesubjectlistdata()
      })
  },
  onaddsubjectClose: function () {
    this.setData({
      addsubjectshow: false
    })
  }
  
})