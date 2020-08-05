// pages/ShopsPower/ShopsAccountEdit/ShopsAccountEdit.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
var md5js = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchchecked: false,
    operatordic:{},
    passwordvalue: '',
    chooseRoleId: '',
    chooseRoleName: '',
    shopchecked: false,
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // searchopratedetailUrl
    wx.showLoading({
      icon: 'none',
      title: '加载中',
    })
    urlApi.getInfo(rootUrls.searchopratedetailUrl + options.operatorId + '/' + wx.getStorageSync("chooseshopid"), {}, "get")
      .then(res => {
        wx.hideLoading()
        this.setData({
          operatordic:res.operator,
          name: res.operator.shopOperatorName,
          switchchecked: res.operator.operatorStatus =='enabled'?true:false,
          shopchecked: res.operator.sendMessage == 'enabled'?true:false,
          chooseRoleName: res.operator.roleName
        })
      })
  },

  onSwitchChange: function (event) {
    this.setData({
      switchchecked: event.detail,
    })
  },
  //输入姓名
  nametap: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  onSwitchChangesec: function (event) {
    this.setData({
      shopchecked: event.detail,
    })
  },
  //选择岗位
  choosejobtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsJobManager/ShopsJobManager?ischoosejob=' + 'true',
    })
  },
  savetap: function () {
    var para = {}
    if(!this.data.name){
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
      return
    }
    if (!this.data.passwordvalue){
      para = { "shopId": wx.getStorageSync("chooseshopid"), 'id': this.data.operatordic.id, 'shopOperatorName':this.data.name, 'sendMessage': this.data.shopchecked ? 'enabled' : 'disabled', 'operatorStatus': this.data.switchchecked ? 'enabled' :'disabled', 'roleIdList': this.data.chooseRoleId ? [this.data.chooseRoleId] : this.data.operatordic.roleIdList }
    }else{
      para = { "shopId": wx.getStorageSync("chooseshopid"), 'id': this.data.operatordic.id, 'shopOperatorName': this.data.name, 'operatorLoginPwd': md5js.md5(this.data.passwordvalue), 'sendMessage': this.data.shopchecked ? 'enabled' : 'disabled', 'operatorStatus': this.data.switchchecked ? 'enabled' : 'disabled', 'roleIdList': this.data.chooseRoleId ? [this.data.chooseRoleId] : this.data.operatordic.roleIdList}
    }
    console.log('基本信息',para)
    urlApi.getInfo(rootUrls.changeOpratePasswordUrl, para, "post")
      .then(res => {
        wx.hideLoading()
        console.log('修改',res)
        wx.navigateBack({

        })
      })
  },
  //修改密码
  changepasswordtap: function () {
    wx.navigateTo({
      url: '/pages/ShopsPower/ShopsChangePassword/ShopsChangePassword',
    })
  }
})