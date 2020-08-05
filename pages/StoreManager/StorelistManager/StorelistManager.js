// pages/StoreManager/StorelistManager/StorelistManager.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var storelowApi = require('../../../utils/StoreLow.js')
import Dialog from '../../../vantUi/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleorlowindex:0,
    selids:"",
    screenHeighth: 0,
    storebottomtitledata : [{
      "name": "下架"
    },
    {
      "name": "分类至"
    }],
    isAllChoose: false,
    selidsArr:'',
    proshow: false,
    topcaterdata: ['所有商品', '未分类'],
    chooseid: '',
    caterdata: '',
    searchtitle:'',
    choosename:'所有商品',
    isonecatertap: false,
    alreadychoosecater:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeighth: wx.getSystemInfoSync().windowHeight
    })
    this.setData({
      //所有分类和未分类不显示排序
      isallcaterorNocater:true
    })
  },
  onShow: function (options) {
    if (this.data.alreadychoosecater){
      this.data.alreadychoosecater = false
      wx.showToast({
        icon: 'none',
        title: '选择分类成功',
      })
    }
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: ''
    })
    storelowApi.loadNav(this, this.data.saleorlowindex)
    storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  checkboxChange(e) {
    // proSelecte
    var temparr = this.data.storesalelistArr
    var tempselids = []
    for(let i=0;i<temparr.length;i++){
      temparr[i].proSelecte = false
    }
    for(let i=0;i<e.detail.value.length;i++){
      let curidx = e.detail.value[i]
      temparr[curidx].proSelecte = true
      tempselids.push(temparr[curidx].id)
    }
    storelowApi.refreshSalelistData(this,temparr)
    this.setData({
      selids: tempselids.toString(),
      selidsArr: tempselids
    })
    if(e.detail.value.length<this.data.storesalelistArr.length){
      this.setData({
        isAllChoose : false
      })
    }
    // console.log('checkbox发生change事件，携带value值为：',   this.data.selids, e.detail.value)
  },
  ontapindex: function (e) {
    var idx = e.detail.index
    storelowApi.adjectivePageNumber(this)
    var titlearr = []
    if (idx == 0) {
      titlearr = [{
        "name": "下架"
      },
      {
        "name": "分类至"
      }]
    } else {
      titlearr = [{
        "name": "上架"
      },
      {
        "name": "删除"
      },
      {
        "name": "分类至"
      }]
    }
    this.setData({
      saleorlowindex: idx,
      storebottomtitledata: titlearr
    })
    storelowApi.loadNav(this, this.data.saleorlowindex)
    storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle,this.data.chooseid)
  },
  // 上架下架和分类至
  storeaddproducetap: function (e) {
    if(!this.data.selids){
      wx.showToast({
        icon: 'none',
        title: '请选中商品',
      })
    }else{
      var idx = e.currentTarget.dataset.idx;
      if (idx == 0) {
        //先判断是否是选择的出售中
        if (this.data.saleorlowindex == 0) {
          this.listlowdata()
        } else {
          this.listupdata()
        }
      }
       else {
        if (this.data.saleorlowindex == 1 && idx == 1){
          //下架中添加批量删除
          this.deleteprolist()
        }else{
          //分类至
          wx.setStorageSync('choosecaterdic', "")
          //将商品id带过去
          wx.navigateTo({
            url: '../ProChooseCater/ProChooseCater?selids=' + this.data.selids,
          })
        }
        
      }
    }
  },
  listlowdata:function (){
    wx.showLoading({
      title: '下架中...',
    })
    urlApi.getInfo(rootUrls.listlowUrl + this.data.selids, {}, "PUT")
      .then(res => {
        console.log(1,res)
        wx.hideLoading()
        if(res.code==0){
          //刷新当前列表
          this.data.selids = ''
          this.setData({
            selidsArr: '',
            isAllChoose: false
          })
          storelowApi.adjectivePageNumber(this)
          storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle,this.data.chooseid)
        }else{
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  listupdata:function (){
    wx.showLoading({
      title: '上架中...',
    })
    urlApi.getInfo(rootUrls.listupUrl + this.data.selids, {}, "PUT")
      .then(res => {
        console.log(2, res)
        wx.hideLoading()
        if (res.code == 0) {
          //刷新当前列表
          this.data.selids = ''
          this.setData({
            selidsArr: '',
            isAllChoose: false
          })
          storelowApi.adjectivePageNumber(this)
          storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle,this.data.chooseid)
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  deleteprolist:function (){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: '是否确定删除该商品?'
    })
      .then(() => {
        // on confirm
        //调用删除接口
        wx.showLoading({
          title: '删除中...',
        })
        that.uplistlowdata(rootUrls.prodeletUrl)
      }).catch(() => {
        // on cancel
      })
  },
  uplistlowdata: function (requrl) {
    urlApi.getInfo(requrl + this.data.selids, {}, "PUT")
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '删除成功',
        })
        //刷新当前列表
        this.data.selids = ''
        this.setData({
          selidsArr: '',
          isAllChoose: false
        })
        storelowApi.adjectivePageNumber(this)
        storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
      })
  },
  // 上拉加载更多
  storescrolower: function (e) {
    storelowApi.nextload(this, this.data.saleorlowindex, this.data.searchtitle,this.data.chooseid)
  },
  avatarErrorstore: function (e) {
    storelowApi.avatarErrorstore(this, e)
  },
  //全选
  allchoosetap: function () {
    this.data.choosepro = true
    var temchoose = this.data.isAllChoose
    var tempselids = []
    this.setData({
      isAllChoose: !temchoose
    })
    var temparr = this.data.storesalelistArr
    if (this.data.isAllChoose) {
      //全部选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = true
        tempselids.push(pro.id)
      }
      this.setData({
        storesalelistArr: temparr,
        selids: tempselids.toString(),
        selidsArr: tempselids
      })
    } else {
      //全部取消选中
      for (let i = 0; i < temparr.length; i++) {
        var pro = temparr[i]
        pro.proSelecte = false
      }
      this.setData({
        storesalelistArr: temparr,
        selids: '',
        selidsArr: ''
      })
    }
  },
  searchnameinput: function (e) {
    this.data.searchtitle = e.detail.value
    if (!e.detail.value) {
      this.setData({
        isAllChoose: false,
        selids: '',
        selidsArr: ''
      })
      storelowApi.adjectivePageNumber(this)
      storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
    }
  },
  // 点击输入搜索
  searchbutton: function () {
    if (this.data.proshow) {
      this.setData({
        proshow: false
      })
    }
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: ''
    })
    storelowApi.adjectivePageNumber(this)
    storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  // 增加所有商品
  allProTap: function () {
    this.setData({
      proshow: !this.data.proshow
    })
    if (this.data.proshow) {
      this.getcaterlist()
    }
  },
  //获取分类列表
  getcaterlist: function () {
    wx.showLoading({
      title: '加载中...',
    })
    urlApi.getInfo(rootUrls.procaterlistUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        // 调用获取用户信息接口,用户信息存储在偏好
        var temparr = res.list
        for (let i = 0; i < temparr.length; i++) {
          if (temparr[i].sublevels) {
            if (temparr[i].sublevels.length < 1) {
              temparr[i].sublevels = []
            }
          } else {
            temparr[i].sublevels = []
          }
          let temdic = { 'id': temparr[i].id, 'name': temparr[i].name }
          temparr[i].sublevels.unshift(temdic)
        }
        this.setData({
          caterdata: temparr
        })
      })
  },
  // 所有商品和未分类点击
  topcatertap: function (e) {
    this.data.isonecatertap = false
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: '',
      isallcaterorNocater: true
    })
    var idx = e.currentTarget.dataset.idx
    if (idx == 0) {
      //选中所有商品
      this.setData({
        choosename: '所有商品',
        proshow: false,
        chooseid: ''
      })
    } else {
      //选中未分类
      this.setData({
        choosename: '未分类',
        proshow: false,
        chooseid: 'noCate'
      })
    }
    storelowApi.adjectivePageNumber(this)
    storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  // 二级分类点击
  twocatertap: function (e) {
    this.setData({
      isAllChoose: false,
      selids: '',
      selidsArr: ''
    })
    var ida = e.currentTarget.dataset.ida
    var idx = e.currentTarget.dataset.idx
    if (idx == 0) {
      this.data.isonecatertap = true
    } else {
      this.data.isonecatertap = false
    }
    var pro = this.data.caterdata[ida].sublevels[idx]
    let sublevelsarr = this.data.caterdata[ida].sublevels
    console.log('fir',sublevelsarr,idx)
    //
    if (sublevelsarr.length > 1 && idx == 0){
      this.setData({
        isallcaterorNocater: true
      })
    }else{
      this.setData({
        isallcaterorNocater: false
      })
    }
    this.setData({
      searchtitle: '',
      chooseid: pro.id,
      choosename: pro.name,
      proshow: false
    })
    storelowApi.adjectivePageNumber(this)
    storelowApi.proalllistData(this, this.data.saleorlowindex, this.data.searchtitle, this.data.chooseid)
  },
  //置顶
  moveuptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    wx.showLoading({
      icon: 'none',
      title: '置顶中',
    })
    this.paixudata(pro.id,'Home')
    
  },
  //上移
  movetoptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    var cater = 'PgUp'
    wx.showLoading({
      icon: 'none',
      title: '上移中',
    })
    this.paixudata(pro.id, cater)
  },
  //下移
  moveloworuptap: function (e) {
    var idx = e.currentTarget.dataset.idx
    let pro = this.data.storesalelistArr[idx]
    var cater = 'PgDn'
    wx.showLoading({
      icon: 'none',
      title: '下移中',
    })
    this.paixudata(pro.id, cater)
  },
  paixudata:function (id,cater){
    // propaixuUrl
    let that = this
    urlApi.getInfo(rootUrls.propaixuUrl+id+'/'+cater, {}, "PUT")
      .then(res => {
        //刷新数据
        storelowApi.adjectivePageNumber(that)
        storelowApi.proalllistData(that, that.data.saleorlowindex, that.data.searchtitle, that.data.chooseid)
      })
  }
})