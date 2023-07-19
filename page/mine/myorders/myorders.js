var app = new getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    winHeight: 0, // 当前设备的高度
    tabs: [{
        cate_name: '全部订单',
        checked: 'active',
        status: '',
      },
      {
        cate_name: '未完成',
        checked: '',
        status: 99,
      },
      {
        cate_name: '待审核',
        checked: '',
        status: 1,
      },
      {
        cate_name: '待支付',
        checked: '',
        status: 2,
      },
      {
        cate_name: '待发货',
        checked: '',
        status: 3,
      },
      {
        cate_name: '租用中',
        checked: '',
        status: 4,
      },
      {
        cate_name: '待归还',
        checked: '',
        status: 5,
      },
      {
        cate_name: '已完成',
        checked: '',
        status: 6,
      },
      {
        cate_name: '逾期中',
        checked: '',
        status: 7,
      },
      {
        cate_name: '待取消',
        checked: '',
        status: 77,
      },
      {
        cate_name: '订单取消',
        checked: '',
        status: 8,
      },
      {
        cate_name: '审核拒绝',
        checked: '',
        status: 9,
      },
      {
        cate_name: '已买断',
        checked: '',
        status: 12,
      },
    ],
    order_data: [],
    loadData: {
      // 加载更多
      page: 1, // 页码
      pageSize: 4, // 数量
      totalPage: 10,
    },
    showText: false, // 是否显示加载更多的提示
    loadText: '加载中。。。',
    order_status: 0, // 订单状态
    isXuZushow: true, //是否显示续租
    ismoveMenuBtn: false, //popover 显示隐藏
    movegoodid: 0, //点击的商品id
    selectOrder_id: 0, //点击的订单id
    tabscroll_left: 0, //滑动距离
    is_load: false, //是否加载
  },
  // 点击tab栏
  clickTabs(e) {
    let vm = this;
    let index = e.target.dataset.id;
    let tabsData = vm.data.tabs;

    tabsData.forEach((item, index) => {
      item.checked = '';
    });
    tabsData[index].checked = 'active';

    vm.setData({
      tabsId: index,
      order_status: tabsData[index].status,
      tabs: tabsData,
    });

    vm.setData({
      loadText: '',
      loadData: {
        // 加载更多
        page: 1, // 页码
        pageSize: 4, // 数量
        totalPage: 10,
      },
    });
    vm.orderList('click');
  },
  // 跳转到详情
  toDetail(e) {
    var order_id = e.currentTarget.dataset.orderId;
    // console.log(order_id)
    my.navigateTo({
      url: 'orderdetail/orderdetail?order_id=' + order_id,
    });
  },
  onLoad(options) {
    // 如果是从外链跳转过来的就执行
    console.log(my.getStorageSync({
      key: 'isOtherApp'
    }).data);
    if (my.getStorageSync({
        key: 'isOtherApp'
      }).data) {
      app.getUserInfo((res2) => {
        app.globalData.user_id = res2.user_id;
        console.log(app.globalData.user_id);
        console.log('user是:', app.globalData.user_id);

        let vm = this;

        let id = options.id === undefined ? '' : parseInt(options.id);
        // 根据上个页面传递过来的id,判断快递进行到了那个阶段
        let tabs = vm.data.tabs;
        tabs.forEach((item, index) => {
          item.checked = '';
          if (item.status === id) {
            item.checked = 'active';
            vm.setData({
              tabsId: index,
              order_status: id,
            });
          }
        });
        vm.setData({
          tabs: tabs,
        });
        my.createSelectorQuery()
          .select('.scroll-view_H .active')
          .boundingClientRect()
          .exec((ret) => {
            if (ret[0]) {
              vm.setData({
                tabscroll_left: ret[0].left,
              });
            }
          });
        if (app.globalData.user_id != '') {
          this.setData({
            loadText: '',
            loadData: {
              // 加载更多
              page: 1, // 页码
              pageSize: 4, // 数量
              totalPage: 10,
            },
          });

          vm.orderList('click');
        } else {
          app.getAuth_base(function (userid) {
            this.setData({
              loadText: '',
              loadData: {
                // 加载更多
                page: 1, // 页码
                pageSize: 4, // 数量
                totalPage: 10,
              },
            });
            vm.orderList('click');
          });
        }
      });
      my.removeStorageSync({
        key: 'isOtherApp',
      });
      console.log(my.getStorageSync({
        key: 'isOtherApp'
      }).data);
      return;
    }

    console.log('user是:', app.globalData.user_id);

    let vm = this;

    let id = options.id === undefined ? '' : parseInt(options.id);
    // 根据上个页面传递过来的id,判断快递进行到了那个阶段
    let tabs = vm.data.tabs;
    tabs.forEach((item, index) => {
      item.checked = '';
      if (item.status === id) {
        item.checked = 'active';
        vm.setData({
          tabsId: index,
          order_status: id,
        });
      }
    });
    vm.setData({
      tabs: tabs,
    });
    my.createSelectorQuery()
      .select('.scroll-view_H .active')
      .boundingClientRect()
      .exec((ret) => {
        if (ret[0]) {
          vm.setData({
            tabscroll_left: ret[0].left,
          });
        }
      });
    if (app.globalData.user_id != '') {
      this.setData({
        loadText: '',
        loadData: {
          // 加载更多
          page: 1, // 页码
          pageSize: 4, // 数量
          totalPage: 10,
        },
      });

      vm.orderList('click');
    } else {
      app.getAuth_base(function (userid) {
        this.setData({
          loadText: '',
          loadData: {
            // 加载更多
            page: 1, // 页码
            pageSize: 4, // 数量
            totalPage: 10,
          },
        });
        vm.orderList('click');
      });
    }
  },
  onHide() {
    // 页面隐藏
  },
  onShow() {
    // 页面显示
    let vm = this;

    if (vm.data.isLoad) {
      if (app.globalData.user_id != '') {
        this.setData({
          loadText: '',
          loadData: {
            // 加载更多
            page: 1, // 页码
            pageSize: 4, // 数量
            totalPage: 10,
          },
        });
        vm.orderList('click');
      } else {
        app.getAuth_base(function (userid) {
          this.setData({
            loadText: '',
            loadData: {
              // 加载更多
              page: 1, // 页码
              pageSize: 4, // 数量
              totalPage: 10,
            },
          });
          vm.orderList('click');
        });
      }
    }

    this.setData({
      movegoodid: 0,
      ismoveMenuBtn: false, //点击的商品id
      selectOrder_id: 0, //点击的订单id
    });
  },
  // 请求订单列表的数据
  orderList(type) {
    let app = getApp();
    let vm = this;
    let isLoad = false;
    if (type == 'loading') {
      isLoad = true;
    }
    if (type == 'click') {
      vm.setData({
        order_data: [],
      });
    }
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    my.request({
      url: app.globalData.testUrl + '/Api/my/orderList',
      method: 'POST',
      cache: false,
      data: {
        user_id: app.globalData.user_id,
        //user_id: "2088012922006178",
        //phone: 18625988313,//测试
        order_status: vm.data.order_status,
        page: vm.data.loadData.page,
        pageSize: 1000,
      },
      success: (res) => {
        //console.log("订单列表",res);
        if (res.data.status == '1001') {
          my.stopPullDownRefresh(); //关闭下拉刷新
          vm.setData({
            showText: false,
          });
          //	console.log('订单列表',res.data.data);
          let order_data = vm.data.order_data;
          for (var i = 0; i < res.data.data.data.length; i++) {
            order_data.push(res.data.data.data[i]);
          }
          console.log(res.data, 'order_data');
          vm.setData({
            order_data: order_data,
            is_load: true,
          });

          // if (res.data.data) {
          //   if (vm.data.loadData.page < res.data.data.totalPage) {
          //     vm.setData({
          //       loadData: {
          //         page: vm.data.loadData.page + 1,
          //         pageSize: vm.data.loadData.pageSize,
          //         totalPage: res.data.data.totalPage,
          //       }
          //     })
          //   }
          // }
        }
      },
      complete: function (res) {
        my.hideLoading();
      },
    });
  },
  md(e) {
    //买断
    let order_id = '';
    if (e) {
      order_id = e.currentTarget.dataset.orderId;
    } else {
      order_id = this.data.selectOrder_id;
    }
    console.log('跳转订单确认1111');
    my.redirectTo({
      url: '../../rent/confirm-order-copy/confirm-order-copy?orderid=' + order_id,
    });
  },
  // 触底加载更多
  onReachBottom() {
    // let vm = this;
    // if (vm.data.loadData.page < vm.data.loadData.totalPage) {
    //   vm.setData({
    //     loadData: {
    //       page: vm.data.loadData.page + 1,
    //       pageSize: vm.data.loadData.pageSize,
    //       totalPage: vm.data.loadData.totalPage
    //     },
    //     showText: true,
    //     loadText: '加载中~',
    //   })
    //   vm.orderList('loading');
    // } else {
    //   this.setData({
    //     showText: true,
    //     loadText: '没有更多了哦',
    //   })
    // }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      loadText: '',
      loadData: {
        // 加载更多
        page: 1, // 页码
        pageSize: 4, // 数量
        totalPage: 10,
      },
    });
    this.orderList('click');

    //	this.getProductList("pulldown"); //大家都在买
  },
  itemTap1() {
    console.log('52564675123');
  },
  onReady() {
    this.animation = my.createAnimation({
      duration: 200,
    });
  },
  moveMenu(e) {
    //点击更多按钮
    console.log(e);
    let vm = this;
    let _movegoodid = e.currentTarget.dataset.id;

    vm.setData({
      selectOrder_id: e.currentTarget.dataset.orderId,
    });
    if (!vm.data.ismoveMenuBtn) {
      this.animation.rotate(0).step();
      this.setData({
        animation: this.animation.export()
      });
    } else {
      this.animation.rotate(180).step();
      this.setData({
        animation: this.animation.export()
      });
    }

    if (_movegoodid == vm.data.movegoodid) {
      vm.setData({
        ismoveMenuBtn: !vm.data.ismoveMenuBtn,
      });
    } else {
      this.animation.rotate(0).step();
      this.setData({
        animation: this.animation.export()
      });
      vm.setData({
        ismoveMenuBtn: true,
        movegoodid: _movegoodid,
      });
    }
  },
  onItemXuZu() {
    //续租
    my.navigateTo({
      url: 'renewal/renewal?order_id=' + this.data.selectOrder_id,
    });
  },
  onItemGuiHuan() {
    my.navigateTo({
      url: 'returngoods/returngoods?order_id=' +
        this.data.selectOrder_id +
        '&typeindex=2',
    });
  },
  onItemYiGuiHuan(e) {
    my.navigateTo({
      url: 'returngoods/returngoods?order_id=' +
        e.currentTarget.dataset.orderId +
        '&isGuiHuan=false',
    });
  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: '../../rent/goodsdetail/goodsdetail?id=' +
        e.currentTarget.dataset.goods_id,
    });
  },
  goExpress(e) {
    my.navigateTo({
      url: 'express/express?order_id=' + e.currentTarget.dataset.orderId,
    });
  },
  payment(e) {
    console.log(e.currentTarget.dataset);
    //立即付款
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let vm = this;
    let _order_id = e.currentTarget.dataset.orderId;
    let submitParam = {
      userName: e.currentTarget.dataset.userName,
      userIdCard: e.currentTarget.dataset.userIdCard,
      order_id: _order_id,
    };
    my.request({
      url: app.globalData.testUrl + '/Api/order/NopayFreeze',
      method: 'POST',
      cache: false,
      data: {
        order_id: _order_id,
        zm_user_id: app.globalData.user_id,
      },
      success: (res) => {
        console.log('立即付款(订单列表)', res);

        if (res.data.status == '1001') {
          let _orderStr = res.data.data.orderStr,
            _signStr = res.data.data.signStr,
            n_order_id = res.data.data.order_id;

          let _data = {
            order_id: n_order_id, //订单号
            status: 'SUCCESS', //下单状态
            zm_user_id: app.globalData.user_id,
          };
          if (_orderStr) {
            //是否有预授权订单号
            vm.licensing(_orderStr, function (d) {
              //调用预授权
              if (d) {
                //预授权返回参数
                _data.auth_no = d.auth_no; //预授权订单号
                _data.credit_amount = d.credit_amount; //免押金额
                if (_signStr || true) {
                  if (e.currentTarget.dataset.is_skip_face_auth != 1) {
                    console.log('订单同步接口_data:', _data);
                    vm.data.order_id = _data.order_id;
                    console.log(111, _data);
                    vm.isUseAuth(submitParam, _data);
                  } else {
                    vm.orderSuccess(_data, function () {
                      //调用订单状态同步接口
                    });
                    // console.log(222, _data);
                    // vm.isUseAuth(submitParam, _data);
                  }
                }
              } else {
                my.showToast({
                  type: 'none',
                  content: '支付失败~',
                  duration: 1000,
                  success: () => {
                    vm.orderList('click');
                  },
                });
              }
            });
          } else {
            //预授权已经签约
            if (_signStr !== undefined) {
              //仅签约商户代扣
              if (res.data.data.is_auth === 1) {
                vm.orderSuccess(_data, function () {
                  //调用订单状态同步接口
                });
              } else {
                //如果用户之前已经预授权过了，然后过来点了继续下单，那么就根据他点击的进入的订单号来传递就好了
                let _data = {
                  order_id: e.currentTarget.dataset.orderId, //点击的时候获取的订单号
                  status: "SUCCESS", //下单状态 
                  zm_user_id: app.globalData.user_id,
                  // zm_user_id:res1.user_id
                }
                console.log(333, _data);

                vm.isUseAuth(submitParam, _data);
              }
            }
          }
        }
      },
      complete: function (res) {
        my.hideLoading();
      },
    });
  },
  licensing(_str, callback) {
    //预授权
    let vm = this;
    my.tradePay({
      // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
      orderStr: _str,
      success: (res) => {
        //console.log("预授权返回结果",res);
        my.hideLoading(); //加载结束
        let _code = res.resultCode;
        console.log('预授权啊啊啊', res);
        if (_code == '9000') {
          //成功
          let _auth_no = res.result && JSON.parse(res.result)
            .alipay_fund_auth_order_app_freeze_response.auth_no;
          let _credit_amount = res.result && JSON.parse(res.result)
            .alipay_fund_auth_order_app_freeze_response.credit_amount;
          callback({
            auth_no: _auth_no,
            credit_amount: _credit_amount,
          });
        } else {
          my.hideLoading();
          vm.orderList('click');
          callback(false);
        }
      },
    });
  },
  withhold(_str, callback) {
    //商户代扣
    let vm = this;
    if (my.canIUse('paySignCenter')) {
      my.paySignCenter({
        signStr: _str,
        success: (res) => {
          //console.log("代扣返回参数",res)
          if (res.resultStatus == '7000') {
            //协议签约成功
            let _agreement_no = res.result && JSON.parse(res.result)
              .alipay_user_agreement_page_sign_response.agreement_no;
            callback({
              agreement_no: _agreement_no,
            });
          } else {
            my.hideLoading();
            vm.orderList('click');
            callback(false);
          }
        },
      });
    } else {
      my.hideLoading();
    }
  },
  isUseAuth(submitParam, _data) {
    let obj = this;
    my.getStorage({
      key: 'firstFaceauth',
      success: function (res) {
        /** 2023.5.19 必须调用人脸识别 */
        if (res.data && false) {
          //第一次进行人脸识别
          obj.orderSuccess(_data, function () {
            //调用订单状态同步接口
          });
        } else {
          obj.authentication(submitParam, _data); //调用人脸识别
        }
      },
      fail: function (res) {
        obj.authentication(submitParam, _data); //调用人脸识别
      },
    });
  },
  authentication(submitParam, _data) {
    //认证
    //console.log("认证")
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
        user_idcard: submitParam.userIdCard,
      },
      dataType: 'json',
      success: (res) => {
        console.log('成功', res.data);
        // let _info = res.data.data;
        if (res.data.status === '1001') {
          /**
           * 唤起认证流程
           * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
           * 详细说明可查看文档下方的参数说明
           **/
          console.log('唤起人脸识别');
          my.startAPVerify({
            url: res.data.data.certify_url,
            certifyId: res.data.data.certify_id,
            success: (res) => {
              my.hideLoading(); //加载结束
              // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
              if (res.resultStatus === '9000') {
                vm.orderSuccess(_data, function () {
                  //调用订单状态同步接口
                });
              } else {
                my.showToast({
                  content: res.resultStatus === '6001' ?
                    '需要进行实名认证哦' :
                    '实名认证失败！',
                });
                my.hideLoading();
                vm.orderList('click');
              }
            },
          });
        } else {
          // my.hideToast()
          my.hideLoading();
          my.showToast({
            content: '服务繁忙，请稍后重试！'
          })
        }
      },
      fail: (res) => {
        my.hideLoading(); //加载结束
        console.log('失败', res.data);
        vm.orderList('click');
      },
      complete: () => {},
    });
  },
  orderSuccess(_data, callback) {
    console.log('_data_data', _data)
    //订单结果
    let vm = this;
    my.request({
      url: app.globalData.testUrl + '/Api/order/OrderSuccess',
      method: 'POST',
      data: _data,
      dataType: 'json',
      success: function (res) {
        if (res.data.status == '1001') {
          my.showToast({
            type: 'none',
            content: '支付成功~',
            duration: 1000,
            success: () => {
              my.hideLoading();
              vm.orderList('click');
            },
          });
        } else {
          my.hideLoading();
          my.showToast({
            type: 'none',
            content: '系统繁忙请重试~',
            duration: 1000,
            success: () => {},
          });
        }
      },
      complete: function (res) {
        // console.log(res);
      },
    });
  },
});