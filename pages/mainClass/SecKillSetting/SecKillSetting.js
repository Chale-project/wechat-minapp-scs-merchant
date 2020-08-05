// pages/mainClass/SecKillSetting/SecKillSetting.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPickerShow: false,
    startTime: "",
    pickerConfig: {
      endDate: false,
      column: "minute"
    },
    continueshow: false,
    columns: ['15分钟', '30分钟', '1小时', '3小时', '6小时','8小时'],
    continutime:"",
    endtime:"",
    chooseProduct:{},
    currentchoosetime:0,//当前选中的时间间隔
    limitbuynum:"",//限购数量
    saveing:true, //是否正在保存
    inputArr: '',
    originalprice:'',
    smallskillprice:'',
    guigeshow: false,
    modifyinputarr:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temchoosePro = JSON.parse(options.chooseProduct)
    var teminputarr = JSON.parse(options.inputArr)
    this.skillPirceAndOriginalPirce(teminputarr)
    this.setData({
      chooseProduct: temchoosePro,
      inputArr: teminputarr,
      modifyinputarr: teminputarr
      })
  },

  //计算最小秒杀价和原价
  skillPirceAndOriginalPirce: function (teminputarr) {
    //获取最低规格秒杀价和规格原价
    var temskillprice = ''
    var temoriprice = ''
    var pricetime = 0
    for (let i = 0; i < teminputarr.length; i++) {
      let pro = teminputarr[i]
      if (Number(pro.seckillPrice) > 0 && pricetime == 0) {
        pricetime = 1
        temskillprice = (Number(pro.seckillPrice) * 100 / 100).toFixed(2)
        temoriprice = (Number(pro.descPrice) * 100 / 100).toFixed(2)
      }
      else {
        if (Number(pro.seckillPrice) < Number(temskillprice) && Number(pro.seckillPrice) > 0) {
          temskillprice = ((pro.seckillPrice) * 100 / 100).toFixed(2)
          temoriprice = ((pro.descPrice) * 100 / 100).toFixed(2)
        }
      }
    }
    this.setData({
      smallskillprice: temskillprice,
      originalprice: temoriprice
    })
  },
  modifyguigetap: function (){
    this.setData({
      guigeshow: true
    })
  },

  //填写秒杀价
  guigepriceinput: function (e) {
    var idx = e.currentTarget.dataset.idx
    var temp = this.data.inputArr
    temp[idx].seckillPrice = e.detail.value
    this.setData({
      inputArr: temp
    })
  },
  //填写活动库存
  guigenuminput: function (e) {
    var idx = e.currentTarget.dataset.idx
    var temp = this.data.inputArr
    temp[idx].seckillNum = e.detail.value
    this.setData({
      inputArr: temp
    })
  },
  hideModal: function () {
    this.setData({
      guigeshow: false,
      inputArr: this.data.modifyinputarr
    })
  },
  onClose: function () {
    this.setData({
      guigeshow: false,
      inputArr: this.data.modifyinputarr
    })
  },
  hideModalsure: function () {
    //判断必须要填写一个完整的秒杀价和活动库存，且只有填写一个，另一个也要有值
    var wanzhang = 0
    for (let i = 0; i < this.data.inputArr.length; i++) {
      let guigenum = i + 1
      let pro = this.data.inputArr[i]
      if (Number(pro.seckillPrice) > 0) {
        if (Number(pro.seckillNum) > 0) {

        } else {
          wx.showToast({
            icon: 'none',
            title: '第' + guigenum + '个规格的活动库存必须大于0',
          })
          return;
        }
      }
      if (Number(pro.seckillNum) > 0) {
        if (Number(pro.seckillPrice) > 0) {

        } else {
          wx.showToast({
            icon: 'none',
            title: '第' + guigenum + '个规格的秒杀价必须大于0',
          })
          return;
        }
      }
      if (Number(pro.seckillNum) > 0 && Number(pro.seckillPrice) > 0){
        if (Number(pro.descPrice) <= Number(pro.seckillPrice)) {
          wx.showToast({
            icon: 'none',
            title: '第' + guigenum + '个规格的秒杀价必须小于原价',
          })
          return;
        }
        wanzhang++
      }
    }
    if (wanzhang == 0){
      wx.showToast({
        icon: 'none',
        title: '最少填写一组规格的秒杀价和活动库存',
      })
      return;
    }
    this.setData({
      guigeshow: false
    })
    //刷新最小秒杀价
    this.skillPirceAndOriginalPirce(this.data.inputArr)
  },
  //开始时间选择
  timechoosepickertap: function () {
    this.setData({
      isPickerShow: true
    });
  },
  pickerHide: function () {
    this.setData({
      isPickerShow: false
    });
  },
  setPickerTime: function (val) {
    let data = val.detail;
    this.setData({
      startTime: data.startTime
    });
    //判断持续时间是否已选
    if(this.data.currentchoosetime>0){
      //根据持续时间计算结束时间，转化为时间戳，相加
      var format = this.data.startTime.replace(/-/g, '/')
      var start = Date.parse(new Date(format)) / 1000
      var endti = 0
      endti = start + this.data.currentchoosetime
      this.setData({
        endtime: urlApi.formatTimeTwo(endti, 'Y-M-D h:m:s')
      })
    }
  },
  continuetimetap: function () {
    if(this.data.startTime.length<1){
      wx.showToast({
        icon: 'none',
        title: '请先选开始时间',
      })
    }else{
      this.setData({
        continueshow: true
      })
    }
  },
  continuetimeClose: function (e) {
    this.setData({
      continueshow: false
    })
  },
  continuetimeConfirm(event) {
    this.setData({
      continueshow: false
    })
    //根据持续时间计算结束时间，转化为时间戳，相加
    var format = this.data.startTime.replace(/-/g, '/')
    var start = Date.parse(new Date(format))/1000
    var conti = 0
    var endti = 0
    //计算endtime
    var index = event.detail.index
    var valuetemp = [15, 30, 1, 3, 6, 8]
    
    if (index<2){
      // 分钟
      // this.data.startTime截取至分钟
      conti = valuetemp[index]*60
    }else{
      conti = valuetemp[index] * 60 * 60
    }
    endti = start + conti
    this.setData({
      currentchoosetime: conti,
      continutime: event.detail.value,
      endtime: urlApi.formatTimeTwo(endti, 'Y-M-D h:m:s')
    })
  },
  limitinput:function (e) {
    this.data.limitbuynum = e.detail.value
  },
  saveprotap: function () {
    //判断秒杀价是否小于原价，传的是分
    if (this.data.startTime.length<1){
      wx.showToast({
        icon: 'none',
        title: '请选择开始时间',
      })
    } else if (this.data.continutime.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请选择持续时间',
      })
    } else{
      this.saveskillpriceset()
    }
  },
  saveskillpriceset:function () {  
      if(this.data.saveing){
        this.data.saveing = false
        wx.showLoading({
          title: '保存中...',
        })
        console.log('inputArr', this.data.inputArr)
        var teminputarr = []
        //取出完整的规格数据
        for (let i = 0; i < this.data.inputArr.length;i++){
          let pro = this.data.inputArr[i]
          if (Number(pro.seckillPrice) > 0 && Number(pro.seckillNum) > 0){
            pro.seckillPrice = pro.seckillPrice * 100
            pro.descPrice = pro.descPrice * 100
            teminputarr.push(pro)
          }
        }
        var param = { "shopId": wx.getStorageSync("chooseshopid"), 'goodsId': this.data.chooseProduct.id, 'startTimeStr': this.data.startTime, 'endTimeStr': this.data.endtime, 'limitation': this.data.limitbuynum, 'descList': teminputarr }
        console.log(1, param)
        urlApi.getInfoTwo(rootUrls.addseckillGoodsUrl, param, "post")
          .then(res => {
            wx.hideLoading()
            this.data.saveing = true
            if (res.code == 0) {
              var pages = getCurrentPages();
              // var currPage = pages[pages.length - 1];   //当前页面
              if (pages.length > 2) {
                var prevPage = pages[pages.length - 3];  //上一个页面
                prevPage.setData({
                  caterIndex: 2
                })
              }
              wx.navigateBack({
                delta: 2
              })
            }else{
              var teminputarr = []
              //取出完整的规格数据
              for (let i = 0; i < this.data.inputArr.length; i++) {
                let pro = this.data.inputArr[i]
                if (Number(pro.seckillPrice) > 0 && Number(pro.seckillNum) > 0) {
                  pro.seckillPrice = pro.seckillPrice / 100
                  pro.descPrice = pro.descPrice / 100
                  teminputarr.push(pro)
                }
              }
            }
          })
      }
     

    
  }
  
})