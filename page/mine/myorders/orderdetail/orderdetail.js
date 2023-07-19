var md5Encrypt = require('../../../../util/md5/md5.js');
let app = getApp()
Page({
  data: {
    appInfo:getApp(),
    orderDetail: {},
    imgUrl: "",
    statusImg: "", //状态对应图标
    statusName: "", //状态名字
    statusDes: "", //状态描述
    phone_secret: "", //隐秘后的手机号
    user_phone: "", //手机号
    order_id: "", //订单号
    express: "",//快递公司名称
    exp_number: "",//快递单号
    depositState: "", //-1不免，0半免，1全免
    shadowAnimation: [], //动画-背景
    layerAnimation: [], //动画-弹出层
    freePaymentHidden: true, //免密支付弹出层
    authorizedHidden: true, //支付宝资金授权弹出层
    cancelOrderHidden: true, //取消订单弹出层
    frozenHidden: true,//冻结押金弹出层
    clickindex: -1,
    choosedReason: "", //选择的取消原因
    cancelReason: [
      {
        cho: 0,
        value: '想要重新下单',
        img: '/image/confirm-order-circle.png',
      }, {
        cho: 0,
        value: '商品价格较贵',
        img: '/image/confirm-order-circle.png',
      }, {
        cho: 0,
        value: '等待时间较长',
        img: '/image/confirm-order-circle.png',
      }, {
        cho: 0,
        value: '是想了解流程',
        img: '/image/confirm-order-circle.png',
      }, {
        cho: 0,
        value: '不想要了',
        img: '/image/confirm-order-circle.png',
      }
    ],
    form_id: "",
    ismoveMenuBtn: false,
    isloadorderDetail: false,//是否调用
    kefuisShow: false,//客服弹框
    //1023添加
    newuid:0,
    sesame_exclusive_discount_amount: '', // 专享优惠
    is_exclusive_discounts: true // 是否显示专享优惠
  },

  //显示弹出层背景
  showShadow() {
    var animation = my.createAnimation({
      duration: 150,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });

    this.shadowAnim = animation;

    animation.opacity(1).step();
    this.setData({
      shadowAnimation: animation.export(),
    });
  },
  // 隐藏弹出层背景
  hideShadow() {
    this.shadowAnim.opacity(0).step();
    this.setData({
      shadowAnimation: this.shadowAnim.export(),
    });
  },
  // 显示弹出层
  showLayer() {
    var animation = my.createAnimation({
      duration: 150,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.layerAnim = animation;
    animation.opacity(1).scale(1).step();
    this.setData({
      layerAnimation: animation.export(),
    });
  },
  // 隐藏弹出层
  hideLayer() {
    this.layerAnim.scale(.8).opacity(0).step();
    this.setData({
      layerAnimation: this.layerAnim.export(),
    });
  },
  ///////////////////////////////////////////
  //打开弹出层
  showPanel(e) {
    if (e.currentTarget.dataset.origin == "freePayment") {
      this.setData({
        freePaymentHidden: !this.data.freePaymentHidden,
      });
    } else if (e.currentTarget.dataset.origin == "authorized") {
      this.setData({
        authorizedHidden: !this.data.authorizedHidden,

      });
    } else if (e.currentTarget.dataset.origin == "cancelOrder") {
      this.setData({
        cancelOrderHidden: !this.data.cancelOrderHidden,
        form_id: e.detail.formId
      });
    } else if (e.currentTarget.dataset.origin == "frozen") {
      this.setData({
        frozenHidden: !this.data.frozenHidden,
        form_id: e.detail.formId
      });
    }


    this.showShadow();
    this.showLayer();
  },

  //关闭弹出层
  hidePanel(e) {
    this.hideShadow();
    this.hideLayer();

    this.setData({
      freePaymentHidden: true,
      authorizedHidden: true,
      cancelOrderHidden: true,
      frozenHidden: true,
    });
  },

  //获取订单详情
  getDetail(action) {
      var obj = this;
    console.log(this)
    var app = getApp();

    obj.setData({
      isloadorderDetail: true
    })
    var orderDetailParam = {
      version: app.globalData.version,
      device: app.globalData.device,
      signType: app.globalData.signType,
      order_id: obj.data.order_id,
    }
    var orderDetailStr = md5Encrypt.md5(orderDetailParam);

    //请求数据
    //console.log('请求数据');
    console.log(orderDetailParam)
    // console.log(orderDetailStr)
    my.request({
      url: app.globalData.testUrl + '/Api/order/orderDetail',
      method: 'POST',
      data: {
        order_id: obj.data.order_id
      },
      dataType: 'json',
      success: function (res) {
        console.log('订单信息', res);
        if (res.data.status == '1001') {
         
          var user_phone = res.data.data.receiver_phone;
          var phone_secret = "";
          if (user_phone && user_phone != "") {
            phone_secret = user_phone.replace(user_phone.substr(3, 4), '****');
          }
          let { sesame_exclusive_discount_amount } = res.data.data
          obj.setData({
            orderDetail: res.data.data,
            statusName: res.data.data.order_status_name,
            statusDes: res.data.data.order_ms,
            phone_secret: phone_secret,
            user_phone: user_phone,
            exp_number: res.data.data.exp_number,
            express: res.data.data.express,
            sesame_exclusive_discount_amount,
            is_exclusive_discounts: Boolean(sesame_exclusive_discount_amount)
          });

        }
        if (res.data.status === "1002") {

          my.showToast({
            type: "none",
            content: res.data.msg,
            success:()=>{
              my.navigateBack()
            }
          })
        }
        if (action == "load") {
          my.hideLoading(); //加载结束
        } else if (action == "pulldown") {
          my.stopPullDownRefresh();  //停止刷新
        }
      },
      complete: function (res) {
        if (action == "load") {
          my.hideLoading(); //加载结束
        } else if (action == "pulldown") {
          my.stopPullDownRefresh();  //停止刷新
        }
      }
    });
      
    

    
  },

  //复制快递单号
  copyNum(e) {
    my.setClipboard({
      text: e.currentTarget.dataset.delivery,
      success: function (e) {
        my.showToast({
          type: 'none',
          content: '复制成功',
          duration: 1200,
          success: () => {
          },
        });
      }
    });
  },

  // 选择取消原因
  choCancelReason(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      choosedReason: this.data.cancelReason[index].value,
      clickindex: index,
    })
  },

  // “再考虑下”
  closeCancelReason() {
    this.hideShadow();
    this.hideLayer();

    this.setData({
      choosedReason: "",
      clickindex: -1,
      freePaymentHidden: true,
      authorizedHidden: true,
      cancelOrderHidden: true
    });
  },

  // 提交取消原因
  sureToCancel(e) {
    var obj = this;
    var app = getApp();

    if (this.data.choosedReason == '') {
      my.showToast({
        type: 'none',
        content: '请选择取消原因',
        duration: 1200,
        success: () => {
        },
      });
    } else {
      //加载动画
      my.showLoading({
        content: '加载中...',
        delay: 0,
      });

      my.request({
        url: app.globalData.testUrl + '/Api/order/OrderCancel',
        method: 'POST',
        data: {
          order_id: obj.data.orderDetail.order_id,
          order_remarks: obj.data.choosedReason
        },
        dataType: 'json',
        success: function (res) {
          console.log(res)
          my.hideLoading(); //加载结束

          if (res.data.status == "1001") {
            my.showToast({
              type: 'success',
              content: '取消成功',
              duration: 1200,
              success: function () {
                //刷新数据
                obj.getDetail("refresh");
              }
            });
          } else {
            my.showToast({
              type: 'none',
              content: '操作失败',
              duration: 1200,
            });
          }
        },
        fail: function (res) {
          my.showToast({
            type: 'none',
            content: '操作失败',
            duration: 1200,
          });
        },
        complete: function (res) {
          my.hideLoading(); //加载结束

          obj.hideShadow();
          obj.hideLayer();

          obj.setData({
            freePaymentHidden: true,
            authorizedHidden: true,
            cancelOrderHidden: true
          });
        }
      })
    }
  },

  //确认收货
  confirmReceipt() {
    var obj = this;
    var app = getApp();
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var receiptParam = {
      version: app.globalData.version,
      device: app.globalData.device,
      signType: app.globalData.signType,
      order_id: obj.data.orderDetail.order_id,
    }
    var receiptStr = md5Encrypt.md5(receiptParam);

    my.request({
      url: app.globalData.testUrl + '/Order/orderConfirm',
      method: 'POST',
      data: {
        version: app.globalData.version,
        device: app.globalData.device,
        signType: app.globalData.signType,
        order_id: obj.data.orderDetail.order_id,
        token: receiptStr,
      },
      dataType: 'json',
      success: function (res) {
        // console.log(res.data);

        if (res.data.status == '1001') {
          obj.setData({
            statusName: res.data.data.order_status_name,
            statusDes: res.data.data.order_status_ms,
            statusImg: '/image/orderdetail-using.png'
          })
          my.showToast({
            type: 'success',
            content: '收货成功',
            duration: 1200,
            success: function () {
              //刷新数据
              obj.getDetail("refresh");
            }
          });
        } else if (res.data.status == '1002') {
          my.showToast({
            type: 'none',
            content: res.data.data.order_status_ms,
            duration: 1200,
          });
        } else {
          my.showToast({
            type: 'none',
            content: '操作失败',
            duration: 1200,
          });
        }
      },
      complete: function (res) {
        my.hideLoading(); //加载结束
      }
    });
  },


  // 查看订单
  toMyOrders() {
    my.navigateTo({
      url: '../myorders?id=1&status=1'
    });
  },
  contract() {//下载查看合同
    let vm = this;
    var app = getApp();
    if (my.canIUse("openDocument")) {
      my.showLoading({
        content: '加载中...'
      });
      my.request({
        url: app.globalData.testUrl + '/Api/order/GetContract',
        method: 'POST',
        data: {
          order_id: vm.data.orderDetail.order_id
        },
        dataType: 'json',
        success: function (res) {
          console.log("获取电子合同", res)
          my.downloadFile({
            url: res.data.data.contract_url,
            success({ apFilePath }) {
              my.openDocument({
                filePath: apFilePath,
                fileType: 'pdf',
                success: (res) => {
                  console.log('open document success')
                }
              })
            }
          })
        },
        complete: function (res) {
          my.hideLoading(); //加载结束
        }
      });
    } else {
      my.showToast({
        type: 'none',
        content: '当前版本不支持此功能，请更新支付宝后查看',
        duration: 500,
        success: () => {

        },
      });
    }







  },
  // 查看账单
  toBill() {
    my.navigateTo({
      url: '../../mybill/mybill?order_id=' + this.data.orderDetail.order_id,
    });
  },

  onLoad(query) {
// 如果是从外链跳转的
    if(my.getStorageSync({ key: 'isOtherApp'}).data=="isOtherApp"){
        console.log('订单号为:',query.order_id)
        // this.setData({
        //   order_id:
        // })
        app.getUserInfo((res2)=>{
        app.globalData.user_id = res2.user_id
        console.log('user是:',app.globalData.user_id)
        console.log( 'order_id是',query.order_id)
        //加载动画
        my.showLoading({
          content: '加载中...',
          delay: 0,
        });
        if (query.order_id) {
          var order_id = query.order_id; //订单号
        } else {
          var order_id = app.globalData.order_id;
        }

        this.setData({
          order_id: order_id,
          imgUrl: app.globalData.imgUrl
        })

        //获取订单详情
        this.getDetail("load"); 
        my.removeStorageSync({
          key: 'isOtherApp'
        });
       
        return
      })
    }
    console.log( query.order_id)
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    if (query.order_id) {
      var order_id = query.order_id; //订单号
    } else {
      var order_id = app.globalData.order_id;
    }

    this.setData({
      order_id: order_id,
      imgUrl: app.globalData.imgUrl
    })

    //获取订单详情
    this.getDetail("load");
  },
  onShow() {
    if (this.data.order_id != "" && this.data.isloadorderDetail) {
      // this.getDetail("load");
    }
  },
  md(e){
    let order_id = e.currentTarget.dataset.orderId;
    my.redirectTo({
      url:"../../rent/confirm-order/confirm-order?orderid="+order_id
    });
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getDetail("pulldown");
  },
  onReady() {
    this.animation = my.createAnimation({

      duration: 200,

    })
  },
  moveMenu(e) {//点击更多按钮
    console.log(e);
    let vm = this;
    let _movegoodid = e.currentTarget.dataset.id;


    if (!vm.data.ismoveMenuBtn) {

      this.animation.rotate(0).step()
      this.setData({ animation: this.animation.export() })

    } else {
      this.animation.rotate(180).step()
      this.setData({ animation: this.animation.export() })
    }


    vm.setData({
      ismoveMenuBtn: !vm.data.ismoveMenuBtn
    })

  },
  onItemXuZu() {
    my.navigateTo({
      url: "../renewal/renewal?order_id=" + this.data.orderDetail.order_id
    })
  },
  onItemGuiHuan() {
    my.navigateTo({
      url: "../returngoods/returngoods?order_id=" + this.data.orderDetail.order_id + "&typeindex=3"
    })
  },
  onItemYiGuiHuan() {
    my.navigateTo({
      url: "../returngoods/returngoods?order_id=" + this.data.orderDetail.order_id + "&isGuiHuan=false"
    })
  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: "../../../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.goods_id
    })
  },
  goExpress() {
    my.navigateTo({
      url: "../express/express?order_id=" + this.data.orderDetail.order_id
    })
  },
  closekefu() {
    this.setData({
      kefuisShow: false
    })
  },
  showkefu() {
    this.setData({
      kefuisShow: true
    })
  },
  shangJiaPhone() {//商家客服
    my.makePhoneCall({
      number: this.data.orderDetail.mer_phone,
    });
  },
  pingTaiPhone() {//平台客服
    let app = getApp();
    my.makePhoneCall({
      number: app.globalData.pre_sale_phone,
    });
  },
   payment(e) {//立即付款
     app.getUserInfo( (res1) => {
     app.globalData.user_id = res1.user_id
     console.log(app.globalData.user_id)
     my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    console.log(app)
    console.log(e)
    let vm = this;
    let _order_id = e.currentTarget.dataset.orderId;
    console.log(_order_id,'_order_id_order_id')
    if(!_order_id){
      return
      console.log(JSON.stringify(e.currentTarget.dataset.orderId))
      
    }
    // my.showToast({
    //   content:JSON.stringify(e),
    //    duration: 1000,
    // })
    let submitParam = {
      userName:e.currentTarget.dataset.userName,
      userIdCard:e.currentTarget.dataset.userIdCard,
      order_id:_order_id
    }
    // my.showToast({
    //   content:JSON.stringify(submitParam),
    //    duration: 1000,
    // })
    // debugger
    my.request({
      url: app.globalData.testUrl + '/Api/order/NopayFreeze',
      method: 'POST',
      cache: false,
      data: {
        order_id: _order_id,
        zm_user_id: app.globalData.user_id
        // zm_user_id:res1.user_id
      },
      success: (res) => {
        console.log("立即付款(订单列表)", res);
        //  return;
        if (res.data.status == '1001') {

          let _orderStr = res.data.data.orderStr;
          let _signStr = res.data.data.signStr;   //好像一直是空的，可能是bug的原因
          // let n_order_id = _order_id;
          let n_order_id = res.data.data.order_id;



          console.log(n_order_id)
          let _data = {
            order_id: n_order_id, //订单号
            status: "SUCCESS", //下单状态 
            zm_user_id: app.globalData.user_id,
            // zm_user_id:res1.user_id
          }
          console.log('订单号：',n_order_id)
          console.log('预授权订单号:',_orderStr)
          if (_orderStr) {//是否有预授权订单号
            //  console.log('预授权订单号:',_orderStr)
            vm.licensing(_orderStr, function (d) {//调用预授权
              console.log('d是',d)
              if (d) {//预授权返回参数
                _data.auth_no = d.auth_no;//预授权订单号
                _data.credit_amount = d.credit_amount;//免押金额
                console.log('获取到预授权返回的参数了,然后_signStr是什么',_signStr)
                
                if (_signStr || true) {
                  if(res.data.data.is_auth===1 || true){

                    console.log('订单同步接口_data:',_data)
                    vm.data.order_id = _data.order_id
                    vm.isUseAuth(submitParam,_data)
                    // vm.orderSuccess(_data, function () {//调用订单状态同步接口 })
                  }else{
                    vm.isUseAuth(submitParam,_data)
                  }
                }
              } else {
                my.hideLoading();
                my.showToast({
                  type: 'none',
                  content: '支付失败~',
                  duration: 1000,
                  success: () => {
                    // vm.orderList('click');
                    vm.data.order_id = n_order_id
                    vm.getDetail("load")
                  }
                });
              }
            })
          } else {//预授权已经签约  
            if (_signStr!==undefined) {//仅签约商户代扣
              console.log('_signStr',_signStr)
              if(res.data.data.is_auth===1){
                vm.orderSuccess(_data, function () {//调用订单状态同步接口

                })
              }else{
                //如果用户之前已经预授权过了，然后过来点了继续下单，那么就根据他点击的进入的订单号来传递就好了
                let _data = {
                      order_id:e.currentTarget.dataset.orderId, //点击的时候获取的订单号
                      status: "SUCCESS", //下单状态 
                      zm_user_id: app.globalData.user_id,
                      // zm_user_id:res1.user_id
                    }
                vm.isUseAuth(submitParam,_data)
              }
          
            }
          }

        }
      }, complete: function (res) {
        console.log('失败了吗',res)

      }

    });
    });
    
    
  },
  licensing(_str, callback) {//预授权
    let vm = this;
    my.tradePay({
      // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
      orderStr: _str,
      success: (res) => {
        //console.log("预授权返回结果",res);
        my.hideLoading(); //加载结束
        let _code = res.resultCode;
        if (_code == "9000") {//成功
          let _auth_no = JSON.parse(res.result).alipay_fund_auth_order_app_freeze_response.auth_no;
          let _credit_amount = JSON.parse(res.result).alipay_fund_auth_order_app_freeze_response.credit_amount;
          callback({
            auth_no: _auth_no,
            credit_amount: _credit_amount
          })
        } else {
          my.hideLoading();
          // vm.orderList('click');
          callback(false)
        }
      }
    })
  },
  withhold(_str, callback) {//商户代扣
    let vm = this;
    if(my.canIUse("paySignCenter")){
      my.paySignCenter({
        signStr: _str,
        success: (res) => {
          //console.log("代扣返回参数",res)
          if (res.resultStatus == "7000") {//协议签约成功
            let _agreement_no = JSON.parse(res.result).alipay_user_agreement_page_sign_response.agreement_no
            callback({
              agreement_no: _agreement_no
            })
          } else {
            my.hideLoading();
            vm.orderList('click');
            callback(false)
          }
        }
      });
    }else{
        my.hideLoading();
    }
  },
  isUseAuth(submitParam,_data){
    let obj = this;
    my.getStorage({
      key: 'firstFaceauth',
      success: function(res) {
        console.log('763',res)
        if (res.data) {//第一次进行人脸识别
          obj.orderSuccess(_data, function () {//调用订单状态同步接口

          })
        } else {
          obj.authentication(submitParam,_data)//调用人脸识别
        }
      },
      fail: function(res){
        obj.authentication(submitParam,_data)//调用人脸识别
      }
    });
  },
   authentication(submitParam,_data) {//认证
    console.log("认证",submitParam,"数据:",_data)
    let app = getApp();
    let vm = this;
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    my.request({
      url: app.globalData.testUrl + '/Api/user/Faceauth',
      method: 'POST',
      data: {
        user_name: submitParam.userName,
        user_idcard: submitParam.userIdCard
      },
      dataType: 'json',
      success: (res1) => {
       
        // let _info = res.data.data;
        if (res1.data.status === '1001') {
          /**
              * 唤起认证流程
              * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
              * 详细说明可查看文档下方的参数说明
          **/
          console.log('成功', res1.data);
        // my.showToast({
        //   content:res1.data
        // })
        // return
         console.log("唤起人脸识别")
          my.startAPVerify({
              url: res1.data.data.certify_url,
              certifyId: res1.data.data.certify_id,
              success: res => {
                console.log('837',res)
                my.hideLoading(); //加载结束
                // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
                if (res.resultStatus === "9000") {
                  vm.orderSuccess(_data, function () {//调用订单状态同步接口
                    console.log('当前的订单号是',vm.data.order_id)
                      vm.getDetail("load")
                  })
                } else {
                  my.showToast({
                    content: res.resultStatus === "6001" ? "需要进行实名认证哦" : '实名认证失败！',
                    // content:res.data,
                  })
                  my.hideLoading();
                  // vm.orderList('click');
              }
            }
          })
        }
      },
      fail: (res) => {
        my.hideLoading(); //加载结束
        console.log('失败', res.data);
        // vm.orderList('click');
      }, complete: () => {

      }
    });

  },
  orderSuccess(_data, callback) {//订单结果
    console.log('同步订单结果的_data:',_data)
    // my.showToast({
    //   content:'同步订单结果的_data:'+_data,
    //   duration: 1000,
    // })
   
    let vm = this;
    my.request({
      url: app.globalData.testUrl + '/Api/order/OrderSuccess',
      method: 'POST',
      data: _data,
      dataType: 'json',
      success: function (res) {
        if (res.data.status == "1001") {
          my.showToast({
            type: 'none',
            content: '支付成功~',
            duration: 1000,
            success: () => {
              callback(true)
              // vm.orderList('click');
            }
          });
        } else {
          my.hideLoading();
          my.showToast({
            type: 'none',
            content: '系统繁忙请重试~',
            duration: 1000,
            success: () => {
            }
          });
        }
      },
      complete: function (res) {
        // console.log(res);
        my.hideLoading();

      }
    })
  }
});
