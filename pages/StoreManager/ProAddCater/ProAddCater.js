// pages/StoreManager/ProAddCater/ProAddCater.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
import Dialog from '../../../vantUi/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    catervalue:"",
    poptoptitle:"新建分类",
    caterdata: [],
    selectcater:1,
    modifingcater:1,
    selectsubcateridx:"",
    modifycaterid:"",
    modifysubcaterid:"",
    deletshow:false,
    bottomshow:false,
    placehorldNum:'6'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.getcaterlist()
  },
  onShow: function () {

  },
  //获取分类列表
  getcaterlist: function () {
    urlApi.getInfo(rootUrls.procaterlistUrl + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        // 调用获取用户信息接口,用户信息存储在偏好
        console.log(1, res,1)
        if (res.code == 0) {
          this.setData({
            caterdata: res.list
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  inputcatertap: function (e) {
    this.setData ({
      catervalue: e.detail.value
    })
  },
  cancletap : function () {
    this.setData({
      show: false,
      bottomshow: false
    })
  },
  // 确定创建
  suretap : function () {
    //判断是否有内容，判断是一级分类还是二级分类
    if (this.data.catervalue.length<1){
      wx.showToast({
        icon: 'none',
        title: '输入内容为空',
      })
    }else{
      
      //判断是新建分类还是子分类
      if (this.data.selectcater == 1) {
        //判断是否是修改分类
        if (this.data.modifingcater == 1) {
          this.getfirstcaterdata("one", "parent")
        } else {
          //拿到一级分类id
          this.modifycaterdata(this.data.modifycaterid)
        }
      } else {
        if (this.data.catervalue.length<2){
          wx.showToast({
            icon: 'none',
            title: '请输入2-10个字符',
          })
          return
        }
        if (this.data.modifingcater == 1) {
          var firstid = this.data.selectsubcateridx
          this.getfirstcaterdata("two", this.data.caterdata[firstid].id)
        } else {
          this.modifycaterdata(this.data.modifysubcaterid)
        }
      }

      this.setData({
        show: false,
        bottomshow: false
      })
    }
  },
  getfirstcaterdata: function (catGrade, pid) {
    wx.showLoading({
      title: '创建中',
    })
    urlApi.getInfo(rootUrls.addprocaterUrl, { "shopId": wx.getStorageSync("chooseshopid"), "catGrade": catGrade, "name": this.data.catervalue, "pid": pid}, "post")
      .then(res => {
        // 调用获取用户信息接口,用户信息存储在偏好
        console.log(1,res)
        if (res.code == 0) {
          this.getcaterlist()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  //修改分类信息
  modifycaterdata: function (caterid) {
    // modifycaterUrl
    wx.showLoading({
      title: '正在修改分类',
    })
    urlApi.getInfo(rootUrls.modifycaterUrl, { "shopId": wx.getStorageSync("chooseshopid"), "name": this.data.catervalue, "id": caterid }, "PUT")
      .then(res => {
        // 调用获取用户信息接口,用户信息存储在偏好
        console.log(1, res)
        if (res.code == 0) {
          wx.setStorageSync("choosecaterdic", "")
          this.getcaterlist()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  //新建父分类
  addcatertap: function () {
    this.setData({
      placehorldNum: 6
    })
    this.addpublicpop (1,0,"新建分类",1,"")
  },
  //添加子分类
  addsecondcatertap: function (e) {
    this.setData({
      placehorldNum: 10
    })
    var curindex = e.currentTarget.dataset.idx
    this.addpublicpop(2, curindex, "新建子分类",1,"")
  },
  //新建分类弹窗
  addpublicpop: function (cater, curindex, toptitle, modify, catervalue) {
    this.setData({
      show: true,
      bottomshow: true,
      catervalue: catervalue,
      poptoptitle: toptitle,
      selectcater: cater,
      selectsubcateridx: curindex,
      modifingcater: modify
    })
  },
  // 修改分类
  firsteditselect: function (e) {
    this.setData({
      placehorldNum: 6
    })
    var idx = e.currentTarget.dataset.idx
    this.data.modifycaterid = this.data.caterdata[idx].id
    this.addpublicpop(1, 0, "修改分类名称", 2, this.data.caterdata[idx].name)
  },
  seceditselect: function (e) {
    this.setData({
      placehorldNum: 10
    })
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    this.data.modifysubcaterid = this.data.caterdata[idx].sublevels[idy].id
    this.addpublicpop(2, 0, "修改子分类名称", 2, this.data.caterdata[idx].sublevels[idy].name)
  },

  // 删除分类
  firstdeleteselect: function (e) {
    //删除一级分类
    var idx = e.currentTarget.dataset.idx
    //获取id
    var pid = this.data.caterdata[idx].id
    console.log('一级分类',pid)
    this.popdeletewithid(pid)

  },
  secdeleteselect: function (e) {
    //删除二级分类
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var pidsec = this.data.caterdata[idx].sublevels[idy].id
    this.popdeletewithid(pidsec)
  },
  popdeletewithid:function (pid) {
    let that = this
    that.setData({
      bottomshow: true
    })
    Dialog.confirm({
      title: '提示',
      message: '分类删除后该分类下的商品会转移到“未分类”,是否删除？'
    })
      .then(() => {
        // on confirm
        //调用删除接口
        that.setData({
          bottomshow: false
        })
        that.deletecaterwithid(pid)
      }).catch(() => {
        // on cancel
        that.setData({
          bottomshow: false
        })
      })
  },
  deletecaterwithid: function (pid) {
    wx.showLoading({
      title: '删除中...',
    })
    urlApi.getInfo(rootUrls.deletecaterUrl+pid, {}, "DELETE")
      .then(res => {
        if (res.code == 0) {
          //刷新数据
          wx.setStorageSync("choosecaterdic", "")
          this.getcaterlist()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },
  savebtntap: function () {
    wx.navigateBack({
      
    })
  },
  onClose: function () {
    this.setData({
      show: false,
      bottomshow: false
    })
  },
  //一级置顶分类
  mostUpviewtap: function (e) {
    wx.showLoading({
      title: '置顶中...',
    })
    var idx = e.currentTarget.dataset.idx
    var firid = this.data.caterdata[idx].id
    this.changeCaterLoaction(firid,'Home')
  },
  //一级上移分类
  topmoveviewtap: function (e) {
    wx.showLoading({
      title: '上移中...',
    })
    var idx = e.currentTarget.dataset.idx
    var firid = this.data.caterdata[idx].id
    this.changeCaterLoaction(firid, 'PgUp')
  },
  //二级置顶分类
  secmostUpviewtap: function (e) {
    wx.showLoading({
      title: '置顶中...',
    })
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var secid = this.data.caterdata[idx].sublevels[idy].id
    this.changeCaterLoaction(secid, 'Home')
  },
  //二级上移分类
  sectopmoveviewtap: function (e) {
    wx.showLoading({
      title: '上移中...',
    })
    var idx = e.currentTarget.dataset.idx
    var idy = e.currentTarget.dataset.idy
    var secid = this.data.caterdata[idx].sublevels[idy].id
    this.changeCaterLoaction(secid, 'PgUp')
  },
  changeCaterLoaction:function (id,state) {
    console.log('cater',id,state)
    urlApi.getInfo(rootUrls.changecaterLocationUrl+id+'/'+state, {}, "put")
      .then(res => {
        console.log('change',res)
        wx.setStorageSync("choosecaterdic", "")
        this.getcaterlist()
      })
  }
})