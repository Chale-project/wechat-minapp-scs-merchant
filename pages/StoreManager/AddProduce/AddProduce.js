// pages/StoreManager/AddProduce/AddProduce.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
import Dialog from '../../../vantUi/dialog/dialog'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    curaddindex:0,//后台接口尚未出来
    itemallarr: [{ "itemImages": "", "specificationItems": "", "descPrice": "", "number": "", "commodityCode": "","curcodestate":true}],//存储对应的图片
    // prodetailarr:["商品详情","分类","已关闭商品推荐"],
    prodetailarr: ["商品详情", "分类"],
    cameraurlarr:'',//顶部轮播
    cameraDetailArr:'',
    //标记输入的标题，价格，库存
    protitle:"",
    prokucun:"",
    choosecaterdic: {},
    biaotitext:"",
    uploweditOrAdd:"",
    bottomtitledata:[],
    shangpinid:"",
    currentMaketable:"",
    prospec:"",//详情
    searchCodeBool:true,
    switchchecked:false,
    isHuiYuan:false,//是否参与会员卡折扣
    curcameraindex:0,//当前显示的图片idx
    detailInfo:{},//商品入库详情
    shangjiaOrXiajia:false,
    isloading:false,
    isFromGoodsRoom: false,
    isOneOrThreeBottom:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        uploweditOrAdd: options.uploweditOrAdd
      })
      if (this.data.uploweditOrAdd < 2) {
        wx.setNavigationBarTitle({
          title: '修改商品'
        })
        this.getdetaildata(options.proid)
      } else {
        wx.setNavigationBarTitle({
          title: '添加商品'
        })
        wx.setStorageSync('shopspec', "")
      }
  },
  getdetaildata:function(id) {
    urlApi.getInfo(rootUrls.prodetailUrl+id, {}, "get")
      .then(res => {
        var tempchoosecaterdic = { "id": "","name":""}
        if(res.code == 0){
          tempchoosecaterdic.id = res.info.categoryId
          tempchoosecaterdic.name = res.info.categoryName
          var temparr = []
          if (this.data.uploweditOrAdd==0){
            temparr = ["下架", "删除", "保存"]
            
          }else{
            temparr = ["上架", "删除", "保存"]
          }
          var goodsdecarr = res.info.goodsDesc
          for(let i=0;i<goodsdecarr.length;i++){
            goodsdecarr[i].descPrice = goodsdecarr[i].descPrice/100
          }
          if (goodsdecarr.length<1){
            goodsdecarr = [{ "itemImages": "", "specificationItems": "", "descPrice": "", "number": "", "commodityCode": "", "curcodestate": true }]
          }
          //判断规格是否大于1,判断是否有规格名或规格图片
          if (goodsdecarr.length>1){
            this.setData({
              curaddindex:1
            })
          }else{
            if (goodsdecarr[0].specificationItems.length > 0 || goodsdecarr[0].itemImages.length>0){
              this.setData({
                curaddindex:1
              })
            }
          }
          if (res.info.commodityId){
            if (res.info.commodityId.length > 0) {
              this.data.isFromGoodsRoom = true
            }
          }
          this.setData({
            bottomtitledata:temparr,
            cameraurlarr: res.info.image.split(","),
            cameraDetailArr: res.info.image,
            biaotitext: res.info.title,
            itemallarr: goodsdecarr,
            shangpinid: res.info.id,
            choosecaterdic: tempchoosecaterdic,
            currentMaketable: res.info.isMarketable,
            prospec: res.info.spec,
            switchchecked: res.info.isRecommend =='recommend'?true:false,
            isHuiYuan: res.info.isMemberDiscount == 'yes'?true:false,
            prodetailarr: ["商品详情", "分类"]
            // prodetailarr: ["商品详情", "分类", res.info.isRecommend == 'recommend' ? "已开启商品推荐" : "已关闭商品推荐"]
          })
          wx.setStorageSync('choosecaterdic', this.data.choosecaterdic)
          //image转html
          var difno = decodeURIComponent(res.info.spec)
          //判断详情中的内容是否为空
          if (!difno || difno == '<p><br></p>' || difno == 'null' || difno == null){
          this.imageConnectSrc(this.data.cameraurlarr)
          }else{
            
            wx.setStorageSync('shopspec', encodeURIComponent(difno))
          }
          console.log('详情', res)
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
  },
  //拼接图片链接
  imageConnectSrc:function(imageUrlArr){
    var imgstr = ""
    for(let i=0;i<imageUrlArr.length;i++){
      var str = "<img src=" + "'" + imageUrlArr[i] + "'" + ' ' + "mode=aspectFix" + ' ' + "style='width:100%'/>"
      imgstr = imgstr + str
    }
    // console.log('图片链接', imgstr)
    wx.setStorageSync('shopspec', encodeURIComponent(imgstr))
  },
  onShow: function (options) {
    this.setData({
      choosecaterdic: wx.getStorageSync("choosecaterdic")
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  // 上传图片
  caramtap: function () {
    let that = this
    wx.chooseImage({
      count:'9',
      sizeType: ['compressed'],//压缩图
      success(res) {
        const tempFilePaths = res.tempFilePaths
        // 此处需要先上传服务器(考虑批量上传),获取的图片顺序显示为选择的顺序
        wx.showLoading({
          title: '正在上传',
        })
        var imagehttparr = []
        var totalsuccessupload = 0
        var totalfailedupload = 0
        for (let i = 0; i < tempFilePaths.length;i++){
          urlApi.getuploadInfo(rootUrls.uploadfileUrl, tempFilePaths[i], "post")
            .then(res => {
              var result = JSON.parse(res)
              if (result.code == 0) {
                totalsuccessupload++
                //添加一个标记
                imagehttparr.push({ 'imageurl': result.url,'idx':i})

              }
              else {
                totalfailedupload++
                wx.showToast({
                  icon: 'none',
                  title: result.msg,
                })
              }
              //有可能到最后一次上传完成上一次上传还未完成,上传成功和上传失败的总数量不变
              if (totalsuccessupload+totalfailedupload == tempFilePaths.length) {
                wx.hideLoading()
                //倒序
                imagehttparr.sort(function (x, y) {
                  return y['idx'].toString().localeCompare(x['idx'].toString());
              })
                var tempimagearr = []
                for (let j = imagehttparr.length - 1; j >=0; j--) {
                  let imagepic = imagehttparr[j].imageurl
                  tempimagearr.push(imagepic)
                }
                that.setData({
                  cameraurlarr: tempimagearr
                })
                if(totalfailedupload>0){
                  wx.showToast({
                    icon: 'none',
                    title: '有'+totalfailedupload+'张图片上传失败',
                  })
                }
              }
            })
        }
      }
    })
    
  },
  //图片加载出错，替换为默认图片
  avatarError: function (e) {
  },
  //标题
  inputnametap: function (e) {
    this.data.biaotitext = e.detail.value
  },
  //规格
  priceinputtapone: function (e) {
    var curfir = e.currentTarget.dataset.idx;
    var temparr = this.data.itemallarr
    //取出对应的输入框值赋值
    temparr[curfir].specificationItems = e.detail.value
    this.setData({
      itemallarr: temparr
    })
  },
  priceinputtaptwo: function (e) {
    // 如果来到这个地方则以元为单位
    var curfir = e.currentTarget.dataset.idx;
    var temparr = this.data.itemallarr
    //取出对应的输入框值赋值,清空时也清空des
    temparr[curfir].descPrice = e.detail.value
    this.setData({
      itemallarr: temparr
    })
  },
  panduanPriceBigSalePrice:function (){
    //recommenSalePriceUrl 
        //获取所有规格id
        //调用该接口判断价格是否小于零售价
      let that = this
      var successcountload = 0
      var failcountload = 0
      //记录哪几组规格价格小于零售价
      var guigezu = []
    for (let i = 0; i < that.data.itemallarr.length;i++){
      let guige = that.data.itemallarr[i]
        let url = rootUrls.recommenSalePriceUrl + guige.id
        let tempjiage = guige.descPrice * 100
        console.log('建议零售价url', url, tempjiage)
        urlApi.getInfoTwo(url, {}, "get")
          .then(res => {
            console.log('零售价',res)
            //保存每一次的建议零售价
            if(res.code == 0) {
              
              if (tempjiage<res.price){
                guigezu.push(i+1) 
              }
              successcountload++
            }else{
              failcountload++
            }
            if (successcountload + failcountload == that.data.itemallarr.length){
              //已请求完成
              if(guigezu.length>0){
                wx.showModal({
                  title: '提示',
                  content: '第' + guigezu.toString() +'组规格价格低于零售价，是否确认保存？',
                  showCancel: true,//是否显示取消按钮
                  cancelText: "否",//默认是“取消”
                  cancelColor: '#000000',//取消文字的颜色
                  confirmText: "是",//默认是“确定”
                  confirmColor: '#ff4444',//确定文字的颜色
                  success: function (res) {
                    if (res.cancel) {
                      //点击取消,默认隐藏弹框
                      that.data.isloading = false
                    } else {
                      //点击确定,继续保存
                      that.saveAllPro()
                    }
                  }
                })
              }else{
                //调用保存或上架等接口
                that.saveAllPro()
              }
              
            }
          })
      }
      
  },
  priceinputtapthree: function (e) {
    var curfir = e.currentTarget.dataset.idx;
    var temparr = this.data.itemallarr
    //取出对应的输入框值赋值
    temparr[curfir].number = e.detail.value
    this.setData({
      itemallarr: temparr
    })
  },
  priceinputtapfour: function(e) {
    // this.data.searchCodeBool = true
    var curfir = e.currentTarget.dataset.idx;
    var temparr = this.data.itemallarr
    //取出对应的输入框值赋值
    temparr[curfir].commodityCode = e.detail.value
    this.setData({
      itemallarr: temparr
    })
  },
  //二维码
  qrcodetap: function(e){
    let that = this
    var curfir = e.currentTarget.dataset.idx;
    var temparr = that.data.itemallarr
    wx.scanCode({
      success(res) {
        //取出对应的输入框值赋值
        temparr[curfir].commodityCode = res.result
        that.setData({
          itemallarr: temparr
        })
      }
    })
  },

  // 添加商品规格
  addbuttontap: function () {
    var temparr = this.data.itemallarr
    // { "id": 1, "imageurl": "" }
    if (this.data.curaddindex==1){
      temparr.push({ "itemImages": "", "specificationItems": "", "descPrice": "", "number": "", "commodityCode": "", "curcodestate": true })
    }
    this.setData ({
      curaddindex: 1,
      itemallarr: temparr
    })
  },
  // 删除商品规格
  delbuttontap: function (e) {
    var selindex = e.currentTarget.dataset.index
    var temparr = this.data.itemallarr
    temparr.splice(selindex,1)
    this.setData({
      itemallarr: temparr
    })
  },
  // 商品详情-选择分类
  detailprotap: function (e) {
    var curtag = e.currentTarget.dataset.ide
    if (curtag == 0){
      // wx.navigateTo({
      //   url: '../ProDetail/ProDetail',
      // })
      wx.navigateTo({
        url: '/pages/mainClass/ShopIntroduct/ShopIntroduct?subject=' + "1",
      })
    }else{
      wx.navigateTo({
        url: '../ProChooseCater/ProChooseCater',
      })
    }
  },
  tapupimage: function (e) {
    //保存每一规格上传的图片
    let that = this
    var curtag = e.currentTarget.dataset.idx
    var temparr = that.data.itemallarr
    wx.navigateTo({
      url: '/pages/mainClass/cutInside/cutInside?uploadGoodImageUrl=' + temparr[curtag].itemImages + '&isfrom=' + 'AddProduce' + '&imageidx=' + curtag,
    })
    return
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        var tempFilesSize = res.tempFiles[0].size////获取图片的大小，单位B
        if (tempFilesSize <= 2000000) {
          urlApi.getuploadInfo(rootUrls.uploadfileUrl, tempFilePath, "post")
            .then(res => {
              wx.hideLoading()
              var result = JSON.parse(res)
              if (result.code == 0) {
                temparr[curtag].itemImages = result.url
                that.setData({
                  itemallarr: temparr
                })
              }
              else {
                wx.showToast({
                  icon: 'none',
                  title: result.msg,
                })
              }
            })
        } else {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于2M!',
            icon: 'none'
          })
        }
        wx.showLoading({
          title: '正在上传',
        })
      }
    })
  },
  //图片加载出错，替换为默认图片
  avatarguigeError: function(e) {

  },
  givetap:function () {
    this.saletap("out")
  },
  upstoretap: function () {
    this.saletap("put")
  },
  //添加商品
  saletap: function (isMarketable) {
    //遍历判断不能为空
    if (this.allguigeIsTrueOrFalse()){

    }else{
      this.addrpoductdatarequest(isMarketable)
    }
  },
  // 增加商品接口
  addrpoductdatarequest: function (isMarketable){
      wx.showLoading({
        title: '正在新增',
      })
      var kucun = false
      for (let i = 0; i < this.data.itemallarr.length; i++) {
        var number = this.data.itemallarr[i].number
        if (number > 0) {
          kucun = true
          break
        }
      }
      if (kucun) {
        //判断编码是否重复
          this.newAddPro(isMarketable)
      }
      else{
        wx.showToast({
          icon: 'none',
          title: '库存不能为空'
        })
      }
  },
  //判断规格是否都已填写
  allguigeIsTrueOrFalse: function () {
    var guigeistrue = false
    if (this.data.cameraurlarr.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请添加商品图片',
      })
      return true
    } else if (!this.data.biaotitext) {
      wx.showToast({
        icon: 'none',
        title: '请填写商品标题',
      })
      return true
    }
    else if (!this.data.choosecaterdic.id) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品分类',
      })
      return true
    }
    var totalnum = 0
    for (let i = 0; i < this.data.itemallarr.length; i++) {
      var temi = i + 1
      var addprodata = this.data.itemallarr[i]
      if (!addprodata.specificationItems && this.data.curaddindex == 1) {
        guigeistrue = true
        wx.showToast({
          icon: 'none',
          title: '请填写第' + temi + '组规格的规格名',
        })
        return true
      }
      if (!addprodata.commodityCode) {
        guigeistrue = true
        var tishititle = '请填写第' + temi + '组规格的商品编码'
        if (this.data.curaddindex == 0){
          tishititle = '请填写商品编码'
        }
        wx.showToast({
          icon: 'none',
          title: tishititle,
        })
        return true
      }
      if (!addprodata.descPrice) {
        guigeistrue = true
        var tishititle = '请填写第' + temi + '组规格的价格'
        if (this.data.curaddindex == 0) {
          tishititle = '请填写商品价格'
        }
        wx.showToast({
          icon: 'none',
          title: tishititle,
        })
        return true
      }
      if (!addprodata.number){
        if (addprodata.number == 0){
          
        }else{
          guigeistrue = true
          wx.showToast({
            icon: 'none',
            title: '请填写第' + temi + '组规格的库存',
          })
          return true
        }
      }
      if (!addprodata.itemImages && this.data.curaddindex == 1) {
        guigeistrue = true
        wx.showToast({
          icon: 'none',
          title: '请选择第' + temi + '组规格的图片',
        })
        return true
      }
      if (addprodata.number){
        totalnum = totalnum + parseInt(addprodata.number)
      }
    }
    console.log('下架1323121',this.data.shangjiaOrXiajia)
    //限制总库存不能为0
    if (totalnum < 1 && this.data.shangjiaOrXiajia && this.data.uploweditOrAdd == 1){
      guigeistrue = true
      wx.showToast({
        icon: 'none',
        title: '商品总库存不能为0',
      })
      return true
    }
    return guigeistrue
  },
  //新增
  newAddPro: function (isMarketable) {
    var temparr = this.data.itemallarr
      for (let i = 0; i < temparr.length; i++) {
        temparr[i].descPrice = temparr[i].descPrice * 100
        temparr[i].number = temparr[i].number ? temparr[i].number:0
      }
    this.data.itemallarr = temparr
    
    //库存和详情选填
    var paradic = ''
    var url = ''
    if (this.data.curaddindex == 0){
      url = rootUrls.addgoodsNewUrl
      paradic = { "shopId": wx.getStorageSync("chooseshopid"), "categoryId": this.data.choosecaterdic.id, "image": this.data.cameraurlarr.toString(), "title": this.data.biaotitext, "commodityCode": this.data.itemallarr[0].commodityCode, 'descPrice': this.data.itemallarr[0].descPrice, 'number': this.data.itemallarr[0].number,"isMarketable": isMarketable, "spec": wx.getStorageSync('shopspec'), "isRecommend": this.data.switchchecked ? 'recommend' : 'noRecommend', 'isMemberDiscount': this.data.isHuiYuan ? 'yes' : 'no' }
    }else{
      url = rootUrls.addgoodsUrl
      paradic = { "shopId": wx.getStorageSync("chooseshopid"), "categoryId": this.data.choosecaterdic.id, "image": this.data.cameraurlarr.toString(), "title": this.data.biaotitext, "goodsDesc": this.data.itemallarr, "isMarketable": isMarketable, "spec": wx.getStorageSync('shopspec'), "isRecommend": this.data.switchchecked ? 'recommend' : 'noRecommend', 'isMemberDiscount': this.data.isHuiYuan ? 'yes' : 'no' }
    }
    console.log('无规格',paradic,url)
    // addgoodsUrl
    urlApi.getInfoTwo(url, paradic, "post")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          wx.navigateBack({
            detail:1
          })
        } else {
          var temparr = this.data.itemallarr
          for (let i = 0; i < temparr.length; i++) {
            temparr[i].descPrice = temparr[i].descPrice / 100
          }
          this.data.itemallarr = temparr
        }
      })
  },
  bottomitemtap: function(e) {
    console.log("点击了这里1111")
    var idw = e.currentTarget.dataset.idx
    if(idw==0){
      this.data.shangjiaOrXiajia = true
      console.log("点击了这里2222" + this.allguigeIsTrueOrFalse())
      if (this.allguigeIsTrueOrFalse()) {
      }else {
        // if (this.data.uploweditOrAdd == 0) {
        //   wx.showLoading({
        //     title: '下架中...',
        //   })
        // } else {
        //   wx.showLoading({
        //     title: '上架中...',
        //   })
        // }
        this.data.isOneOrThreeBottom = 0
        if (this.data.isloading){
          console.log("点击了这里loading====" + this.data.isloading)
          return
        }
        this.data.isloading = true
        //判断是否是商品库商品,查询每一个规格对应的规格id
        console.log("点击了这里666666")
        if (this.data.isFromGoodsRoom) {
          this.panduanPriceBigSalePrice()
        } else {
          this.saveAllPro()
        }
      }
    }else if (idw==1){
      if (app.globalData.isShopOperator) {
        var canenter = '0'
        for (let i = 0; i < app.globalData.menuAuth.length; i++) {
          let pro = app.globalData.menuAuth[i]
          if (pro == 'productManager4') {
            canenter = '1'
          }
        }
        if (canenter != '1') {
          wx.showToast({
            icon: 'none',
            title: '您暂无此权限',
          })
          return
        }
      }

      this.data.shangjiaOrXiajia = false
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
    }else{
      if (this.allguigeIsTrueOrFalse()){

      }else{
        this.data.isOneOrThreeBottom = 2
        this.data.shangjiaOrXiajia = false
        //判断是否是商品库商品,查询每一个规格对应的规格id
        if (this.data.isFromGoodsRoom){
          this.panduanPriceBigSalePrice()
        }else{
          this.saveAllPro()
        }
      }
    }
  },

  uplistlowdata: function (requrl) {
    urlApi.getInfo(requrl + this.data.shangpinid, {}, "PUT")
      .then(res => {
        this.data.isloading = false
        if(res.code == 0){
          wx.hideLoading()
          wx.navigateBack({
            detail: 1
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
        
      })
  },
  
  saveAllPro:function () {
    if (this.data.isOneOrThreeBottom == 0){
      if (this.data.uploweditOrAdd == 0) {
        wx.showLoading({
          title: '下架中...',
        })
      } else {
        wx.showLoading({
          title: '上架中...',
        })
      }
    } else if (this.data.isOneOrThreeBottom == 2){
      wx.showLoading({
        title: '保存中...',
      })
    }
    var temparr = this.data.itemallarr
    for (let i = 0; i < temparr.length; i++) {
      temparr[i].descPrice = temparr[i].descPrice * 100
    }
    this.data.itemallarr = temparr
    
    //库存和详情选填
    var paradic = { "shopId": wx.getStorageSync("chooseshopid"), "categoryId": this.data.choosecaterdic.id, "image": this.data.cameraurlarr.toString(), "title": this.data.biaotitext, "goodsDesc": this.data.itemallarr, "isMarketable": this.data.currentMaketable, "id": this.data.shangpinid, "spec": wx.getStorageSync('shopspec'), "isRecommend": this.data.switchchecked ? 'recommend' : 'noRecommend', 'isMemberDiscount': this.data.isHuiYuan ? 'yes' : 'no' }
    var modifyurl = ''
    if(this.data.curaddindex == 0){
      //无规格
      modifyurl = rootUrls.prosavenewUrl
    }else{
      modifyurl = rootUrls.prosaveUrl
    }
    urlApi.getInfoTwo(modifyurl, paradic, "PUT")
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          if (this.data.shangjiaOrXiajia){
            if (this.data.uploweditOrAdd == 0) {
              //下架
              wx.showLoading({
                title: '正在下架',
              })
              this.uplistlowdata(rootUrls.listlowUrl)
            } else {
              //上架
              wx.showLoading({
                title: '正在上架',
              })
              this.uplistlowdata(rootUrls.listupUrl)
            }
          }else{
            wx.navigateBack({
              delta:1
            })
          }
          
        } else {
          var temparr = this.data.itemallarr
          for (let i = 0; i < temparr.length; i++) {
            temparr[i].descPrice = temparr[i].descPrice / 100
          }
          this.data.itemallarr = temparr
        }
      })
  },
  //商品推荐
  onSwitchChange:function (event) {
    this.setData({
      switchchecked:event.detail,
      // prodetailarr: ["商品详情", "分类", event.detail ? "已开启商品推荐" : "已关闭商品推荐"]
      prodetailarr: ["商品详情", "分类"]
    })
  },
  //是否参与会员卡折扣
  onSwitchChangetwo: function (event) {
    this.setData({
      isHuiYuan: event.detail,
      // prodetailarr: ["商品详情", "分类", this.data.switchchecked ? "已开启商品推荐" : "已关闭商品推荐"]
       prodetailarr: ["商品详情", "分类"]
    })
  },
  //累计添加商品图片
  leijiAddProTap: function () {
    let that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        // 此处需要先上传服务器(考虑批量上传)
        wx.showLoading({
          title: '正在添加图片',
        })
        
        var imagehttparr = that.data.cameraurlarr
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
                  icon: 'none',
                  title: result.msg,
                })
              }
              if (i == tempFilePaths.length - 1) {
                that.setData({
                  cameraurlarr: imagehttparr
                })
              }
            })
        }
      }
    })
  },
  uploadchange:function (e) {
    var cur = e.detail.current
    this.data.curcameraindex = cur
  },

  //删除当前图片
  delProTap:function () {
    //获取当前图片的地址
    var temparr = this.data.cameraurlarr
    temparr.splice(this.data.curcameraindex, 1)
    var imageindex = 0
    if (this.data.curcameraindex > 0) {
      imageindex = this.data.curcameraindex - 1
    }
    this.setData({
      cameraurlarr: temparr,
      curcameraindex: imageindex
    })
  },
  //放大图片
  bigimagetap:function (e) {
    // console.log('放大',e)
    // var cur = e.currentTarget.dataset.idy
    
  },
  
})