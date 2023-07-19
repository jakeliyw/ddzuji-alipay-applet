var md5Encrypt = require('../../../util/md5/md5.js');

Page({
  data: {
    orderResult: {},
    errorMsg: '', //失败原因
    titleBarHeight: 0,//导航栏高度
    customBannerdotsindex: 0,//自定义轮播小点index
  },

  onLoad(option) {
    console.log(JSON.parse(option.orderResult));
    var obj = this;
    var app = getApp();
    this.setData({
      orderResult:JSON.parse(option.orderResult)
    })
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          titleBarHeight: res.titleBarHeight + res.statusBarHeight
        })
      }
    })
    //失败原因
    my.getStorage({
      key: 'order_fail_describe',
      success: function (result) {
        if (result.data) {
          obj.setData({
            errorMsg: result.data.errorMsg,
          });
        }
      }
    });
 

  },

  //查看订单
  checkOrder() {
    let _status = 1;
    console.log(this.data.isxuzu);
    let _idindex = 1;
    if (this.data.isxuzu == "true") {
      _status = 4;
      _idindex = 3;
    } else {
      _status = 1;
      _idindex = 1;
    }
    my.navigateTo({
      url: '../../mine/myorders/myorders?id=' + _idindex + '&status=' + _status
    });
  },

  //返回首页
  backToOrigin() {
    my.switchTab({
      url: '../rent'
    })
  },

});
