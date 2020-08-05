// pages/mainClass/SkillSetDetail/SkillSetDetail.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseProduct:{},
    continuetime:'',
    seckillid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //计算持续时间
      this.setData({
        seckillid: options.seckillid
      })
    
    console.log('choosePro', this.data.chooseProduct)
    
    this.getseckilldetaildata()
  },
  getseckilldetaildata: function (){
    // shopskillgoodsdetail
    console.log('shopskillgoodsdetail', rootUrls.shopskillgoodsdetail + this.data.seckillid)
    urlApi.getInfo(rootUrls.shopskillgoodsdetail + this.data.seckillid, {}, "get")
      .then(res => {
        console.log('detail',res)
        var info = res.info
        for (let i = 0; i < info.descList.length;i++){
          let pro = info.descList[i]
          pro.goodsDescPrice = urlApi.fen2Yuan(pro.goodsDescPrice)
          pro.seckillPrice = urlApi.fen2Yuan(pro.seckillPrice)
        }
        this.setData({
          chooseProduct: info
        })
      })
  },

  //计算中间时间
  jisuancontinuetime:function (startime,endtime) {
    //根据持续时间计算结束时间，转化为时间戳，相加
    var format = startime.replace(/-/g, '/')
    var start = Date.parse(new Date(format)) / 1000
    var formatend = endtime.replace(/-/g, '/')
    var end = Date.parse(new Date(formatend)) / 1000
    var conti = 0
    conti = end - start
    if (conti>60){
      if (conti>3600){
        conti = conti / 3600 + '小时'
      }else{
        conti = conti / 60 + '分钟'
      }
    }else{
      conti = conti + '秒'
    }
    console.log(2, start,end, conti)
    return conti
  }

})