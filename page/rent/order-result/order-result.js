var md5Encrypt = require('../../../util/md5/md5.js');

Page({
  data: {
    imgUrl: '',
    orderResult: [],
    depositState: "", //-1不免，0半免，1全免
    errorMsg: '', //失败原因
    checkOrder: 'checkOrder',
    backToOrigin: 'backToOrigin',
    retry: 'retry',
    order_id: '',
    coupon: [],//优惠券列表
    auth_no: '',
    titleBarHeight: 0,//导航栏高度
    showfollow: false,//弹出关注生活号
    order_status: '',
    floating: null,
    agreement_no: '',//商户代扣单号
    activity_banner: "",//轮播图
    customBannerdotsindex: 0,//自定义轮播小点index
    sesame_exclusive_discount_amount: '', // 专享优惠
    is_exclusive_discounts: false // 是否展示专享优惠
  },

  onLoad(option) {
    //加载动画
    // my.showLoading({
    //   content: '加载中...',
    //   delay: 0,
    // });

    var obj = this;
    var app = getApp();
    var testUrl = app.globalData.testUrl;

    let _order_status = option.status;
    // _order_status = "SUCCESS";

    this.setData({
      imgUrl: app.globalData.imgUrl,
      order_id: option.order_id, //商户订单号
      auth_no: option.auth_no,//
      credit_amount: option.credit_amount,//
      agreement_no: option.agreement_no,//
      order_status: _order_status  //订单状态
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
 
    my.request({
      url: testUrl + '/Api/order/OrderSuccess',
      method: 'POST',
      data: {
        order_id: obj.data.order_id, //订单号
        auth_no: obj.data.auth_no, //预授权订单号
        status: obj.data.order_status, //下单状态
        agreement_no: obj.data.agreement_no,//商户代扣单号
        credit_amount: option.credit_amount,//免押金额
        zm_user_id: app.globalData.user_id,
      },
      dataType: 'json',
      success: function (res) {
        console.log('订单结果', res);

        if (res.data.status == "1001") {
          var depositFlag = ""; //押金类型
          var errorMsg = '';

          if (_order_status == 'SUCCESS') {
            res.data.data.imgIcon = '/image/order-success.png';
            res.data.data.titleBar = '下单成功';

            if (my.canIUse('life-follow')) {
              obj.setData({
                showfollow: true
              })
            }
          } else if (_order_status == 'FAIL') {
            res.data.data.imgIcon = '/image/order-fail.png';
            res.data.data.titleBar = '下单失败';
            res.data.data.suc2 = obj.data.errorMsg;
          } else if (_order_status == 'UNKOWN') {
            res.data.data.imgIcon = '/image/order-wait.png';
            res.data.data.titleBar = '等待中';
          }

          if (res.data.data.zm_myj == '0.00') { //不免
            depositFlag = '-1';
          } else if (res.data.data.zm_zyj == res.data.data.zm_myj) { //全免
            depositFlag = '1';
          } else {  //半免
            depositFlag = '0';
          }
          let _orderResult = res.data.data.order;
          _orderResult.status = _order_status;
          const { sesame_exclusive_discount_amount } = res.data.data.order
          obj.setData({
            orderResult: _orderResult,
            depositState: depositFlag,
            sesame_exclusive_discount_amount,
            is_exclusive_discounts: Boolean(sesame_exclusive_discount_amount)
          })

          //设置标题
          my.setNavigationBar({
            title: res.data.data.titleBar,
          });

          if (res.data.data.status == 'SUCCESS') {
            // 生活号推送消息授权

          }
        }
      },
      complete: function (res) {
        // console.log(res);
        my.hideLoading();
      }
    })


    my.request({
      url: app.globalData.testUrl + '/Api/api/EndAc',
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.status == "1001") {

          obj.setData({
            floating: {
              jump_type: res.data.data.jump_type,
              app_id: res.data.data.app_id,
              content_url: res.data.data.content_url,
              telmp_id: res.data.data.telmp_id,
              imgurl: app.globalData.imgUrl + res.data.data.img_uri
            }
          })
        }
      },
      complete: function (res) {
        // console.log(res);
        my.hideLoading();
      }
    })



    // my.request({
    //   url: app.globalData.testUrl + '/Api/api/goodsInfoAd',
    //   method: 'POST',
    //   data: {
    //     goods_id: obj.data.goods_id,
    //   },
    //   success: function (res) {
    //     //console.log('详情页轮播', res);
    //     if (res.data.status == '1001') {
    //       obj.setData({
    //         activity_banner: res.data.data
    //       })
    //     }
    //   }

    // })

    // my.request({
    //   url: app.globalData.testUrl + '/Api/most/orderSuccessCoupon',
    //   method: 'get',
    //   data: {
    //     zm_user_id:app.globalData.user_id
    //   },
    //   success: function (res) {
    //     console.log('优惠券', res);
    //     if (res.data.status == '1001') {
    //       obj.setData({
    //         coupon: res.data.data
    //       })
    //     }
    //   }

    // })
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

  //重试
  retry() {
    var obj = this;
    my.navigateBack({
      delta: 1
    });
    // my.navigateTo({
    //   url: '../confirm-order/confirm-order?order_id=' + obj.data.order_id 
    // });
  },

  jump_tap(e) {
    let vm = this;
    var app = getApp();
    console.log(e);

    let _type = e.currentTarget.dataset.jump_type,//跳转类型
      _app_id = e.currentTarget.dataset.app_id,//appid
      _content_url = e.currentTarget.dataset.content_url,//跳转路径
      _telmp_id = e.currentTarget.dataset.telmp_id;//模板id

    if (_type == 0) {//内部页面跳转

      if (_content_url.indexOf("cate_id") >= 0) {
        my.setStorageSync({
          key: 'cate_id',
          data: {
            cate_id: _content_url.split("=")[1]
          },
          success: function () { }
        });

        my.switchTab({
          url: '../sorts/sorts',
          success: () => {
          }
        })
      } else {

        my.navigateTo({
          url: _content_url// "./goodsdetail/goodsdetail??id=111"
        })
      }

    } else if (_type == 1) {//跳转其他小程序
      my.navigateToMiniProgram({
        appId: _app_id,
        path: _content_url,
        success: (res) => {

        },
        fail: (error) => {
          console.log('跳转失败', error);
        }
      })

    } else if (_type == 2) {//会员有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId,//会员有礼小程序AppID
        extraData: {
          //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
          templateId: _telmp_id,
          //对应模板配置的小程序AppID
          appId: app.globalData.appId
        },
        success: (res) => {
          //跳转成功回调代码
          console.log(res)
        },
        fail: (res) => {
          //跳转失败回调代码
          console.log("领取失败", res)
        }
      })

    } else if (_type == 3 || _type == 6 || _type == 4) {//收藏有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId,
        path: 'pages/index/index?originAppId='+app.globalData.appId+'&newUserTemplate=' + _telmp_id
      });

    }
    else if (_type == 7) {//其他小程序优惠券
      my.navigateToMiniProgram({
        appId: app.globalData.appId,
        // appId为对应模板配置的小程序AppID，
        //templateId为活动进行汇总的模板ID，可以在有礼活动列表中查看
        path: `pages/index/index?originAppId=${_app_id}&newUserTemplate=${_telmp_id}`,
        success: (res) => { },
        fail: (res) => { }
      });
    }

  },
  activitybannerIndex(e) {//自定义轮播小点
    this.setData({
      customBannerdotsindex: e.detail.current  //当前滚动的index
    })
  }
  

});
