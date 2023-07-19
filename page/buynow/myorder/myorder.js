var app = getApp();
Page({
  data: {
    appInfo:app,
    toview: 'order-list',
    imgUrl: app.globalData.imgUrl,
    winHeight: 0, // 当前设备的高度
    tabs: [{
      cate_name: '全部订单',
      checked: 'active'
    },
    {
      cate_name: '待付款',
      checked: ''
    },
    {
      cate_name: '待发货',
      checked: ''
    },
    {
      cate_name: '待收货',
      checked: ''
    },
    {
      cate_name: '已完成',
      checked: ''
    },
    {
      cate_name: '订单关闭',
      checked: ''
    }],
    order_data: [],
    loadData: { // 加载更多
      page: 1, // 页码
      pageSize: 10, // 数量
      totalPage: '',
      last_page: ''
    },
    order_status: '', // 订单状态
    isXuZushow: true,//是否显示续租
    movegoodid: '', //点击的商品id
    selectOrder_id: '',//点击的订单id
    tabscroll_left: 0,//滑动距离
    userid: '', // 用户id
    cancelModel: false,  // 取消订单弹框，true-显示，false-隐藏
    cancelModelBtns: [{  // 取消订单弹框按钮
      text: '再考虑下',
      extClass: 'cancel'
    }, {
      text: '取消订单',
      extClass: 'btn-payment'
    }],
    items: [
      { name: '地址/电话信息填写错误', value: '地址/电话信息填写错误', checked: true },
      { name: '拍错订单/未使用优惠券', value: '拍错订单/未使用优惠券' },
      { name: '发货太慢', value: '发货太慢' },
      { name: '是想了解流程', value: '是想了解流程' },
      { name: '不想要了', value: '不想要了' }
    ],
    reason: '地址/电话信息填写错误', // 取消订单的原因
    recommend: [], // 爆款推荐商品
    show_toTop_btn: false,
    btn_disabled: false
  },

  onLoad(options) {


    // debugger
    let vm = this;
    let id = parseInt(options.id) || 0;
    let tabs = vm.data.tabs;
    tabs.forEach((item, index) => {
      item.checked = '';
    })
    tabs[options.id].checked = 'active';
    vm.setData({
      tabs: tabs,
      order_status: id
    })
    my.createSelectorQuery().select('.scroll-view_H .active').boundingClientRect().exec((ret) => {
      if (ret[0]) {
        vm.setData({
          tabscroll_left: ret[0].left
        })
      }
    })
    // 缓存userid
    let userid = my.getStorageSync({ key: 'zm_user_id' }).data;
    if (userid) {
      vm.setData({
        userid: userid
      })
      vm.orderList('click', userid);
    } else {
      getUserId().then(function (res) {
        vm.setData({
          userid: res
        })
        my.setStorageSync({
          key: 'zm_user_id',
          value: res
        });
        vm.orderList('click', res);
      })
    }

    function getUserId() {
      const getuserid = new Promise(function (resolve, reject) {
        app.getAuth_base(function (userid) {
          resolve(userid)
        });
      })
      return getuserid;
    }
  },
  onPullDownRefresh() {
    this.orderList('click');
  },
  // 点击tab栏
  clickTabs(e) {
    let vm = this;
    let index = e.target.dataset.id;
    let tabsData = vm.data.tabs;

    tabsData.forEach((item, index) => {
      item.checked = '';
    })
    tabsData[index].checked = 'active';

    vm.setData({
      tabsId: index,
      order_status: index,
      tabs: tabsData,
      loadData: {
        page: 1,
        totalPage: ''
      }
    })
    vm.orderList('click', vm.data.userid);
  },
  // 跳转到详情
  orderDetail(e) {
    const { target: { dataset } } = e
    my.navigateTo({
      url: '../order-status/status?order_id=' + dataset.orderid + '&goods_id=' + dataset.goodsid + '&entry=' + dataset.entry
    })
  },
  // 请求订单列表的数据
  orderList(type, userid) {
    let app = getApp();
    let vm = this;
    let isLoad = false;
    if (type == 'loading') {
      isLoad = true;
    }
    if (type == 'click') {
      vm.setData({
        order_data: []
      })
    }
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    my.request({
      url: app.globalData.testUrl + '/Api/hidden/orderList',
      method: 'POST',
      cache: false,
      data: {
        zm_user_id: userid,
        order_status: vm.data.order_status,
        page: vm.data.loadData.page,
        pageSize: vm.data.loadData.pageSize
      },
      success: (res) => {
        let data = res.data.data;
        if (res.data.status == '1001') {
          my.stopPullDownRefresh();//关闭下拉刷新
          my.hideLoading();
          let order_data = vm.data.order_data;
          for (var i = 0; i < data.data.data.length; i++) {
            order_data.push(data.data.data[i]);
          }
          let goods = []; // 热门推荐
          data.goods.forEach((item) => {
            item.entry = '3';
            goods.push(item);
          })
          vm.setData({
            order_data: order_data,
            recommend: goods,
            loadData: {
              page: data.data.current_page,
              totalPage: data.data.total,
              last_page: data.data.last_page
            }
          })
        }
      }, complete: function (res) {
        my.hideLoading();
      }
    });
  },

  // 触底加载更多
  onReachBottom() {
    let vm = this;
    if ((vm.data.loadData.page + 1) <= vm.data.loadData.last_page) {
      vm.setData({
        loadData: {
          page: vm.data.loadData.page + 1
        }
      })
      vm.orderList('loading', vm.data.userid);
    }
  },

  onReady() {
    this.animation = my.createAnimation({
      duration: 200,
    })
  },

  // 查看物流
  goExpress(e) {
    my.navigateTo({
      url: "../../mine/myorders/express/express?order_id=" + e.currentTarget.dataset.orderId + '&userid=' + this.data.userid
    })
  },

  //立即付款
  payment(e) {
    let vm = this;
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    // 禁止点击支付按钮，防止用户多次触发
    vm.setData({
      btn_disabled: true
    })
    // 获取阿里用户基础信息
    app.getUserInfo((res) => {
      if (!res) {
        my.hideLoading();
        return;
      }
      let _order_id = e.currentTarget.dataset.orderId;
      let entry = e.currentTarget.dataset.entry;
      my.request({
        url: app.globalData.testUrl + '/Api/hidden/orderPay',
        method: 'post',
        cache: false,
        data: {
          order_id: _order_id,
          zm_user_id: vm.data.userid,
          entry: entry
        },
        success(res) {
          if (res.data.status == '1001') {
            let _tradeNO = res.data.data;
            my.tradePay({
              // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              tradeNO: _tradeNO,
              success: (res) => {
                let _code = res.resultCode;
                if (_code == "9000") {//成功
                  my.hideLoading();
                  vm.orderList('click', vm.data.userid);
                } else if (_code == "6001") {//用户自主取消
                  my.hideLoading();
                  my.showToast({
                    type: 'fail',
                    content: '支付失败',
                    duration: 1000
                  })
                } else {//失败
                  my.hideLoading();
                  my.showToast({
                    type: 'fail',
                    content: '支付失败',
                    duration: 1000
                  })
                }
              },
              fail: (res) => {
                my.hideLoading();
                my.showToast({
                  type: 'fail',
                  content: '支付失败',
                  duration: 1000
                })
              }
            })
          }else{
            my.hideLoading();
          }
          if (res.data.status == '1002') {
            my.showToast({
              type: 'fail',
              content: res.data.msg,
              duration: 2000
            });
          }
        },
        fail() {
          my.hideLoading();
          my.showToast({
            type: 'fail',
            content: '系统繁忙',
            duration: 2000
          });
        },
        complete: function (res) {
          vm.setData({
            btn_disabled: false
          })
        }
      });
    })
  },

  // 确认收货
  confirmGoods(e) {
    let that = this;
    const { target: { dataset } } = e;
    my.request({
      url: app.globalData.testUrl + '/Api/hidden/orderConfirm',
      method: 'post',
      data: {
        order_id: dataset.orderId,
        zm_user_id: app.globalData.user_id
      },
      success: (res) => {
        let data = res.data;
        if (data.status == '1001') {
          that.orderList('click', that.data.userid);
        } else {
          my.showToast({
            type: 'fail',
            content: '系统繁忙',
            duration: 1000
          })
        }
      },
      fail() {
        my.showToast({
          type: 'fail',
          content: '系统繁忙',
          duration: 1000
        })
      }
    })
  },

  // 取消订单弹框的显示与隐藏控制
  cancelOrder(e) {
    const { target: { dataset } } = e;
    this.setData({
      cancelModel: true,
      selectOrder_id: dataset.orderId
    })
  },

  // 取消订单弹框按钮操作
  cancelOrderBtnsHander(e) {
    let that = this;
    const { target: { dataset } } = e;
    // 再考虑下
    if (dataset.item.extClass == 'cancel') {
      this.setData({
        cancelModel: false,
        selectOrder_id: ''
      });
    }
    // 取消下单
    if (dataset.item.extClass == 'btn-payment') {
      this.setData({
        cancelModel: false,
      });
      my.showLoading();
      my.request({
        url: app.globalData.testUrl + '/Api/hidden/orderCancel',
        method: 'POST',
        data: {
          zm_user_id: that.data.userid,
          order_id: that.data.selectOrder_id,
          remarks: that.data.reason
        },
        success: (res) => {
          my.hideLoading();
          if (res.data.status == '1001') {
            my.showToast({
              type: 'success',
              content: '取消成功',
              duration: 1000
            })
            that.orderList('click', that.data.userid);
          }
          if (res.data.status == '1002') {
            my.showToast({
              type: 'fail',
              content: res.data.msg,
              duration: 1000
            });
          }
        },
        fail() {
          my.hideLoading();
          my.showToast({
            type: 'fail',
            content: '系统繁忙',
            duration: 1000
          });
        }
      });
    }
  },

  // 取消订单原因
  radioChange(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  // 页面滚动的时候触发,判断是否显示返回顶部按钮
  onPageScroll(e) {

    if (e.scrollTop > 300) {
      this.setData({
        show_toTop_btn: true
      })
    } else {
      this.setData({
        show_toTop_btn: false
      })
    }
  },
  toTop() { // 点击返回顶部
    my.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      show_toTop_btn: false
    })
  },
});
