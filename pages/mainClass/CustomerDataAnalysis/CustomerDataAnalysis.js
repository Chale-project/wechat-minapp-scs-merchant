// pages/mainClass/CustomerDataAnalysis/CustomerDataAnalysis.js
var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
let chart = null;
let chart2 = null;
let chart3 = null;
let chart4 = null;
let chart5 = null;

function initChart(canvas, width, height, F2) {
  const map = {
    '新客户': '40%',
    '回头客': '80%'
  };
  const data = [{
      name: '新客户',
      percent: 0.2,
      a: '1'
    },
    {
      name: '回头客',
      percent: 0.8,
      a: '1'
    }
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    percent: {
      formatter(val) {
        return val * 100 + '%';
      }
    }
  });
  chart.legend({
    position: 'left',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval()
    .position('a*percent')
    .color('name', ['#1890FF', '#13C2C2'])
    .adjust('stack')
    .style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    })
    .animate({
      appear: {
        duration: 1200,
        easing: 'bounceOut'
      }
    });

  chart.render();
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    month: '4月',
    opts: {
      onInit: initChart
    },
    opts1: {
      onInit: initChart1
    },
    opts2: {
      onInit: initChart2
    },
    opts3: {
      onInit: initChart3
    },
    opts4: {
      onInit: initChart4
    },
    data2 : [{
      "country": "",
      "value": 10,
      "year": '05-01'
    }, {
      "country": "",
      "value": 12,
      "year": '05-02'
    }, {
      "country": "",
      "value": 15,
      "year": '05-03'
    }, {
      "country": "",
      "value": 17,
      "year": '05-04'
    }, {
      "country": "",
      "value": 21,
      "year": '05-05'
    }, {
      "country": "",
      "value": 11,
      "year": '05-06'
    }, {
      "country": "",
      "value": 30,
      "year": '05-07'
    }, {
      "country": "",
      "value": 50,
      "year": '05-08'
    }],
    data3: [{
      "country": "",
      "value": 50,
      "year": '05-01'
    }, {
      "country": "",
      "value": 22,
      "year": '05-02'
    }, {
      "country": "",
      "value": 35,
      "year": '05-03'
    }, {
      "country": "",
      "value": 17,
      "year": '05-04'
    }, {
      "country": "",
      "value": 44,
      "year": '05-05'
    }, {
      "country": "",
      "value": 11,
      "year": '05-06'
    }, {
      "country": "",
      "value": 30,
      "year": '05-07'
    }, {
      "country": "",
      "value": 50,
      "year": '05-08'
    }],
    data4: [{
      "country": "",
      "value": 80,
      "year": '05-01'
    }, {
      "country": "",
      "value": 47,
      "year": '05-02'
    }, {
      "country": "",
      "value": 15,
      "year": '05-03'
    }, {
      "country": "",
      "value": 57,
      "year": '05-04'
    }, {
      "country": "",
      "value": 43,
      "year": '05-05'
    }, {
      "country": "",
      "value": 34,
      "year": '05-06'
    }, {
      "country": "",
      "value": 30,
      "year": '05-07'
    }, {
      "country": "",
      "value": 50,
      "year": '05-08'
    }],
    statisticsType:"day"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var myDate = new Date(); //获取系统当前时间
    this.setData({
      date: this.getNowFormatDate()
    })
      wx.showLoading({
        title: '加载中',
      })
      this.getData()
  },

  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date()
    var seperator1 = "-"
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  getData: function () {
    let that = this
    urlApi.getInfo(rootUrls.indexCustomerAnalysis, {
      "shopId": wx.getStorageSync("chooseshopid"),
      "statisticsType": that.data.statisticsType
    }, "POST")
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log('数据',res)
        if (res.code == 0) {
          that.setData({
            visitCount: res.result.visitCount,
            visitCountChange: res.result.visitCountChange,
            visitCountChange1: 0-res.result.visitCountChange,
            visitPeopleCount: res.result.visitPeopleCount,
            visitPeopleCountChange: res.result.visitPeopleCountChange,
            visitPeopleCountChange1: 0-res.result.visitPeopleCountChange,
            orderPeopleCount: res.result.orderPeopleCount,
            orderPeopleCountChange: res.result.orderPeopleCountChange,
            orderPeopleCountChange1: 0 - res.result.orderPeopleCountChange,
            newCustomerCount: res.result.newCustomerCount,
            newCustomerCountChange: res.result.newCustomerCountChange,
            newCustomerCountChange1: 0 - res.result.newCustomerCountChange,
            repeatCustomerCount: res.result.repeatCustomerCount,
            repeatCustomerCountChange: res.result.repeatCustomerCountChange,
            repeatCustomerCountChange1: 0 - res.result.repeatCustomerCountChange,
            avgPayment: res.result.avgPayment,
            avgPaymentChange: res.result.avgPaymentChange,
            avgPaymentChange1: 0 - res.result.avgPaymentChange
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
  },


  onChange(event) {
    switch (event.detail.index) {
      case 0:
        chart2.changeData(this.data.data2)
        chart3.changeData(this.data.data3)
        chart4.changeData(this.data.data4)
        this.data.statisticsType = "day"
        break
      case 1:
        chart2.changeData(this.data.data3)
        chart3.changeData(this.data.data2)
        chart4.changeData(this.data.data4)
        this.data.statisticsType = "week"
        break
      case 2:
        chart2.changeData(this.data.data4)
        chart3.changeData(this.data.data3)
        chart4.changeData(this.data.data2)
        this.data.statisticsType = "month"
        break
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})



function initChart1(canvas, width, height, F2) {
  const data = [{
    "country": "",
    "value": 10,
    "year": '05-01'
  }, {
    "country": "",
    "value": 12,
    "year": '05-02'
  }, {
    "country": "",
    "value": 15,
    "year": '05-03'
  }, {
    "country": "",
    "value": 17,
    "year": '05-04'
  }, {
    "country": "",
    "value": 21,
    "year": '05-05'
  }, {
    "country": "",
    "value": 11,
    "year": '05-06'
  }, {
    "country": "",
    "value": 30,
    "year": '05-07'
  }, {
    "country": "",
    "value": 50,
    "year": '05-08'
  }];
  chart2 = new F2.Chart({
    el: canvas,
    width,
    height
  });


  chart2.source(data);
  chart2.source(data, {
    type: 'year',
    tickCount: 4
  });

  chart2.axis('value', {
    label(text) {
      return {
        text: text
      };
    }
  });
  // tooltip 与图例结合
  chart2.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart2.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart2.get('legendController').legends.top[0];
      legend.setItems(chart2.getLegendItems().country);
    }
  });
  chart2.area().position('year*value').shape('smooth');
  chart2.line().position('year*value').shape('smooth');
  chart2.render();
  return chart2;
}


