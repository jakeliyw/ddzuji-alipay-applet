let app = getApp()
Page({
  data: {
    appInfo:app,
    entry: '', // 订单来源
    info: {}, // 数据信息
    order_id: '', // 订单id
    order_status: '', // 订单状态
    userid: '',
    goods_id: '',
    imgUrl: app.globalData.imgUrl,
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
    type: '', // 区别商品购买还是话费充值，1-商品购买，2-话费充值
    btn_disabled: false, // 支付按钮是否置灰
  },
  onLoad(query) {
    // 加载订单详情
    let that = this;
    this.setData({
      order_id: query.order_id, // 获取订单编号
      goods_id: query.goods_id,
      entry: query.entry,
    })
    // 缓存userid
    let userid = my.getStorageSync({ key: 'zm_user_id' }).data;
    if (userid) {
      that.setData({
        userid: userid
      })
      that.drawPage();
    } else {
      getUserId().then(function (res) {
        that.setData({
          userid: res
        })
        my.setStorageSync({
          key: 'zm_user_id',
          value: res
        });
        that.drawPage();
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
  // 取消订单弹框的显示与隐藏控制
  btnCancelOrder() {
    this.setData({
      cancelModel: true
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
      });
    }
    // 取消下单
    if (dataset.item.extClass == 'btn-payment') {
      this.setData({
        cancelModel: false,
      });
      my.showLoading()
      app.getAuth_base(function (userid) {
        my.request({
          url: app.globalData.testUrl + '/Api/hidden/orderCancel',
          method: 'POST',
          data: {
            zm_user_id: userid,
            order_id: that.data.order_id,
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
              that.drawPage();
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
      })
    }
  },
  // 取消订单原因
  radioChange(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  // 去支付
  goPay() {
    let that = this;
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    // 禁止点击支付按钮，防止用户多次触发
    that.setData({
      btn_disabled: true
    })
    app.getUserInfo((res) => {
      if (!res) {
        my.hideLoading();
        return;
      }
      my.request({
        url: app.globalData.testUrl + '/Api/hidden/orderPay',
        method: 'post',
        data: {
          zm_user_id: that.data.userid,
          order_id: that.data.order_id,
          entry: that.data.entry
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
                  that.drawPage();
                } else if (_code == "6001") {//用户自主取消
                  my.hideLoading();
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
          that.setData({
            btn_disabled: false
          })
        }
      })
    });
  },
  // 页面渲染
  drawPage() {
    let that = this;
    my.showLoading();
    my.request({
      url: app.globalData.testUrl + '/Api/hidden/orderDetail',
      method: 'POST',
      data: {
        zm_user_id: that.data.userid,
        order_id: that.data.order_id
      },
      success: (res) => {
        let data = res.data;
        if (data.status == '1001') {
          that.setData({
            info: data.data,
            order_status: data.data.order_status,
            type: data.data.type
          })
        }
      },
      complete() {
        my.hideLoading();
      }
    });
  },
  // 确认收货
  confirmGoods() {
    let that = this;
    my.request({
      url: app.globalData.testUrl + '/Api/hidden/orderConfirm',
      method: 'post',
      data: {
        order_id: that.data.order_id,
        zm_user_id: that.data.userid
      },
      success: (res) => {
        let data = res.data;
        if (data.status == '1001') {
          my.showToast({
            type: 'success',
            content: '收货成功',
            duration: 1000
          })
          that.drawPage();
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

  // 物流信息
  goExpress() {
    my.navigateTo({
      url: "../../mine/myorders/express/express?order_id=" + this.data.order_id + '&userid=' + this.data.userid
    })
  },

  //复制快递单号
  copyNum(e) {
    let that = this;
    my.setClipboard({
      text: that.data.order_id,
      success: function (e) {
        my.showToast({
          type: 'none',
          content: '复制成功',
          duration: 1200
        });
      }
    });
  },
})