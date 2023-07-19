var app = getApp();
Page({
  data: {
    appInfo:app,
    userid: '',
    address: true, // 是否是后台返回默认地址，true-是，false-不是
    address_info: '', // 地址信息
    ali_address: false, // 是否是从阿里平台获取地址，true-是，false-不是
    order_info: '',
    save: '',  // 优惠价格
    shouldPay: '', // 最终需要付款
    imgUrl: app.globalData.imgUrl,
    goods_id: '', // 商品id
    pro_select_id: '', // 已选商品型号id
    entry: '', // 页面来源
    phone: '', // 手机号
    btn_disabled: true, // 支付按钮是否置灰
    type: '', // 区别商品购买还是话费充值，1-商品购买，2-话费充值
    auto_code: '', // 后端判断用户是否有购买资格
    mark: '', // 用户备注信息
  },
  onLoad(query) {
    let that = this;
    let data = my.getStorageSync({ key: 'buynow' });
    let save = (data.data.pro_origin_price - data.data.pro_price).toFixed(2);
    let address_info = data.data.receiver_data;
    let shouldPay = (parseFloat(data.data.pay_post) + parseFloat(data.data.pro_price)).toFixed(2);
    //console.log(data,query);
    if(query.entry==3){
      shouldPay =(parseFloat(data.data.pay_post) + parseFloat(data.data.pro_origin_price)).toFixed(2);
    }
    let pro_select_id = data.data.pro_select_id;
    this.setData({
      order_info: data.data,
      save: save,
      address_info: address_info,
      address: address_info.length > 0 ? true : false,
      ali_address: address_info.length > 0 ? false : true,
      shouldPay: shouldPay,
      goods_id: query.id,
      pro_select_id: pro_select_id,
      entry: query.entry,
      type: data.data.type,
      auto_code: data.data.auto_code
    })
    // 缓存userid
    let userid = my.getStorageSync({ key: 'zm_user_id' }).data;
    if (userid) {
      that.setData({
        userid: userid
      })
    } else {
      getUserId().then(function (res) {
        that.setData({
          userid: res
        })
        my.setStorageSync({
          key: 'zm_user_id',
          value: res
        });
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
  onShow() {
    app.globalData.is_gogoods = true;
  },
  //获取支付宝收货地址
  showAdress() {
    if (my.canIUse('getAddress')) {
      my.showLoading({
        content: '加载中...',
        delay: 0,
      });
      let vm = this;
      my.getAddress({
        success: (res) => {
          my.hideLoading();
          vm.setData({
            address_info: res.result,
            address: true,
            ali_address: true
          })
        }
      });
    } else {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
    }
  },
  // 支付跳转
  pay() {
    let that = this;
    // 判断地址是否存在，不存在提示用户选择收获地址
    if ((!that.data.address_info || that.data.address_info.length == 0) && that.data.type == 1) {
      my.alert({
        content: '请先选择收货地址',
        buttonText: '我知道了'
      })
      return;
    }
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    // 禁止点击支付按钮，防止用户多次触发
    that.setData({
      btn_disabled: true
    })
    // 获取阿里用户基础信息
    app.getUserInfo((res) => {
      if (!res) {
        my.hideLoading();
        that.setData({
          btn_disabled: false
        })
        return;
      }
      var name = '';
      var phone = '';
      var address = '';
      if (that.data.ali_address) {
        name = that.data.address_info.fullname;
        phone = that.data.address_info.mobilePhone;
        address = that.data.address_info.prov + that.data.address_info.city + that.data.address_info.area + that.data.address_info.street + that.data.address_info.address
      } else {
        name = that.data.address_info[0].receiver_name;
        phone = that.data.address_info[0].receiver_phone;
        address = that.data.address_info[0].receiver_address;
      }
      let submitParam = {};
      if (that.data.type == 2) {
        phone = that.data.phone;
        submitParam = {
          user_note: phone,
          zm_user_id: that.data.userid,
          goods_id: that.data.goods_id,
          specs_id: that.data.pro_select_id,
          entry: that.data.entry,
          auto_code: that.data.auto_code,
          type: that.data.type,
          mark: that.data.mark
        }
      } else {
        submitParam = {
          goods_id: that.data.goods_id,
          zm_user_id: that.data.userid,
          name: name,
          phone: phone,
          address: address,
          specs_id: that.data.pro_select_id,
          num: 1,
          entry: that.data.entry,
          auto_code: that.data.auto_code,
          mark: that.data.mark
        }
      }
      my.request({
        url: app.globalData.testUrl + '/Api/hidden/orderCreate',
        method: 'POST',
        data: submitParam,
        dataType: 'json',
        success: function (res) {
          if (res.data.status == '1001') {
            let tradeNO = res.data.data.trade_no;
            let order_id = res.data.data.order_id;
            my.tradePay({
              // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              tradeNO: tradeNO,
              success: (res) => {
                my.hideLoading();
                let _code = res.resultCode;
                if (_code == "9000") {//成功
                  my.navigateTo({
                    url: '../success/success?userid=' + that.data.userid + '&goods_id=' + that.data.goods_id + '&entry=' + that.data.entry + '&order_id=' + order_id
                  });
                } else if (_code == "6001") {//用户自主取消
                  my.redirectTo({
                    url: '../order-status/status?userid=' + that.data.userid + '&goods_id=' + that.data.goods_id + '&entry=' + that.data.entry + '&order_id=' + order_id
                  });
                } else {//失败
                  my.redirectTo({
                    url: "../order-status/status?userid=" + that.data.userid + '&goods_id=' + that.data.goods_id + '&entry=' + that.data.entry + '&order_id=' + order_id
                  });
                }
              },
              fail: (res) => {
                my.hideLoading();
                my.showToast({
                  type: 'fail',
                  content: '支付失败',
                  duration: 2000
                })
              }
            });

          } else if (res.data.status == '1002') {
            my.hideLoading();
            my.showToast({
              type: 'fail',
              content: res.data.msg,
              duration: 2000
            });
          }else{
            my.hideLoading();
          }
        },
        complete: function (res) {
          that.setData({
            btn_disabled: false
          })
        }
      });
    })
  },
  // 验证手机格式
  getPhoneNumber(e) {
    if (!(/^1[3456789]\d{9}$/.test(e.detail.value))) {
      this.setData({
        btn_disabled: true
      })
      return
    }
    this.setData({
      btn_disabled: false,
      phone: e.detail.value
    })
  },
  getMarkInfo(e) {
    this.setData({
      mark: e.detail.value
    })
  }
})