function initChart2(canvas, width, height, F2) {
  const data = [{
    "country": "",
    "value": 50,
    "year": '05-01'
  }, {
    "country": "",
    "value": 22,
    "year": '05-02'
  }, {
    "country": "",
    "value": 35,
    "year": '05-03'
  }, {
    "country": "",
    "value": 17,
    "year": '05-04'
  }, {
    "country": "",
    "value": 44,
    "year": '05-05'
  }, {
    "country": "",
    "value": 11,
    "year": '05-06'
  }, {
    "country": "",
    "value": 30,
    "year": '05-07'
  }, {
    "country": "",
    "value": 50,
    "year": '05-08'
  }];
  chart3 = new F2.Chart({
    el: canvas,
    width,
    height
  });


  chart3.source(data);
  chart3.source(data, {
    type: 'year',
    tickCount: 4
  });

  chart3.axis('value', {
    label(text) {
      return {
        text: text
      };
    }
  });
  // tooltip 与图例结合
  chart3.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart3.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart3.get('legendController').legends.top[0];
      legend.setItems(chart3.getLegendItems().country);
    }
  });
  chart3.area().position('year*value').shape('smooth');
  chart3.line().position('year*value').shape('smooth');
  chart3.render();
  return chart3;
}

function initChart3(canvas, width, height, F2) {
  const data = [{
    "country": "",
    "value": 80,
    "year": '05-01'
  }, {
    "country": "",
    "value": 47,
    "year": '05-02'
  }, {
    "country": "",
    "value": 15,
    "year": '05-03'
  }, {
    "country": "",
    "value": 57,
    "year": '05-04'
  }, {
    "country": "",
    "value": 43,
    "year": '05-05'
  }, {
    "country": "",
    "value": 34,
    "year": '05-06'
  }, {
    "country": "",
    "value": 30,
    "year": '05-07'
  }, {
    "country": "",
    "value": 50,
    "year": '05-08'
  }];
  chart4 = new F2.Chart({
    el: canvas,
    width,
    height
  });


  chart4.source(data);
  chart4.source(data, {
    type: 'year',
    tickCount: 4
  });

  chart4.axis('value', {
    label(text) {
      return {
        text: text
      };
    }
  });
  // tooltip 与图例结合
  chart4.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart4.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart4.get('legendController').legends.top[0];
      legend.setItems(chart4.getLegendItems().country);
    }
  });
  chart4.area().position('year*value').shape('smooth');
  chart4.line().position('year*value').shape('smooth');
  chart4.render();
  return chart4;
}




function initChart4(canvas, width, height, F2) {
  const data = [{
    "country": "",
    "value": 80,
    "year": '05-01'
  }, {
    "country": "",
    "value": 47,
    "year": '05-02'
  }, {
    "country": "",
    "value": 15,
    "year": '05-03'
  }, {
    "country": "",
    "value": 57,
    "year": '05-04'
  }, {
    "country": "",
    "value": 43,
    "year": '05-05'
  }, {
    "country": "",
    "value": 34,
    "year": '05-06'
  }, {
    "country": "",
    "value": 30,
    "year": '05-07'
  }, {
    "country": "",
    "value": 50,
    "year": '05-08'
  }];
  chart5 = new F2.Chart({
    el: canvas,
    width,
    height
  });


  chart5.source(data);
  chart5.source(data, {
    type: 'year',
    tickCount: 4
  });

  chart5.axis('value', {
    label(text) {
      return {
        text: text
      };
    }
  });
  // tooltip 与图例结合
  chart5.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart5.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart5.get('legendController').legends.top[0];
      legend.setItems(chart5.getLegendItems().country);
    }
  });
  chart5.area().position('year*value').shape('smooth');
  chart5.line().position('year*value').shape('smooth');
  chart5.render();
  return chart5;
  
}



