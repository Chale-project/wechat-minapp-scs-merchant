// pages/ShopsPower/ShopsAddNewJob/ShopsAddNewJob.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addnew: '',
    accountlistArr: ['客户管理', '商品管理', '订单管理', '店铺管理', '资金管理', '营销管理'],
    jobname: '', //岗位名称
    jobdetail: '', //岗位描述
    roleid: '',
    menuIdList: [], //权限管理列表
    menuListArr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      addnew: options.addedit
    })
    if (options.roleid) {
      this.setData({
        roleid: options.roleid
      })
    }
    //拿到权限管理列表
    if (this.data.addnew == 'true') {
      //查询店员角色信息
      this.searchRoleDetail()
      wx.setNavigationBarTitle({
        title: '编辑岗位'
      })
    } else {
    this.shopcontentmanagerlist()
      wx.setNavigationBarTitle({
        title: '新建岗位'
      })
    }
  },
  shopcontentmanagerlist: function() {
    urlApi.getInfo(rootUrls.shopcontentlistUrl, {}, "get")
      .then(res => {
        console.log('manger', res)
        this.setData({
          menuListArr: res.result
        })
        if (this.data.menuIdList) {
          var tempmenuarr = this.data.menuListArr
          for (let i = 0; i < this.data.menuIdList.length; i++) {
            let menuCode = this.data.menuIdList[i]
            for (let j = 0; j < tempmenuarr.length; j++) {
              let orimenuCode = tempmenuarr[j].menuCode
              if (menuCode == orimenuCode) {
                tempmenuarr[j].managerTypeSelecte = true
              }
            }
          }
          this.setData({
            menuListArr: tempmenuarr
          })
        }

      })
  },
  searchRoleDetail: function() {
    urlApi.getInfo(rootUrls.studentInfoSearchUrl + this.data.roleid, {}, "get")
      .then(res => {
        //判断哪些menuidList被选中了
        // if (this.data.menuListArr) {
        //   var tempmenuarr = this.data.menuListArr
        //   for (let i = 0; i < res.role.menuIdList.length; i++) {
        //     let menuCode = res.role.menuIdList[i]
        //     for (let j = 0; j < tempmenuarr.length; j++) {
        //       let orimenuCode = tempmenuarr[j].menuCode
        //       if (menuCode == orimenuCode) {
        //         tempmenuarr[j].managerTypeSelecte = true
        //       }
        //     }
        //   }
        //   this.setData({
        //     menuListArr: tempmenuarr
        //   })
        // }

        this.setData({
          jobname: res.role.roleName,
          jobdetail: res.role.roleRemark ? res.role.roleRemark : '',
          menuIdList: res.role.menuIdList,
          menuListArr: res.role.merchantMenus
        })

      })
  },
  loginaccounttap: function(e) {
    this.setData({
      jobname: e.detail.value
    })
  },
  //岗位描述
  setpasswordtap: function(e) {
    this.setData({
      jobdetail: e.detail.value
    })
  },

  //选择大分类
  chooseCartory: function(e) {
    var pos = e.currentTarget.dataset.pos
    console.log(pos)

    if (this.data.menuListArr[pos].managerTypeSelecte) {
      this.data.menuListArr[pos].managerTypeSelecte = false;
      if (this.data.menuListArr[pos].child) {
        for (var i = 0; i < this.data.menuListArr[pos].child.length; i++) {
          this.data.menuListArr[pos].child[i].managerTypeSelecte = false;
        }
      }
    } else {
      this.data.menuListArr[pos].managerTypeSelecte = true;
      if (this.data.menuListArr[pos].child) {
        for (var i = 0; i < this.data.menuListArr[pos].child.length; i++) {
          this.data.menuListArr[pos].child[i].managerTypeSelecte = true;
        }
      }
    }

    this.setData({
      menuListArr: this.data.menuListArr
    })
  },
  //选择子分类
  chooseChild: function(e) {
    console.log(e)
    var pos = e.currentTarget.dataset.pos
    var childPos = e.currentTarget.dataset.childpos
    console.log(pos)
    console.log(childPos)
    if (this.data.menuListArr[pos].child[childPos].managerTypeSelecte) {
      this.data.menuListArr[pos].child[childPos].managerTypeSelecte = false
    } else {
      this.data.menuListArr[pos].child[childPos].managerTypeSelecte = true
    }

    var isChooseHead = false;

    for (var i = 0; i < this.data.menuListArr[pos].child.length; i++) {
      if (this.data.menuListArr[pos].child[i].managerTypeSelecte) {
        isChooseHead = true
        break
      }
    }
    this.data.menuListArr[pos].managerTypeSelecte = isChooseHead

    this.setData({
      menuListArr: this.data.menuListArr
    })
  },

  // //权限
  // checkboxChange: function (e) {
  //   var chooseidxArr = e.detail.value
  //   console.log('复选',e)
  //   this.setData({
  //     menuIdList: chooseidxArr
  //   })
  // },




  //新建
  completap: function() {
    // wx.navigateBack({

    // })
    var list = []
    for (let i = 0; i < this.data.menuListArr.length; i++) {
      if (this.data.menuListArr[i].managerTypeSelecte) {
        list.push(this.data.menuListArr[i].menuCode)
      }
      for (let j = 0; j < this.data.menuListArr[i].child.length; j++) {
        if (this.data.menuListArr[i].child[j].managerTypeSelecte) {
          list.push(this.data.menuListArr[i].child[j].menuCode)
        }
      }
    }
    //判断是否有填写岗位名称和描述和权限管理
    if (!this.data.jobname) {
      wx.showToast({
        icon: 'none',
        title: '请填写岗位名称',
      })
    } else if (this.data.jobdetail && this.data.jobdetail.length < 2) {
      wx.showToast({
        icon: 'none',
        title: '请在岗位描述中输入2-25个字符',
      })
    } else {
      wx.showLoading({
        icon: 'none',
        title: '正在新建',
      })
      let para = {
        "roleName": this.data.jobname,
        "roleRemark": this.data.jobdetail,
        'menuIdList': list,
        "shopId": wx.getStorageSync("chooseshopid")
      }
      console.log('添加店铺角色', para)
      urlApi.getInfo(rootUrls.addRoleUrl, para, "post")
        .then(res => {
          console.log('roletype', res)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '添加角色成功',
          })
          wx.navigateBack({})
        })
    }
  },
  //保存
  savetap: function() {

    var list = []
    for (let i = 0; i < this.data.menuListArr.length; i++) {
      if (this.data.menuListArr[i].managerTypeSelecte) {
        list.push(this.data.menuListArr[i].menuCode)
      }
      for (let j = 0; j < this.data.menuListArr[i].child.length; j++) {
        if (this.data.menuListArr[i].child[j].managerTypeSelecte) {
          list.push(this.data.menuListArr[i].child[j].menuCode)
        }
      }
    }


    if (!this.data.jobname) {
      wx.showToast({
        icon: 'none',
        title: '请填写岗位名称',
      })
    } else {
      wx.showLoading({
        icon: 'none',
        title: '正在修改',
      })
      let para = {
        "id": this.data.roleid,
        "roleName": this.data.jobname,
        "roleRemark": this.data.jobdetail,
        'menuIdList': list,
        "shopId": wx.getStorageSync("chooseshopid")
      }
      console.log('修改', para)
      urlApi.getInfo(rootUrls.shopRoleUrl, para, "post")
        .then(res => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '添加角色成功',
          })
          wx.navigateBack({})
        })
    }
  },
  //删除
  deletap: function() {
    wx.showLoading({
      icon: 'none',
      title: '正在删除',
    })
    let para = [this.data.roleid]
    urlApi.getInfo(rootUrls.deleteRolUrl, para, "post")
      .then(res => {
        console.log('删除店铺角色', res)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '删除角色成功',
        })
        wx.navigateBack({})
      })
  }
})