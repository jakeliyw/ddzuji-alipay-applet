import {
  findAddress
} from '/api/address';
var app = new getApp();
Page({
  data: {
    imgUrl: "", //图片路径
    phone: '',
    goods_id: '',
    phone_secret: "", //隐藏后的手机号
    cho: "0", //是否同意协议，0不同意，1同意
    show: "0", //勾选tip的显示
    depositState: "", //-1不免，0半免，1全免
    orderDetail: [], //订单详情
    eme_contact: "", // 紧急联系人
    eme_contact_phone: "", // 紧急联系人电话
    eme_contact_relation: 1, // 紧急联系人关系
    relationList: [{
        label: "父母",
        value: 1
      },
      {
        label: "配偶",
        value: 2
      },
      {
        label: "亲属",
        value: 3
      },
      {
        label: "同事",
        value: 4
      },
    ],
    goodsDetail: [], //返回的商品信息
    voucherList: [], //优惠券列表
    selectvoucherid: 0, //当前选择的优惠券id
    usingVoucher: {}, //要使用的优惠券
    clickNotUse: false, //点击“不使用优惠券”
    orderNo: "", //芝麻订单号
    outOrderNo: "", //商户订单号
    order_id: "", //订单号
    shadowAnimation: [], //动画-背景
    contentAnimation: [], //动画-面板
    layerAnimation: [], //动画-弹出层
    voucherHidden: true, //优惠券面板
    freePaymentHidden: true, //免密支付弹出层
    authorizedHidden: true, //支付宝资金授权弹出层
    actual_payment_Details: true, // 实付详情弹出层
    submitFlag: true, //避免重复提交  
    isLoad: false,
    // emailstr: "",
    isxuzu: false,
    emailSuffixs: ["@qq.com", "@163.com", "@gmail.com", "@msn.com", "@163.net", "@yahoo.com", "@hotmail.com", "@ask.com", "@live.com", "@mail.com"],
    showEngine: false,
    remark: "", //备注信息
    is_financial: 0, //是否显示协议  征信
    is_warrant: 0, //是否显示协议 担保
    tap_role_index: -1, //点击的使用规则说明
    down_payment: "0.00", //首期应付金额
    down_payments: "0.00", //一元首期应付金额
    is_showTips: true, //顶部警告
    address_info: null, //地址信息
    buyOutMsg: {}, //买断信息
    isUploadUserInfo: false,
    isHoriShow: false, // 下单确认弹窗
    orderParams: {},
    cou_list: [],
    current: '',
    coupon_price: '请选择',
    user_voucher_id: '', //选中的优惠劵ID
    active_id: '', //
    attr_id: '',
    exclusive_price: '', // 专享价
    is_skip_face_auth: null,
    sesame_exclusive_discount_amount: '', // 专享优惠
    is_show_exclusive: false, // 是否展示专享价
    is_exclusive_discounts: false // 是否展示专享优惠
  },
  // 优惠劵确定按钮
  hidePanels(e) {
    let vm = this
    // if (!vm.data.user_voucher_id) {
    //   return my.showToast({
    //     type: 'none',
    //     content: '请选择优惠劵'
    //   })
    // }
    this.setData({
      active_id: vm.data.user_voucher_id
    })
    if(!this.user_voucher_id) {
      this.getOrderDetail()
    }
    this.hideShadow();
    this.hideContent();
    this.compute_price()
    setTimeout(() => {
      this.setData({
        voucherHidden: true,
      });
    }, 150);
  },
  //切换优惠卷选中状态
  getCurrent(e) {

    let that = this
    // console.log(e.target.dataset);
    // 如果是点击已经选中的话就取消选中
    if (e.target.dataset.index === that.data.current) {
      this.setData({
        current: that.data.cou_list.length + 1,
        user_voucher_id: ''
      })
    } else {
      // console.log('进来了2', e.target.dataset.index, that.data.current);
      this.setData({
        current: e.target.dataset.index,
        user_voucher_id: e.target.dataset.activeId
      })
    }
  },
  handleOk(e) {
    this.setData({
      eme_contact_relation: e
    })
  },
  // 修改状态
  getIshow(e) {

    let index = e.target.dataset.index
    let isShow = this.data.cou_list[index].isShow
    let _isShow = "cou_list[" + index + "].isShow"
    this.setData({
      [_isShow]: !isShow
    })
  },
  // 获取我的优惠卷列表
  requestVoucherLists() {
    let vm = this
    let app = getApp()
    my.showLoading({
      content: '加载中'
    })
    vm.setData({
      cou_list: []
    })
    my.request({
      url: app.globalData.testUrl + '/api/voucher/getUserAbleUseVoucherList',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id,
        goods_id: vm.data.orderDetail.goods_id || '',
        attr_id: Number(vm.data.attr_id)
        // goods_id: 100215,
      },
      dataType: 'json',
      success: function (res) {
        // let list = []
        // res.data.data.userAbleReceiveVoucherList.forEach((item, index) => {
        //   let obj = {
        //     ...item,
        //     type: 1,
        //     uuid: new Date().getTime() + '' + index
        //   }
        //   list.push(obj)
        // })
        // console.log(res);
        // console.log(list,'listlistlist');
        vm.setData({
          cou_list: res.data.data
        })
        my.hideLoading()
      }
    })
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
  del_topWarning() {

    this.setData({
      is_showTips: false
    })
  },
  // 隐藏弹出层背景
  hideShadow() {
    this.shadowAnim.opacity(0).step();
    this.setData({
      shadowAnimation: this.shadowAnim.export(),
    });
  },
  // 显示面板
  showContent() {
    var animation = my.createAnimation({
      duration: 150,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      contentAnimation: animation.export(),
    });
  },
  // 隐藏面板
  hideContent() {
    this.contentAnim.translateY('100%').step();
    this.setData({
      contentAnimation: this.contentAnim.export(),
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
  //打开面板/弹出层
  showPanel(e) {
    if (e.currentTarget.dataset.origin == "freePayment") {
      this.setData({
        freePaymentHidden: !this.data.freePaymentHidden,
      });

      this.showShadow();
      this.showLayer();

    } else if (e.currentTarget.dataset.origin == "authorized") {
      this.setData({
        authorizedHidden: !this.data.authorizedHidden,
      });

      this.showShadow();
      this.showLayer();
    } else if (e.currentTarget.dataset.origin == "actual_payment_Details") {
      this.setData({
        actual_payment_Details: !this.data.actual_payment_Details,
      });
      this.showShadow();
      this.showContent();
    }
  },

  //优惠券面板
  showVoucherPanel() {
    let vm = this
    // console.log(vm.data.active_id);
    // 点击需要判断是否选中和选中哪一个
    if (vm.data.active_id !== '') {
      let indexs = 0
      vm.data.cou_list.forEach((item, index) => {
        if (item.user_voucher_id == vm.data.active_id) {
          // return item.user_voucher_id == vm.data.active_id
          indexs = index
        }
      })
      this.setData({
        current: indexs,
      });
    } else {
      this.setData({
        current: '',
      });
    }
    this.setData({
      voucherHidden: !this.data.voucherHidden,
    });
    this.showShadow();
    this.showContent();
  },

  //关闭面板/弹出层
  hidePanel(e) {
    this.hideShadow();

    if (e.currentTarget.dataset.style == "panel") {

      this.hideContent();

      setTimeout(() => {
        this.setData({
          voucherHidden: true,
        });
      }, 150);
    } else if (e.currentTarget.dataset.style == "layer") {
      this.hideLayer();

      this.setData({
        freePaymentHidden: true,
        authorizedHidden: true,
      });
    } else if(e.currentTarget.dataset.style === 'actual_payment') {
      this.hideContent()
      this.setData({
        actual_payment_Details: true
      })
    }
  },
  hideEngine() {
    this.setData({
      showEngine: false
    })
  },
  onGetAuthorize() {
    let app = getApp();
    app.getUserPhone((res) => {
      this.toReal()
    })
  },
  onAuthError(e) {
    let vm = this
    my.alert({
      title: '提示',
      content: '取消授权，可能会使部分服务无法使用，或者页面信息不完整',
      cancelButtonText: '我知道了',
      success: (result) => {
        // if(result.confirm){
        //   this.onGetAuthorize()
        // }
      }
    });
  },
  toReal() { //跳转实名认证页面(第一次下单用户)
    let vm = this
    my.navigateTo({
      url: "./real/real?is_skip_face_auth=" + vm.data.is_skip_face_auth
    })
  },
  getAddress() { //获取支付宝收货地址
    // if (my.canIUse('getAddress')) {
    //   let vm = this;
    //   my.getAddress({
    //     success: (res) => {
    //       console.log('success', res);
    //       res.result.address = res.result.prov + res.result.city + res.result.area + res.result.address;

    //       vm.setData({
    //         address_info: res.result

    //       })
    //     },
    //     fail: err => {
    //       my.navigateTo({ url: '/page/mine/addressList/addressList' });
    //     }
    //   });
    // } else {
    //   my.alert({
    //     title: '提示',
    //     content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
    //   });
    // }
    my.navigateTo({
      url: '/page/mine/addressList/addressList'
    });
  },

  //选择优惠券
  chooseVoucher(e) {
    var _cou_id = e.currentTarget.dataset.id;

    if (_cou_id == this.data.selectvoucherid) {
      this.setData({
        usingVoucher: {},
        selectvoucherid: 0
      });
      this.compute_price(); //计算金额
      return;
    }

    var usingVoucher = {};

    this.data.voucherList.forEach((arr) => {
      if (arr.id == _cou_id) {
        usingVoucher = arr;
      }
    })
    this.setData({
      voucherList: this.data.voucherList,
      usingVoucher: usingVoucher,
      selectvoucherid: _cou_id
    });

    this.compute_price(); //计算金额
  },

  // 同意协议
  choose() {
    if (this.data.cho == "0") {
      this.setData({
        cho: "1",
        show: "0"
      })
    } else {
      this.setData({
        cho: "0"
      })
    }
  },

  // 查看协议
  toRule(e) {
    let app = getApp();
    if (my.canIUse('web-view')) {
      my.downloadFile({
        url: app.globalData.imgUrl + "yonghuzulinxieyi.pdf",
        success({
          apFilePath
        }) {
          my.hideLoading();
          my.openDocument({
            filePath: apFilePath,
            fileType: 'pdf',
          })
        }
      })
    } else {
      this.setData({
        canUse: false
      })
    }
  },
  // setEmail(e) {//邮箱输入
  //   let _value = e.detail.value;

  //   if (_value.length > 5) {
  //     this.setData({
  //       showEngine: true
  //     })
  //   }

  //   this.setData({
  //     emailstr: e.detail.value
  //   })
  // },
  setEmeContact(e) {
    this.setData({
      eme_contact: e.detail.value
    })
  },
  setEmeContactPhone(e) {
    this.setData({
      eme_contact_phone: e.detail.value
    })
  },
  handleButtonTap(e) {
    e === 1 ? this.gotoUserInfo() : this.submit_order(this.data.orderParams)
  },
  // 提交订单
  async subOrder(e) {
    var obj = this;

    if (this.data.orderDetail.goods_id !== 100194) {
      if (!obj.data.address_info) {
        my.showToast({
          type: 'none',
          content: '请选择收货信息~',
          duration: 500,
          success: () => {

          }
        });

        return
      }

      if (obj.data.address_info.mobilePhone == "" || obj.data.address_info.fullname == "" || obj.data.address_info.address == "") {
        my.showToast({
          type: 'none',
          content: '请选择收货信息~',
          duration: 500,
          success: () => {

          }
        });
        return
      }


      if (this.data.is_auth != 1) {
        my.showToast({
          type: 'none',
          content: '请先进行实名认证哦~',
          duration: 500,
          success: () => {

          }
        });
        return;
      }
      // feature: 不校验补充资料
      // if (!this.data.isUploadUserInfo) {
      //   my.showToast({
      //     type: 'none',
      //     content: '请先补充资料哦~',
      //     duration: 500,
      //     success: () => {

      //     }
      //   });
      //   return;
      // }
      let _eme_contact = obj.data.eme_contact;
      if (_eme_contact == "") {

        my.showToast({
          type: 'none',
          content: '请输入紧急联系人姓名',
          duration: 1000,
          success: () => {

          },
        });
        return;
      }
      let regName = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/;
      if (!(regName.test(_eme_contact))) {
        my.showToast({
          type: 'none',
          content: '紧急联系人姓名格式不正确！',
          duration: 1000,
          success: () => {

          }
        });
        return;
      }
      if (_eme_contact === obj.data.address_info.fullname) {
        my.showToast({
          type: 'none',
          content: '请输入真实的紧急联系人',
          duration: 1000,
        })
        return;
      }

      let _eme_contact_phone = obj.data.eme_contact_phone;
      if (_eme_contact_phone == "") {

        my.showToast({
          type: 'none',
          content: '请输入紧急联系人手机',
          duration: 1000,
          success: () => {

          },
        });
        return;
      }
      let regPhone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (!(regPhone.test(_eme_contact_phone))) {
        my.showToast({
          type: 'none',
          content: '紧急联系人手机格式不正确！',
          duration: 1000,
          success: () => {

          }
        });
        return;
      }

      if (_eme_contact_phone === obj.data.address_info.mobilePhone) {
        my.showToast({
          type: 'none',
          content: '请输入真实的紧急联系手机',
          duration: 1000,
        })
        return;
      }
    }

    if (this.data.cho == "0") {
      if (this.data.show == "0") {
        this.setData({
          show: "1"
        })
      } else {
        this.setData({
          show: "0"
        })
      }
    } else {
      //console.log("asdfsdf",e)

      var submitParam = {
        order_id: obj.data.orderDetail.order_id, //订单id
        user_phone: app.globalData.userPhone, //支付宝绑定手机号
        receiver_phone: obj.data.address_info.mobilePhone, //收货手机号
        receiver_name: obj.data.address_info.fullname, //收货人姓名
        user_address: obj.data.address_info.address, //用户地址
        cou_id: obj.data.selectvoucherid, //使用优惠券id
        form_id: e.detail.formId, //formId,//推送模板消息form_id
        remarks: obj.data.remark, //备注信息
        user_email: "88888666@qq.com", //邮箱
        zm_user_id: app.globalData.user_id, //用户id
        eme_contact: obj.data.eme_contact,
        eme_contact_phone: obj.data.eme_contact_phone,
        eme_type: obj.data.eme_contact_relation,
        exclusive_price: obj.data.exclusive_price
      }

      if (obj.data.orderDetail.get_position == 1) { //是否已经授权定位信息 值为1代表该用户已授权获取位置信息，值为0 未授权

        if (my.canIUse("getLocation")) {
          submitParam.position_info = await obj.getLocation();
        }
      } else {
        app.globalData.get_position = 0;
      }
      if (obj.data.submitFlag) {
        //obj.submit_order(submitParam);//测试

        // feature: 注释以下代码，不校验补充资料了
        // if (!this.data.isUploadUserInfo) {
        //   this.setData({
        //     orderParams: submitParam,
        //   })
        //   obj.setData({
        //     isHoriShow: true,
        //   })
        // } else {
        //   obj.submit_order(submitParam); //调取资金预授权
        // }
        obj.submit_order(submitParam); //调取资金预授权
      }
    }
  },

  async getLocation() { //获取定位信息
    return new Promise(resolve => {
      my.getLocation({
        type: 2,
        success(res) {
          resolve(JSON.stringify(res));
        },
        fail(fail) {
          resolve("");
          my.hideLoading();
        },
      })
    });


  },
  isUseAuth(submitParam, _auth_no, _credit_amount, _agreement_no) {
    let obj = this;
    my.getStorage({
      key: 'firstFaceauth',
      success: function (res) {
        if (res.data) {
          //第一次进行人脸识别
          // obj.submit_order(submitParam);
          my.redirectTo({
            url: "../order-result/order-result?order_id=" + submitParam.order_id + "&auth_no=" + _auth_no + "&status=SUCCESS&credit_amount=" + _credit_amount + "&agreement_no=" + _agreement_no,
          });
        } else {
          obj.authentication(submitParam, _auth_no, _credit_amount, _agreement_no) //调用人脸识别
        }
      },
      fail: function (res) {
        obj.authentication(submitParam, _auth_no, _credit_amount, _agreement_no) //调用人脸识别
      }
    });
  },
  submit_order(submitParam) { //确认提交订单
    console.log(submitParam, 'submitParam');
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let _this = this;
    this.setData({
      submitFlag: false,
    });

    my.request({
      url: app.globalData.testUrl + '/Api/order/OrderFreeze',
      method: 'POST',
      data: submitParam,
      dataType: 'json',
      success: function (res) {
        //console.log(res);
        let _orderStr = res.data.data.orderStr,
          _signStr = res.data.data.signStr;

        if (res.data.status == '1001') {

          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            orderStr: _orderStr,
            success: (res1) => {

              //console.log("返回参数", res);
              let _code = res1.resultCode;

              if (_code == "9000") { //成功
                let _auth_no = res1.result && JSON.parse(res1.result).alipay_fund_auth_order_app_freeze_response.auth_no;
                let _credit_amount = res1.result && JSON.parse(res1.result).alipay_fund_auth_order_app_freeze_response.credit_amount;
                /** TODO 2023.5.19 全部需要通过人脸 */
                console.log(111, _this.data.is_skip_face_auth);
                console.log(222, _this.data.is_skip_face_auth);
                if (_this.data.is_skip_face_auth === 1) {
                  my.redirectTo({
                    url: "../order-result/order-result?order_id=" + submitParam.order_id + "&auth_no=" + _auth_no + "&status=SUCCESS&credit_amount=" + _credit_amount
                  });
                } else {
                  _this.isUseAuth(submitParam, _auth_no, _credit_amount)
                }

              } else if (_code == "6001") { //用户自主取消
                //console.log("zizhu")
                my.hideLoading(); //加载结束
                my.redirectTo({
                  url: "../../mine/myorders/myorders?id=99",
                });
              } else { //失败
                my.hideLoading(); //加载结束
                my.redirectTo({
                  url: "../order-result/order-result?order_id=" + submitParam.order_id + "&status=FAIL",
                });
              }
            },
            fail: (res) => {
              my.hideLoading(); //加载结束
              my.redirectTo({
                url: "../order-result/order-result?order_id=" + submitParam.order_id + "&status=FAIL",
              });
            }
          });

        } else if (res.data.status == '1002') {
          my.hideLoading(); //加载结束
          my.showToast({
            type: 'fail',
            content: '系统繁忙',
            duration: 1000,
            success: () => {},
          });
        } else {
          my.hideLoading(); //加载结束
          my.showToast({
            type: 'fail',
            content: res.data.msg,
            duration: 1000,
            success: () => {},
          });
        }
        //my.hideLoading(); //加载结束
      },
      complete: function (res) {
        //my.hideLoading();
      }
    });
  },
  onLoad(option) {
    let vm = this;
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var obj = this;
    my.removeStorage({ //移除是否是第一次进行人脸识别
      key: 'firstFaceauth',
    });
    var orderNo = option.order_id; //后台生成的临时订单id

    let { exclusive_price, is_show_exclusive  } = option
 
    if(is_show_exclusive === 'false') {
      is_show_exclusive = ''
    }
    this.setData({
      attr_id: option.attr_id,
      imgUrl: app.globalData.imgUrl,
      orderNo: orderNo,
      phone: app.globalData.userPhone || '',
      exclusive_price,
      is_show_exclusive
    })

    if (option.orderid) {
      this.setData({
        order_id: option.orderid
      })
      this.toBuyOut(option.orderid)
    } else {
      // vm.getOrderDetail();
    }
  },
  onShow() { //页面显示
    let vm = this;
    vm.getOrderDetail();

    // if (vm.data.orderNo != "" && !vm.data.submitFlag) { //页面返回处理  
    //   vm.getOrderDetail();
    // }

    this.setData({
      isUploadUserInfo: my.getStorageSync({
        key: 'has_user_info_photo'
      }).data || false
    })
    my.getStorage({ //页面返回处理
      key: 'isbackreal',
      success: function (res) {
        if (res.data != null) {
          vm.getOrderDetail();
          my.removeStorage({
            key: 'isbackreal',
          });
        }
      }
    });
    if (app.globalData.addressId) {
      this.getAddressData();
    }


  },
  getOrderDetail() { //获取临时订单详情
    let app = getApp();
    let vm = this;
    //获取临时订单信息
    my.request({
      url: app.globalData.testUrl + '/Api/order/ConfirmOrder',
      method: 'POST',
      data: {
        order_id: vm.data.orderNo,
        zm_user_id: app.globalData.user_id,
        user_voucher_id: vm.data.user_voucher_id,
        exclusive_price: vm.data.exclusive_price
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.status == '1001') {
          let _setData = {
            is_auth: res.data.data.is_auth,
            orderDetail: res.data.data,
          }
          const { sesame_exclusive_discount_amount = '' } = res.data.data
          vm.setData({
            is_skip_face_auth: res.data.data.is_skip_face_auth,
            sesame_exclusive_discount_amount,
            is_exclusive_discounts: Boolean(sesame_exclusive_discount_amount)
          })

          // if (res.data.data.user_email && res.data.data.user_email != "") {
          //   _setData.emailstr = res.data.data.user_email;
          // }
          if (vm.data.address_info == null) {

            if (res.data.data.user_address != "" && res.data.data.receiver_name && res.data.data.receiver_phone) {

              _setData.address_info = {
                fullname: res.data.data.receiver_name,
                mobilePhone: res.data.data.receiver_phone,
                address: res.data.data.user_address
              }
            }

          }
          vm.setData(_setData);
          vm.requestVoucherLists() //优惠劵
          my.hideLoading();
          vm.compute_price();

        }
      },
      fail: (res) => {
        console.log('失败', res.data);
      },
      complete: () => {
        my.hideLoading();
      }
    });
  },
  async getAddressData() {
    console.log('getAddressData-------------------------')
    const res = await findAddress({
      id: app.globalData.addressId
    });
    this.setData({
      address_info: {
        fullname: res.data.receiver_name,
        mobilePhone: res.data.receiver_phone,
        address: res.data.address
      }
    })
    console.log(res);
  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.goods_id
    })
  },
  // engineOnclick(e) {//邮箱提示点击

  //   this.setData({
  //     emailstr: this.data.emailstr + e.currentTarget.dataset.suffix,
  //     showEngine: false
  //   })
  // },
  bindTextAreaBlur(e) { //备注信息

    this.setData({
      remark: e.detail.value
    })
  },
  rule_explain(e) { //点击使用规则说明
    let _tap_index = e.currentTarget.dataset.tap_index;
    if (this.data.tap_role_index == _tap_index) {
      this.setData({
        tap_role_index: -1
      })
    } else {
      this.setData({
        tap_role_index: _tap_index
      })
    }
  },
  authentication(submitParam, _auth_no, _credit_amount, _agreement_no) { //认证
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
        user_name: vm.data.orderDetail.user_name,
        user_idcard: vm.data.orderDetail.user_id_number
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
          console.log("唤起人脸识别")
          my.startAPVerify({
            url: res.data.data.certify_url,
            certifyId: res.data.data.certify_id,
            success: res => {
              my.hideLoading(); //加载结束
              // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
              if (res.resultStatus === "9000") {
                my.redirectTo({
                  url: "../order-result/order-result?order_id=" + submitParam.order_id + "&auth_no=" + _auth_no + "&status=SUCCESS&credit_amount=" + _credit_amount + "&agreement_no=" + _agreement_no,
                });
              } else {
                my.showToast({
                  content: res.resultStatus === "6001" ? "需要进行实名认证哦" : '实名认证失败！',
                })
                my.redirectTo({
                  url: "../order-result/order-result?order_id=" + submitParam.order_id + "&auth_no=" + _auth_no + "&status=FAIL&credit_amount=" + _credit_amount + "&agreement_no=" + _agreement_no,
                });
              }
            }
          })
        }
      },
      fail: (res) => {
        my.hideLoading(); //加载结束
        console.log(res)
        my.redirectTo({
          url: "../order-result/order-result?order_id=" + submitParam.order_id + "&auth_no=" + _auth_no + "&status=FAIL&credit_amount=" + _credit_amount + "&agreement_no=" + _agreement_no,
        });
      },
      complete: () => {

      }
    });

  },
  startAPVerify(options, callback) { //调起人脸识别
    my.call('startBizService', {
      name: 'open-certify',
      param: JSON.stringify(options),
    }, callback);
  },

  compute_price() { //计算金额
    let vm = this;
    let _order_goods_insurance = vm.data.orderDetail.order_goods_insurance == null ? 0 : vm.data.orderDetail.order_goods_insurance; //意外保障

    let _order_gross_rent = parseFloat(vm.data.orderDetail.order_gross_rent) - parseFloat(_order_goods_insurance); //除去意外保障租金

    let _order_tenancy_term = vm.data.orderDetail.order_day_rent; //租用天数

    let _day_price = parseFloat(_order_gross_rent) / parseFloat(_order_tenancy_term); //日租金

    let _voucher = vm.data.usingVoucher; //当前选择的优惠券 


    //首期总租金
    let _total_price = (parseFloat(30) * parseFloat(_day_price));
    if (_order_tenancy_term < 30) {
      _total_price = parseFloat(_day_price) * parseFloat(_order_tenancy_term);
    }

    let _price = 0; //优惠后价格
    if (vm.data.selectvoucherid == 0) {
      _voucher = {};
      _price = _total_price;
    } else {
      if (_voucher.cou_type == 1) { //折扣券
        _price = parseFloat(_total_price) * parseFloat(_voucher.cou_sum_price);
      } else if (_voucher.cou_type == 3) { //满减 
        _price = parseFloat(_total_price) - parseFloat(_voucher.cou_price);
      } else if (_voucher.cou_type == 6) { //0元租7天
        _price = parseFloat(_total_price) - parseFloat(_day_price) * parseFloat(_voucher.cou_price);
      } else if (_voucher.cou_type == 11) { //首月1元
        _price = 1;
      } else {
        _price = parseFloat(_day_price) * 30;
      }
    }
    if (vm.data.orderDetail.one_yuan) {
      vm.setData({
        down_payments: (parseFloat(vm.data.orderDetail.first_month_actual_amount) + parseFloat(_order_goods_insurance)).toFixed(2)
      })
    } else {
      vm.setData({
        down_payment: (parseFloat(vm.data.orderDetail.after_voucher_month_rent || vm.data.orderDetail.order_monthly_rent) + parseFloat(_order_goods_insurance)).toFixed(2)
      })
    }

  },
  toBuyOut(order_id) {
    let vm = this;
    my.request({
      url: app.globalData.testUrl + '/Api/order/getBuyoutInfo',
      method: 'POST',
      data: {
        order_id: order_id
      },
      dataType: 'json',
      success: (res) => {
        if (res.data.status == 1001) {
          let data = res.data.data
          data.need_pay = parseFloat(data.need_pay).toFixed(2)
          this.setData({
            buyOutMsg: data
          })
        }
        my.hideLoading()
      },
      fail: () => {
        this.setData({
          buyOutMsg: {
            need_pay: 0.00
          }
        })
        my.hideLoading()
      }
    })
  },
  cashSub() {
    let vm = this;
    my.request({
      url: app.globalData.testUrl + '/Api/order/callBuyoutBar',
      method: 'POST',
      data: {
        order_id: vm.data.order_id,
        zm_user_id: app.globalData.user_id
      },
      dataType: 'json',
      success: (res) => {
        if (res.data.status == 1001) {
          my.tradePay({
            tradeNO: res.data.data,
            success: res => {
              if (res.resultCode === "9000") {
                my.navigateTo({
                  url: `/page/mine/myorders/myorders`
                })
              }
            },
            fail: res => {
              my.alert({
                content: "支付失败，请重试"
              })
            }
          })
        }
      },
      fail: res => {
        my.alert({
          content: "请求失败，请重试"
        })
      }
    })
  },
  gotoUserInfo() {
    my.navigateTo({
      url: `/page/mine/upload_codeImg/upload_codeImg?codeName=${this.data.orderDetail.user_name}&is_financial=${this.data.is_financial}&is_warrant=${this.data.is_warrant}&t=0`,
    })
  },
});