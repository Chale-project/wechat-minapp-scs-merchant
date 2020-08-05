var urlApi = require('../../../utils/util.js')
var rootUrls = require('../../../utils/rootUrl.js')
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
let chart = null;
let chart2 = null;
let chart3 = null;
let that = this;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    },
    opts2: {
      onInit: initChart2
    },

    classifySalesData: [{
      "name": "饼干",
      "saleNum": "100",
      "payMoney": "120.50"
    }, {
      "name": "饼干",
      "saleNum": "90",
      "payMoney": "110.50"
    }, {
      "name": "饼干",
      "saleNum": "80",
      "payMoney": "100.50"
    }, {
      "name": "饼干",
      "saleNum": "70",
      "payMoney": "90.50"
    }, {
      "name": "饼干",
      "saleNum": "60",
      "payMoney": "80.50"
    }],
    productSalesData: [{
      "name": "脉动",
      "browseCount": "180",
      "saleNum": "100",
      "payMoney": "120.50",
      "ConversionRate": "55%"
    }, {
      "name": "辣条",
      "browseCount": "180",
      "saleNum": "90",
      "payMoney": "120.50",
      "ConversionRate": "55%"
    }, {
      "name": "黄鹤楼1919",
      "browseCount": "180",
      "saleNum": "80",
      "payMoney": "120.50",
      "ConversionRate": "55%"
    }, {
      "name": "红星二锅头",
      "browseCount": "180",
      "saleNum": "70",
      "payMoney": "120.50",
      "ConversionRate": "55%"
    }, {
      "name": "饼干",
      "browseCount": "180",
      "saleNum": "60",
      "payMoney": "120.50",
      "ConversionRate": "55%"
    }],
    data: [{
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
    }, {
      "country": "",
      "value": 11,
      "year": '05-09'
    }, {
      "country": "",
      "value": 30,
      "year": '05-10'
    }],
    tab1: false,
    tab2: false,
    tab3: true,
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    index: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  onChange(event) {
    switch (event.detail.index) {
      case 0:
        this.setData({
          tab1: false,
          tab2: false,
          tab3: true,
          tab4: false
        })
        break
      case 1:
        this.setData({
          tab1: true,
          tab2: true,
          tab3: true,
          tab4: false
        })
        break
      case 2:
        this.setData({
          tab1: true,
          tab2: true,
          tab3: false,
          tab4:true
        })
        break
    }

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



function initChart(canvas, width, height, F2) {
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
  }, {
    "country": "",
    "value": 11,
    "year": '05-09'
  }, {
    "country": "",
    "value": 30,
    "year": '05-10'
  }]
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });


  chart.source(data);

  chart.axis('value', {
    labelOffset: 20,
    label(text) {
      return {
        text: text
      };
    }
  });
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });
  chart.area().position('year*value');
  chart.line().position('year*value');

  chart.render();
  return chart;
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
  chart3.area().position('year*value');
  chart3.line().position('year*value');
  chart3.render();
  return chart3;
}