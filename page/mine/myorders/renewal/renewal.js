Page({
  data: {
    goodsInfo: {},
    imgUrl: "",
    days: [],
    selectDayindex: 0,
    day: 30,//天数
    money: 0,//价格
    order_id: "",//订单号
    goods_rents: [],//天数对应的日租金
    buy_moneys: [],//天数对应的买断金
    attr: []
  },
  onLoad(option) {

    let _order_id = option.order_id;
    let app = getApp();
    let vm = this;
    vm.setData({
      order_id: _order_id
    })
    my.request({
      url: app.globalData.testUrl + '/Api/order/getGoodsTrem',
      method: 'POST',
      data: {
        order_id: _order_id
      },
      dataType: 'json',
      success: function (res) {
        console.log('商品', res)
        if (res.data.status == '1001') {


          let _monthly_rent = parseFloat(res.data.data.goods[0].goods_rent);

          let _day = parseInt(res.data.data.goods[0].lease_period);

          vm.setData({
            imgUrl: app.globalData.imgUrl,
            goodsInfo: res.data.data,
            day: _day,
            money: (parseFloat(_day) * parseFloat(_monthly_rent)).toFixed(2)
          })

        }
      }
    })

  },
  onclickDay(e) {

    let _monthly_rent = parseFloat(e.currentTarget.dataset.value);

    let _day = parseInt(e.currentTarget.dataset.day);
    let _index = e.currentTarget.dataset.index;


    this.setData({
      day: _day,
      selectDayindex: _index,
      money: (parseFloat(_day) * parseFloat(_monthly_rent)).toFixed(2)
    })

  },
  keepOnRent(e) {

    var formId = e.detail.formId; //模板消息formId
    var obj = this;
    var app = getApp();
    let _order_id = obj.data.order_id;
    let _order_info = obj.data.goodsInfo;


    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    my.request({
      url: app.globalData.testUrl + '/Api/order/keepOnRent',
      method: 'POST',
      data: {
        order_id: _order_id,
        lease_period: obj.data.day,
        form_id: formId,// formId用于发送消息模板
      },
      dataType: 'json',
      success: function (res) {
        //console.log("续租", res);
        
        if (res.data.status == '1001') {
          let _orderStr = res.data.data.orderStr,
          _new_order_id=res.data.data.order_id;
          
          /**
           * 唤起认证流程
           * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
           * 详细说明可查看文档下方的参数说明
          **/
         my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            orderStr: _orderStr,
            success: (res1) => {
              my.hideLoading(); //加载结束
              //console.log("支付返回参数", res);

              let _code = res1.resultCode;

              if (_code == "9000") {//成功
                let _auth_no = JSON.parse(res1.result).alipay_fund_auth_order_app_freeze_response.auth_no;
                let _credit_amount = JSON.parse(res1.result).alipay_fund_auth_order_app_freeze_response.credit_amount;
                my.request({
                  url: app.globalData.testUrl + '/Api/order/OrderSuccess',
                  method: 'POST',
                  data: {
                    order_id: _new_order_id, //新订单号
                    auth_no: _auth_no, //预授权订单号
                    status: "SUCCESS", //下单状态 
                    credit_amount: _credit_amount,//免押金额
                    zm_user_id: app.globalData.user_id,
                  },
                  dataType: 'json',
                  success: function (res2) {
                    if (res2.data.status == "1001") {
                      my.showToast({
                        type: 'none',
                        content: '续租成功~',
                        duration: 1000,
                        success: () => {
                          my.navigateTo({
                            url: "../myorders"
                          })
                        }
                      });
                    }
                  },
                  complete: function (res2) {
                    // console.log(res2);
                    my.hideLoading();
                  }
                })
                //续租不需要人脸识别
                // obj.startAPVerify({
                //   certifyId: res.data.data.faceauth.certify_id,
                //   url: res.data.data.faceauth.verify_url
                // }, function (verifyResult) {
                //   //console.log("返回结果", verifyResult)
                //   // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
                //     if (verifyResult.resultStatus === '9000') {
                //       //console.log(res.data.data);
                      
                //     return;
                //   } else if (verifyResult.resultStatus === '6001') {
                //     // 可做下 toast 弱提示
                //     my.showToast({
                //       type: 'none',
                //       content: '需要进行实名认证哦~',
                //       duration: 1000,
                //       success: () => {

                //       }
                //     });
                //     my.hideLoading();
                //   } else {
                //     my.showToast({
                //       type: 'none',
                //       content: '实名认证失败！',
                //       duration: 1000,
                //       success: () => {

                //       }
                //     });
                //     my.hideLoading();
                //     return
                //   }
                //   my.hideLoading();
                // });


              } else if (_code == "6001") {//用户自主取消
                my.showToast({
                  type: 'none',
                  content: '支付失败~',
                  duration: 1000,
                  success: () => {

                  }
                });
              } else {//失败
                my.showToast({
                  type: 'none',
                  content: '支付失败~',
                  duration: 1000,
                  success: () => {

                  }
                });
              }
            },
            fail: (res) => {
              my.showToast({
                type: 'none',
                content: '支付失败~',
                duration: 1000,
                success: () => {

                }
              });
            }
          });
          
        } else if (res.data.status == '1002') {
            
            my.showToast({
                type: 'none',
                content: res.data.msg,
                duration: 1000,
                success: () => {

                }
              });
        }
      },
      complete: function (res) {
        my.hideLoading();
      }
    })

  },
  startAPVerify(options, callback) {//调起人脸识别
    my.call('startBizService', {
      name: 'open-certify',
      param: JSON.stringify(options),
    }, callback);
  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: "../../../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.goods_id
    })
  }


});
