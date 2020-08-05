var isreshing = "0"


var thisrootUrl = "https://mch.wxmin.minshop.vip/gateway"
// var thisrootUrl = "http://192.168.1.32:9011/gateway"
// var thisrootUrl = "https://mch.wxmin.qiyijk.vip:9998/gateway"

var md5js = require('../utils/md5.js')
var rootUrls = require('../utils/rootUrl.js')

// 请求路径
function fetchApi(apiUrl, params, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl,
      data: params,
      method: method,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('access_token')
      },
      success: function(res) {
        // wx.hideLoading()
        if (res.data.code == 401) {
          //刷新code
          if (isreshing == "0") {
            //并且重新获取数据，保存请求地址和参数和方法 
            getusertoken()
          }
        } else {
          if (res.data.code == 0) {
            resolve(res)
          } else {
            wx.hideLoading()
            if (res.data.msg) {
              // 
              // https://mch.wxmin.minshop.vip/gateway/goods/add  /goods/modify

              if (apiUrl == 'https://mch.wxmin.minshop.vip/gateway/goods/add' || apiUrl == 'https://mch.wxmin.minshop.vip/gateway/goods/modify' || apiUrl == 'https://mch.wxmin.minshop.vip/gateway/seckillGoods/new/add' || apiUrl == 'https://mch.wxmin.minshop.vip/gateway/goods/downaway/' || apiUrl == 'https://mch.wxmin.minshop.vip/gateway/goods/putaway/') {
                resolve(res)
                // console.log('hi', res.data, apiUrl, params)
              }
              wx.showToast({
                icon: 'none',
                title: res.data.msg,
              })
            }
          }
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

function getInfo(apiUrl, params, method) {
  return fetchApi(thisrootUrl + apiUrl, params, method)
    .then(res => res.data)
}

//返回网络请求失败的接口
// 请求路径
function fetchApiTwo(apiUrl, params, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl,
      data: params,
      method: method,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('access_token')
      },
      success: function(res) {
        // wx.hideLoading()
        if (res.data.code == 401) {
          //刷新code
          if (isreshing == "0") {
            //并且重新获取数据，保存请求地址和参数和方法
            getusertoken()
          }
        } else {
          if (res.data.code == 0) {
            resolve(res)
          } else {
            wx.hideLoading()
            resolve(res)
            if (res.data.msg) {
              // console.log('hi', res.data, apiUrl, params)
              wx.showToast({
                icon: 'none',
                title: res.data.msg,
              })
            }
          }
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

function getInfoTwo(apiUrl, params, method) {
  return fetchApiTwo(thisrootUrl + apiUrl, params, method)
    .then(res => res.data)
}

//上传文件
function uploadfilerequest(apiUrl, tempFilePath, method) {

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl,
      filePath: tempFilePath,
      name: 'file',
      header: {
        'token': wx.getStorageSync('access_token')
      },
      formData: null,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

function getuploadInfo(apiUrl, tempFilePath, method) {
  return uploadfilerequest(thisrootUrl + apiUrl, tempFilePath, method)
    .then(res => res.data)
}

// 封装上传图片方法,返回服务器返回的链接
function imageUpload() {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //压缩图
      success(res) {
        const tempFilePaths = res.tempFilePaths
        var tempFilesSize = res.tempFiles[0].size ////获取图片的大小，单位B
        // console.log('图片大小', tempFilesSize, res)
        if (tempFilesSize <= 2000000) {
          wx.showLoading({
            title: '正在上传',
          })
          wx.uploadFile({
            url: thisrootUrl + "/basic/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'token': wx.getStorageSync('access_token')
            },
            formData: null,
            success(restwo) {
              wx.hideLoading()
              var result = JSON.parse(restwo.data)
              if (result.code == 0) {
                resolve(result)
              } else {
                wx.showToast({
                  icon: 'none',
                  title: result.msg,
                })
              }
            },
            fail(err) {
              wx.hideLoading()
              reject(err)
            },
          })
        } else { //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于2M!',
            icon: 'none'
          })
        }
      }
    })
  })
}

function getPicutreInfo() {
  //一个.then对应promise
  return new Promise((resolve, reject) => {
    imageUpload()
      .then(restwo => {
        resolve(restwo)
      })
  })
}

function getusertoken() {
  isreshing = '1'
  var secret = wx.getStorageSync('shanguserSecret')
  let para = {
    "userNumber": wx.getStorageSync('shanguserNumber'),
    "userSecret": md5js.md5(secret)
  }
  getInfo(rootUrls.tokenUrl, para, "post")
    .then(res => {
      isreshing = '0'
      if (res.code == 0) {
        wx.setStorageSync('access_token', res.access_token)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    })
}

// 时间戳
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function fen2Yuan(num) {
  if (typeof num !== "number" || isNaN(num)) return (0 / 100).toFixed(2);
  return (num / 100).toFixed(2);
}

function yuan(num) {
  if (typeof num !== "number" || isNaN(num)) return (0).toFixed(2);
  return (num).toFixed(2);
}

function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/;  //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;  //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}


function timeago(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  var result = ""
  console.log(dateTimeStamp)
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime(); //获取当前时间毫秒
  console.log(now)
  var diffValue = now - dateTimeStamp; //时间差

  if (diffValue < 0) {
    return;
  }
  var minC = diffValue // minute;  //计算时间差的分，时，天，周，月
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 12) {
    result = " " + parseInt(monthC / 12) + "年前"
  } else if (monthC >= 1 && monthC < 12) {
    result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC <= 30) {
    result = " " + parseInt(dayC) + "天前"
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
  }
  return result;
}



//配置公用方法
module.exports = {
  timeago: timeago,
  getInfo: getInfo,
  getuploadInfo: getuploadInfo,
  getPicutreInfo: getPicutreInfo,
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  fen2Yuan: fen2Yuan,
  isNumber: isNumber,
  getInfoTwo: getInfoTwo,
  yuan: yuan
}