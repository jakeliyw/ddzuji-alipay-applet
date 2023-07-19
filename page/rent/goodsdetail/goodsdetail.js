import {
  uniq
} from "lodash/array";
var app = getApp();
Page({
  data: {
    appInfo: app,
    _attr: '',
    index: '',
    imgUrl: '',
    baseUrl: '', // 链接跟域名
    // is_click: '',
    phone: '',
    goods_id: '',
    showWhat: {}, //是否显示收藏组件
    canUse_favorite: false, //是否支持收藏组件
    canUse_share: false, //是否支持分享组件
    banner: '', //轮播图
    img_list: [], //商品介绍图片
    attr_color: [{
      color: '',
      checked: '',
    }, {
      color: '',
      checked: '',
    }],
    activity_banner: [], //坑位轮播图
    activity_bannerLen: 0, //坑位轮播图个数
    goodsDetail: "", //商品信息
    voucherList: [], //优惠券
    favorite: [], //猜你喜欢
    recommend: [], //热门推荐
    comm_sp: [], //商品规格
    receivedVoucherId: [], //已领取的优惠券（无手机号）
    iniProductImg: '', //默认产品图
    choosedAttrPrice: 0, //所选规格对应的总价
    buyout_price: "_", //买断金
    month_rent: '', //月租金
    productImg: '', //选中的产品图
    color_list: [], //选颜色
    attr: [], //属性规格
    // attr_fs: [   // 租赁方式
    //   {
    //     attr_mode: '租完归还 (支持随时买断)',
    //     checked: 'true'
    //   }

    // ],
    // attrArry: [], //属性规格（多字段）
    // subArry: [], //提交的属性
    color: '',
    module_top: 0, //商品详情 租赁须知等tab位置
    module_fixed: false, //商品详情 租赁须知等悬浮
    rentMonth: [{
        goods_zq: 0, //租期

        term_price: 0, //月租
        day_price: 0, //天租
        color: '白色', //灰色
        checked: 'true'
      },
      {
        goods_zq: 0,
        term_price: 0,
        day_price: 0,
        color: '金色',
        checked: ''
      },
    ],
    otherPay: { //配件
      code: '', //0可选,1必选
      text: '',
      amount: 0, //配件金额
      isChoose: false, //是否选择了配件，默认不选
      realAmount: 0, //选择的配件金额
    },
    enjoy: { //意外保障
      code: '', //0可选,1必选
      text: '（可选）',
      amount: '280.00', //意外保障金额
      isChoose: true, //是否选择了意外保障，默认不选
      realAmount: 0, //选择的意外保障金额
    },
    notChooseVou: true, //优惠券
    notChoose: true, //所有选项
    selectTabindex: 0, //商品介绍 租赁须知等 选中index
    serve: [],
    clickFlag: true, //避免重复点击
    showArry: [], //弹出层中显示选择的规格等（有空格）
    showStr: '', //弹出层中显示选择的规格等（无空格）

    serviceHidden: true, //服务面板
    attrHidden: true, //规格选择面板
    attrpanelHidden: true, //规格参数面板
    chengseHidden: true, //成色面板
    couponHidden: true, //优惠卷面板
    buy_out: true, //买断金参数面板
    voucherHidden: true, //优惠券面板
    expressHidden: true, //快递运费说明面板
    enjoyHidden: true, //意外保障弹出层
    buyoutHidden: true, //买断金弹出层
    yiwaiHidden: true, //买断金弹出层
    frozenHidden: true, //冻结押金弹出层
    shadowAnimation: [], //动画-背景
    contentAnimation: [], //动画-内容
    layerAnimation: [], //动画-弹出层
    is_receive: false, // 记录用户是否已经点击了收藏 true收藏 false没有收藏
    show_toTop_btn: false, // 返回顶部按钮
    noData: false, // 点击进入详情页没有数据时候的提示信息

    goods_params: { // 弹出层中商品的规格参数
      goods_img: '',
      all_price: '',
      day_price: '',
      month_price: '',
      md_price: '',
      after_discount_goods_total_rent: '' // 总租金
    },
    detail_term: [], // 详细租期 
    term: [''], // 租用天数
    term_num: '', // 租期
    goods_sku: [], // 后台返回的商品规格组合
    jinxuan_arr: [], // 禁选按钮组合
    concat_sku: [{
      attr_id: '',
      attr_name: '',
      attr_val_id: '',
    }], // 选中项id
    new_sku_id: '', // 最新选择按钮的id
    goods_lease_id: '', //商品详细租期id
    goods_lease_term: '', // 商品基本信息租期数
    is_lease: false, // 记录是否选择了详细租期
    // 下面字段用于计算可选与不可选字段
    sku_attr: [],
    sku_attr_ar: [],
    sku_sku: [],
    sku_sku_ar: [],
    state: 1, //按钮状态
    attr_height: 0,

    sku_colors: [], //所有的颜色 列表
    sku_colorSelect: null, //当前选择的颜色
    sku_colorSelectIndex: 0, //当前选择的颜色 index

    sku_guiges: [], //所有的规格列表
    sku_colorguige: null, //当前选中的规格
    sku_guigeSelectIndex: 0, //当前选中的规格 index

    sku_days: [], //所有的天数列表
    sku_daySelect: null, //当前选中的租金 attrid
    sku_daySelectIndex: 0, //当前选中的租金 index

    sku_rentals: [], //所有的天数列表
    sku_rentalSelect: null, //当前选中的租金 attrid
    sku_rentalSelectIndex: 0, //当前选中的租金 index
    curSelectSku: {},
    sku_goods_insuranceIsShow: false, //
    sku_goods_insurance: "0.00", //
    sku_monthIsShow: true, //判断是否显示月租金

    sku_canshu: [], //规格参数
    showfavorite: [],
    cate_Id: 0,
    sku_attr_img: "",
    is_CollectionShow: true, //是否显示收藏弹出框
    isCollection: false, //用户是否已收藏领取过优惠券
    kefuisShow: false,
    shangJiaPhone: app.globalData.pre_sale_phone,
    formId: "", //点击立即租赁的formid
    ismoveMenuBtn: true,
    moveMenuSelectId: 0, //点击问答的id
    answersSelectIndex: 1,
    isViewMore: false, //是否查看更多商品详情
    customBannerdotsindex: 0, //自定义轮播小点index
    data_cou: {},
    shangJiaInfo: "",
    isYouHaoHuo: 0, //是否是有好货商品  1是有好货
    is_screen: 0, //固定商品领券模块是否显示   1 显示  0  不显示
    fixed_activitie: { //固定商品领券模块信息

    },
    goods_safe: [], //商品增值服务列表
    goods_service: [], //商品服务标签
    goods_tag: [], //商品特色标签列表
    showBottom: false, //弹框
    process: [{
        name: '平台承诺',
        yes_url: '/image/zj_1.png',
        no_url: '/image/zj_no_1.png'
      },
      {
        name: '租物流程',
        yes_url: '/image/zj_2.png',
        no_url: '/image/zj_no_2.png'
      },
      {
        name: '租期计算',
        yes_url: '/image/zj_3.png',
        no_url: '/image/zj_no_3.png'
      },
      {
        name: '租后方案',
        yes_url: '/image/zj_4.png',
        no_url: '/image/zj_no_4.png'
      }
    ],
    process_selectindex: 0, //选择index
    current: 1,
    tap_role_index: -1, //点击的使用规则说明
    is_show_panel: false, //是否点击了弹出层 (用于判断滑动)
    goods_safe_id: 0, //增值服务id
    remen_top: 0,
    titleBarHeight: 0,
    zfb_phone: 0, //支付宝绑定id
    inviter_id: "", //分享人推荐id
    pay_for_rule: null, //赔偿规则模板
    recomend_list: [],
    page: {
      size: 10,
      page: 1,
      total: 0,
      pageSize: 0
    },
    scroll: false, //是否滑动页面
    loadText: '加载中...',
    goods_price_list: [], //9/29添加的商品价格数据
    other_sku_id: 0, //叮咚租机app跳转过来获取到的sku_id,第三方APP
    neicunIndex: 0,
    platform: '', //第三方平台传递过来的平台名
    otheruid: '', //第三方平台传递过来的uid
    other_assure_fee: '', //第三方平台传递过来的保障金价格
    cou_list: [],
    exclusive_price: '', // 专享价
    is_show_exclusive: false, // 是否展示专享价
    isExpandOrder: true, // 展开订单
    isExpandMoney: true, // 展开费用
    isExpandCompensate: true, // 展开赔偿
    isExpandLease: true, // 展开流程
    isExpanReturnGoods: true, // 展开退换货
    isExpanGood: true, // 关于商品
    isExpenLease: true, // 关于租赁
    isAfterSales: true, // 关于售后
    isAboutCost: true, // 关于费用(常见问题)
    switch: 'switch_opened'
  },

  switchChange() {

  },
  jumpProduct() {
    my.navigateTo({
      url: "../newProduct/newProduct",
    });
  },

  // 展开收起
  clickExpand({target: { dataset: { key, origin }}}) {
    this.setData({
      [key] : origin
    })
  },
  tapImage() {
    my.showSharePanel();
  },
  showPriceTip() {
    my.showToast({
      content: '划线价：由商家提供，与实际标价比较，并非原价，该划线价可能是商品/服务的门市价建议零售价、品牌指导价、历史标价中的一项（划线价可能会与实际展示的价格不一致，该价格仅供参考）',
      duration: 3000
    });
  },
  //显示弹出层背景
  showShadow() {
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });

    this.shadowAnim = animation;

    animation.opacity(1).step();
    this.setData({
      shadowAnimation: animation.export(),
    });
    my.hideLoading();
  },
  onReachBottom() {
    var obj = this;
    //console.log("触底加载");
    if (this.data.page.page < this.data.page.pageSize) {
      this.setData({
        scroll: true,
        page: {
          page: this.data.page.page + 1,
          size: this.data.page.size,
          total: this.data.page.total
        }
      });

      this.getRecommendGoods();
    } else {
      this.setData({
        scroll: true,
        loadText: '没有更多了哦',
      })

      setTimeout(function () {
        obj.setData({
          loadText: '',
          scroll: false,
        });
      }, 2000);
    }
  },
  getRecommendGoods() {
    let app = getApp();
    let vm = this;
    // 优惠券
    my.request({
      url: app.globalData.testUrl + '/Api/goods/recommendGoods',
      data: {
        page_size: vm.data.page.size,
        page: vm.data.page.page
      },
      method: 'post',
      dataType: 'json',
      success: (res) => {
        //console.log("热门推荐", res.data);
        if (res.data.status == '1001') {
          let list = [...this.data.recomend_list, ...res.data.data.data];
          vm.setData({
            recomend_list: list,
            'page.total': res.data.data.total,
            'page.pageSize': Math.ceil(res.data.data.total / vm.data.page.size)
          })
        }
      },
      complete: function (res) {
        my.hideLoading(); //加载结束
      }
    });
  },
  // 隐藏弹出层背景
  hideShadow() {
    this.shadowAnim.opacity(0).step();
    this.setData({
      shadowAnimation: this.shadowAnim.export(),
    });
  },
  // 显示弹出层面板
  showContent() {
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      contentAnimation: animation.export(),
    });
  },
  // 隐藏弹出层背景
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
    if (this.layerAnim.scale()) {
      this.layerAnim.scale(.8).opacity(0).step();
      this.setData({
        layerAnimation: this.layerAnim.export(),
      });
    }
  },
  getVoucher(e) {
    let app = getApp()
    my.navigateTo({
      url: "../coupon/coupon",
    });
  },
  tapShow() {
    this.setData({
      chengseHidden: !this.data.chengseHidden,
    });
    this.showShadow();
    this.showContent();
  },
  tapShows() {
    // let obj = getApp()
    // let vm = this
    // // let obj = this;
    // //静默授权、生活号接收消息授权
    // my.getAuthCode({
    //   scopes: 'auth_base', // 主动授权：auth_user，静默授  权：auth_base。或者其它scope
    //   success: (res) => {
    //     if (res.authCode) {
    //       obj.globalData.authCode = res.authCode;//wxc
    //       // console.log(res.authCode);
    //       // return;
    //       my.request({
    //         url: obj.globalData.testUrl + '/Api/user/getUserInfoByAuthCodeB',
    //         method: 'POST',
    //         data: {
    //           auth_code: res.authCode
    //         },
    //         dataType: 'json',
    //         success: (res1) => {
    //           if (!res1.data) {
    //             return false
    //           }
    //           console.log("静默授权", res1)
    //           obj.globalData.user_id = res1.data.data.user_id;
    //           // callback(res1.data.data.user_id);
    //           vm.requestVoucherLists();
    //         }
    //       });
    //     }
    //   }, fail: (res) => {

    //   }
    // });
    this.setData({
      couponHidden: !this.data.couponHidden,
    });
    this.showShadow();
    this.showContent();
  },
  //打开面板
  showPanel(e) {
    // console.log("form", e)

    let vm = this;
    let app = getApp();
    if (e.currentTarget.dataset.origin == "express") {
      this.setData({
        expressHidden: !this.data.expressHidden,
      });
      this.showShadow();
      this.showContent();
    } else if (e.currentTarget.dataset.origin == "service") {
      this.setData({
        serviceHidden: !this.data.serviceHidden,
      });
      this.showShadow();
      this.showContent();
    } else if (e.currentTarget.dataset.origin == "specs") {
      this.setData({
        attrpanelHidden: !this.data.attrpanelHidden,
      });
      this.showShadow();
      this.showContent();
    } else if (e.currentTarget.dataset.origin == "buy_out") {
      this.setData({
        buy_out: !this.data.buy_out,
      });
      this.showShadow();
      this.showContent();
    } else if (e.currentTarget.dataset.origin == "voucher") {
      this.setData({
        voucherHidden: !this.data.voucherHidden,
      });
      this.showShadow();
      this.showContent();
    } else if (e.currentTarget.dataset.origin == "attr") { //商品sku弹出框

      // if (app.globalData.userInfo.username) {
      //   vm.setData({
      //     attrHidden: !vm.data.attrHidden,
      //     formId: e.detail.formId
      //   });
      //   vm.showShadow();
      //   vm.showContent();
      //   setTimeout(function () {
      //     my.createSelectorQuery()
      //       .select('.goods-detail').boundingClientRect()
      //       .select('.btn_height').boundingClientRect()
      //       .select('.panel').boundingClientRect()
      //       .select('.monthly_view').boundingClientRect()
      //       .exec((ret) => {
      //         //console.log(ret)
      //         if (ret && ret[2] && ret[1] && ret[0] && ret[3]) {
      //           vm.setData({
      //             attr_height: ret[2].height - ret[1].height - ret[0].height - ret[3].height
      //           });
      //         }
      //         my.hideLoading();
      //       });
      //   }, 100)
      // } else {
      //   // my.showLoading({
      //   //   content: '加载中...'
      //   // });
      //   app.globalData.inviter_id = vm.data.inviter_id;
      //   console.log(app.globalData.inviter_id)
      //   app.getUserInfo(function (res) {
      //     console.log("获取用户授权信息", res)
      //     // my.hideLoading();
      //     if (res) {

      //       vm.setData({
      //         attrHidden: !vm.data.attrHidden,
      //         formId: e.detail.formId
      //       });
      //       vm.showShadow();
      //       vm.showContent();
      //       setTimeout(function () {
      //         my.createSelectorQuery()
      //           .select('.goods-detail').boundingClientRect()
      //           .select('.btn_height').boundingClientRect()
      //           .select('.panel').boundingClientRect()
      //           .select('.monthly_view').boundingClientRect()
      //           .exec((ret) => {
      //             if (ret && ret[2] && ret[1] && ret[0] && ret[3]) {
      //               vm.setData({
      //                 attr_height: ret[2].height - ret[1].height - ret[0].height - ret[3].height
      //               });
      //             }

      //           });
      //       }, 100)

      //     }
      //   });
      // }

      vm.setData({
        attrHidden: !vm.data.attrHidden,
        formId: e.detail.formId
      });
      vm.showShadow();
      vm.showContent();
      setTimeout(function () {
        my.createSelectorQuery()
          .select('.goods-detail').boundingClientRect()
          .select('.btn_height').boundingClientRect()
          .select('.panel').boundingClientRect()
          .select('.monthly_view').boundingClientRect()
          .exec((ret) => {
            //console.log(ret)
            if (ret && ret[2] && ret[1] && ret[0] && ret[3]) {
              vm.setData({
                attr_height: ret[2].height - ret[1].height - ret[0].height - ret[3].height
              });
            }
            my.hideLoading();
          });
      }, 100)


    }

    this.setData({
      is_show_panel: true
    });

  },

  //显示弹出层
  showEnjoyLayer(e) {
    // console.log(e);

    if (e.currentTarget.dataset.origin == "enjoy") {
      this.setData({
        enjoyHidden: !this.data.enjoyHidden,
      });
    } else if (e.currentTarget.dataset.origin == "buyout") {
      this.setData({
        buyoutHidden: !this.data.buyoutHidden,
      });
    } else if (e.currentTarget.dataset.origin == "safe") {
      this.setData({
        yiwaiHidden: !this.data.yiwaiHidden,
      });
    } else if (e.currentTarget.dataset.origin == "frozen") { //冻结押金弹框
      this.setData({
        frozenHidden: !this.data.frozenHidden,
      });
    }

    this.showLayer();
    this.showShadow();
  },

  //关闭面板/弹层
  hidePanel(e) {
    console.log(e.currentTarget.dataset.style);
    if(e.currentTarget.dataset.style === 'coupon') {
      setTimeout(() => {
        this.setData({
          couponHidden: true,
        })
      }, 150);
    }
    if (e.currentTarget.dataset.style == "panel") {
      this.hideShadow();
      this.hideContent();
      setTimeout(() => {
        this.setData({
          serviceHidden: true,
          attrHidden: true,
          voucherHidden: true,
          attrpanelHidden: true,
          chengseHidden: true,
          // couponHidden: true,
          expressHidden: true,
          buy_out: true,
        });
      }, 150);
      this.setData({
        is_show_panel: false
      });
    } else if (e.currentTarget.dataset.style == "layer") {
      this.hideLayer();
      this.setData({
        enjoyHidden: true,
        buyoutHidden: true,
        yiwaiHidden: true,
        frozenHidden: true,
      });
    }
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
  onGetCouponSuccess(resultList, {
    extraData
  }) {
    // console.log('触发了 onGetCouponSuccess 事件')
    // console.log('成功返回结果: ', resultList)
  },
  onGetCouponFail(result, {
    extraData
  }) {
    // console.log('触发了 onGetCouponFail 事件')
    // console.log('失败返回结果: ', result)
  },
  onUseImmediately(event, {
    extraData
  }) {
    // console.log('触发了 onUseImmediately 事件')
    // 可以跳转到自定义的页面
    // my.navigateTo({
    //   url: '/pages/goods-detail/index',
    // })
  },
  onClose(event, {
    extraData
  }) {
    this.requestVoucherLists()
    // console.log('触发了 onClose 事件')
  },
  // 获取我的优惠卷列表
  requestVoucherLists() {
    let vm = this
    let app = getApp()
    // my.showLoading({
    //   content: '加载中'
    // })
    vm.setData({
      cou_list: []
    })
    my.request({
      url: app.globalData.testUrl + '/api/voucher/getUserAbleReceiveAndAbleUseVoucherList',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id,
        goods_id: vm.data.goods_id,
        goods_price: (vm.data.goods_params.all_price - vm.data.goods_params.md_price).toFixed(2),
      },
      dataType: 'json',
      success: function (res) {
        let list = []
        res.data.data.userAbleReceiveVoucherList.forEach((item, index) => {
          let obj = {
            ...item,
            type: 1,
            uuid: new Date().getTime() + '' + index
          }
          list.push(obj)
        })
        res.data.data.userAbleUseVoucherList.forEach((item, index) => {
          let obj = {
            ...item,
            type: 2,
            uuid: new Date().getTime() + '' + index
          }
          list.push(obj)
        })
        // console.log(res);
        // console.log(list,'listlistlist');
        vm.setData({
          cou_list: list
        })
        // my.hideLoading()
      }
    })
  },
  // 颜色
  clickColor(e) {
    const {
      index,
      color
    } = e.target.dataset;
    this.setData({
      sku_colorSelect: color,
      sku_colorSelectIndex: index
    })
    this.computedPrice();
  },
  // 规格
  clickGuide(e) {
    const {
      index,
      guige
    } = e.target.dataset;
    this.setData({
      sku_guigeSelect: guige,
      sku_guigeSelectIndex: index
    })
    this.computedPrice();
  },
  // 租用天数
  click_day(e) {
    const {
      index,
      day
    } = e.target.dataset;
    this.setData({
      sku_daySelect: day,
      sku_daySelectIndex: index
    })
    this.computedPrice();
  },
  // 租赁方式
  click_rental(e) {
    const {
      index,
      rental
    } = e.target.dataset;
    this.setData({
      sku_rentalSelect: rental,
      sku_rentalSelectIndex: index
    })
    this.computedPrice();
  },
  computedPrice() {
    const _curSku = this.data.goods_price_list.filter(item => {
      const {
        colour,
        attr_spec,
        lease_period,
        rental
      } = item;
      return (
        colour === this.data.sku_colorSelect && // 颜色
        attr_spec === this.data.sku_guigeSelect && // 规格
        lease_period === this.data.sku_daySelect && // 当前选中的租金 attrid
        (rental === this.data.sku_rentalSelect || !rental) // !rental 兼容老数据 //当前选中的租金 attrid
      )
    })[0]
    // 设置当前选中sku
    this.setData({
      curSelectSku: _curSku,
    })

    const {
      attr_img,
      goods_rent,
      buyout_gold,
      goods_total_amount,
      monthly_amount,
      after_discount_rent,
      is_discount,
      after_discount_goods_total_rent
    } = _curSku;

    const month_price = goods_rent && (parseFloat(goods_rent) * 30).toFixed(2); //月租金

    this.setData({
      goods_params: {
        goods_img: attr_img,
        all_price: parseFloat(goods_total_amount).toFixed(2),
        day_price: goods_rent, // 日租金
        md_price: buyout_gold, // 买断金
        month_price: monthly_amount, // 月租金
        after_discount_rent: after_discount_rent,
        is_discount: is_discount,
        after_discount_goods_total_rent
      }
    })
    let obj = getApp()
    let vm = this
    // let obj = this;
    //静默授权、生活号接收消息授权
    my.getAuthCode({
      scopes: 'auth_base', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        if (res.authCode) {
          obj.globalData.authCode = res.authCode; //wxc
          // console.log(res.authCode);
          // return;
          my.request({
            url: obj.globalData.testUrl + '/Api/user/getUserInfoByAuthCodeB',
            method: 'POST',
            data: {
              auth_code: res.authCode,
              platform: obj.globalData.platform,
              come_from: obj.globalData.come_from,
              user_mark:  obj.globalData.user_mark,
            },
            dataType: 'json',
            success: (res1) => {
              if (!res1.data) {
                return false
              }
              // console.log("静默授权", res1)
              obj.globalData.user_id = res1.data.data.user_id;
              // callback(res1.data.data.user_id);
              vm.requestVoucherLists();
            }
          });
        }
      },
      fail: (res) => {

      }
    });
    // this.requestVoucherLists()
  },

  // “商品介绍”模块切换
  seleModule(e) {
    let _selectTabindex = e.currentTarget.dataset.index;
    this.setData({
      selectTabindex: _selectTabindex
    })

    if (_selectTabindex == 3) {
      setTimeout(() => {
        my.createSelectorQuery()
          .select('.goods-title').boundingClientRect()
          .selectViewport().scrollOffset()
          .select('.footer').boundingClientRect()
          .select('.dong').boundingClientRect()
          .exec((ret) => {
            // my.pageScrollTo({
            //   scrollTop: ret[3].top + 5
            // })

            if (ret[0]) {
              my.pageScrollTo({
                scrollTop: ret[1].scrollTop + ret[2].top - ret[0].height + 5
              })
            }
          });
      }, 500);

    } else {
      if (this.data.module_fixed) {
        my.createSelectorQuery()
          .select('.dong').boundingClientRect()
          .selectViewport().scrollOffset()
          .exec((ret) => {

            this.setData({
              module_fixed: false
            })
            if (ret[0]) {
              if (ret[0].top > 0) {
                my.pageScrollTo({
                  scrollTop: ret[1].scrollTop + ret[0].top + 10
                })
              } else {
                my.pageScrollTo({
                  scrollTop: ret[1].scrollTop + ret[0].top - 10
                })
              }
            }
          });
      }
    }


  },

  // 店铺
  goHome() {
    my.switchTab({
      url: '../rent'
    })
  },

  //分享
  onShareAppMessage() {
    var obj = this;
    var app = getApp();

    return {
      title: app.globalData.title,
      desc: `${app.globalData.title} 信用免押 更多爆款超低价格`,
      path: 'page/rent/goodsdetail/goodsdetail?id=' + this.data.goods_id + "&inviter_id=" + this.data.goodsDetail.user_code + "&source=dxyq",
      success: function () {

        app.getAuth_base(function (userid) {

          my.request({
            url: app.globalData.testUrl + '/Api/coupon/cou_share',
            method: 'POST',
            data: {
              zm_user_id: userid,
              goods_id: obj.data.goods_id
            },
            dataType: 'json',
            success: function (res) {

              if (res.data.status == '1001') {
                my.showToast({
                  type: 'none',
                  content: '分享成功',
                  duration: 2000,
                  success: () => {

                  }
                });
              }
            }
          })

        })
      },
      fail: function () {
        my.showToast({
          type: 'none',
          content: '分享失败',
          duration: 500,
          success: () => {

          },
        });
      }
    }
  },

  //立即租赁
  toRent(e) {
    // console.log(this.data.platform)
    // console.log(this.data.third_user_id)
    // var formId = e.detail.formId; //模板消息formId
    // if (my.canIUse('form.report-submit')) {
    //   formId = e.detail.formId;
    // }

    const app = getApp();
    let that = this
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    // 立即租赁
    const requestData = {
      goods_id: this.data.curSelectSku.goods_id, // 商品id
      goods_rentday: this.data.curSelectSku.lease_period, //天数
      phone: app.globalData.userPhone, //手机号码
      zm_user_id: app.globalData.user_id, //用户id
      form_id: "", // formId用于发送消息模板
      attr_id: this.data.curSelectSku.attr_id, //规格id
      safe_id: this.data.goods_safe ? (this.data.goods_safe[0].isSelect ? this.data.goods_safe[0].id : 0) : 0, //增值服务id
      //叮咚租机传过来的信息
      platform: app.globalData.platform, //第三方平台
      third_user_id: app.globalData.otheruid, //第三方用户id
    }

    my.request({
      url: app.globalData.testUrl + '/Api/order/goodsLease',
      method: 'POST',
      data: requestData,
      dataType: 'json',
      success: function (res) {
        if (res.data.status == '1001') {
          const { curSelectSku: { attr_id: id }, exclusive_price: e_price , is_show_exclusive: is_exclusive  } = that.data
          my.navigateTo({
            // url: "../confirm-order/confirm-order?order_id=" + res.data.data + 
            // '&attr_id=' + id + '&exclusive_price=' + e_price + '&is_show_exclusive=' + is_exclusive,
            url: `../confirm-order/confirm-order?order_id=${res.data.data}&attr_id=${id}&exclusive_price=${e_price}&is_show_exclusive=${is_exclusive}`
          });
        } else if (res.data.status == '1002') {

        }
      },
      complete: function (res) {
        my.hideLoading();
      }
    })

  },

  //跳转到外部小程序
  // goOut(e) {
  //   my.navigateToMiniProgram({
  //     appId: e.currentTarget.dataset.appId,
  //     path: e.currentTarget.dataset.path
  //   })
  // },

  onShow() {
    app.globalData.is_gogoods = true;
    // my.request({
    //   url: app.globalData.testUrl + '/Api/most/couponList',
    //   method: 'POST',
    //   data: {
    //     zm_user_id: app.globalData.user_id
    //   },
    //   success: (res) => {
    //     this.setData({
    //       data_cou: res.data.data
    //     })
    //   }
    // })
    let vm = this;
    vm.setData({
      // baseUrl: app.globalData.testUrl,
      testUrl: app.globalData.testUrl,
      imgUr: app.globalData.imgUrl,
      recomend_list: [],
      page: {
        pageSize: 0,
        size: 10,
        page: 1,
        total: 0
      }
    })
    this.getRecommendGoods();

  },
  onLoad(query) {
    let otherUid = query.uid
    // my.setStorageSync('otherUid',query.uid)
    // console.log(otherUid)
    const { exclusivePrice = '' } = query
    this.setData({
      platform: query.platform,
      otheruid: otherUid,
      other_assure_fee: query.assure_fee,
      exclusive_price: exclusivePrice,
      is_show_exclusive: !!exclusivePrice,
    })
    let app = getApp()
    if (query.platform) {
      app.globalData.platform = options.platform
    }
    if (query.come_from) {
      app.globalData.come_from = options.come_from
    }
    // if (query.uid) {
    //   app.globalData.platform = this.data.platform
    //   app.globalData.otheruid = this.data.otheruid
    //   app.globalData.other_assure_fee = this.data.other_assure_fee
    // }

    var obj = this;

    if (!my.canIUse("request")) {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
      return
    }
    let _is_CollectionShow = null;
    my.getStorage({
      key: 'is_CollectionShow', // 缓存数据的key
      success: (res) => {
        if (res.data) {
          _is_CollectionShow = res.data
        } else {
          _is_CollectionShow = true
        }
      }
    });
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          titleBarHeight: res.titleBarHeight + res.statusBarHeight
        })
      }
    })

    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });


    this.setData({
      imgUrl: app.globalData.imgUrl,
      goods_id: parseInt(query.id),
      baseUrl: app.globalData.testUrl,
      is_CollectionShow: _is_CollectionShow
    });


    obj.getAuth_base();



    if (app.globalData.user_id != "") {
      obj.record_uv(query.id, query.origin, app.globalData.user_id);
    } else {
      app.getAuth_base(function (user_id) {
        obj.record_uv(query.id, query.origin, user_id);

      })
    }


    if (query.inviter_id) {
      this.setData({
        inviter_id: query.inviter_id
      });
    }


    if (query.id) { //内部跳转
      var id = query.id;
    } else { //外部跳到小程序
      var id = app.globalData.goods_id;
    }


    if (query.id) { //内部跳转
      var id = query.id;
    } else { //外部跳到小程序
      var id = app.globalData.goods_id;
    }

    //当前版本是否支持收藏组件
    if (my.canIUse('favorite')) {
      this.setData({
        canUse_favorite: true
      });
    } else {
      this.setData({
        canUse_favorite: false
      });
    }

    //当前版本是否支持分享组件
    if (my.canIUse('button.open-type.share')) {
      this.setData({
        canUse_share: true
      });
    } else {
      this.setData({
        canUse_share: false
      });
    }


    let info_data = { //首页接口参数
      activity: query.activity || '', //活动名称
      goods_id: obj.data.goods_id, //商品id
      source: query.source || '', //数据来源  默认
      user_code: "", //用户code
      exclusive_price: exclusivePrice // 专享价
    }

    let res = my.getStorageSync({
      key: 'user_code'
    }); //获取 user_code 缓存
    if (res.data) {
      info_data.user_code = res.data;
    }

  
    // if(query.sku_id==undefined){
    //********商品详情********
    my.request({
      url: app.globalData.testUrl + '/Api/most/goodsInfo',
      method: 'get',
      data: info_data,
      success: function (res) {
        //goods_insurance
        my.hideLoading();
        if (res.data.status == '1001') {
          obj.skuData_handle(res);

          let _shangJiaPhone = "";
          if (res.data.data.mer_phone) {
            _shangJiaPhone = res.data.data.merchant.mer_phone
          }

          let _goodsDetail = res.data.data;

          let _goods_safe = res.data.data.safe_data;
          if (_goods_safe) {
            _goods_safe[0].isSelect = true;
          }

          let _merchant = res.data.data.merchant;

          _merchant.two = parseInt(_merchant.mer_score / 2);
          if ((10 - _merchant.mer_score) == 1) {
            _merchant.one = 1;
            _merchant.zero = 0;
          } else {
            if ((10 - _merchant.mer_score) % 2 > 0) {
              _merchant.one = 1;
              _merchant.zero = parseInt((10 - _merchant.mer_score) / 2);
            } else {
              _merchant.zero = parseInt((10 - _merchant.mer_score) / 2);
            }
          }

          let _pay_for_rule = res.data.data.pay_for_rule;

          if (_pay_for_rule) {
            _pay_for_rule.pay_for_desc = _pay_for_rule.pay_for_desc.replace(/\<p\>/g, ' ');
            _pay_for_rule.pay_for_desc = _pay_for_rule.pay_for_desc.replace(/\<\/p\>/g, ' ');

            _pay_for_rule.pay_for_desc = _pay_for_rule.pay_for_desc.replace(/(^\s*)|(\s*$)/g, ""); //去除头尾空格
            _pay_for_rule.pay_for_desc = _pay_for_rule.pay_for_desc.split('  ');
          }

          if (info_data.user_code == "") { //第一次进入 设置缓存
            my.setStorageSync({
              key: 'user_code',
              data: _goodsDetail.user_code
            });
          }
          obj.setData({
            goodsDetail: _goodsDetail,
            attr: res.data.data.attr, //
            banner: res.data.data.carousel_img, //顶部轮播
            img_list: res.data.data.data_img, //详情图
            shangJiaInfo: _merchant,
            shangJiaPhone: _shangJiaPhone,
            isYouHaoHuo: res.data.data.is_nice,
            is_screen: res.data.data.is_screen,
            activity_banner: res.data.data.merchant.carousel_img,
            fixed_activitie: {
              template_id: res.data.data.template_id,
              get_cou_type: res.data.data.get_cou_type,
              img_url: res.data.data.img_url
            },
            goods_safe: _goods_safe,
            serve: res.data.data.service_data, //服务
            showfavorite: res.data.data.merchant.mer_recommend, //为你推荐
            sku_canshu: res.data.data.attr_spec, //参数
            pay_for_rule: _pay_for_rule  //赔偿规则
          })

        } else if (res.data.status == '1002') {
          obj.setData({
            noData: true
          })
        }

      },
      fail: function () {
        my.hideLoading();
      }
    });
  },

  record_uv(goods_id = '', origin, user_id) { //记录来源   user_id 用户id   origin 来源

    let vm = this;
    var app = getApp();

    if (origin) {
      my.request({
        url: app.globalData.testUrl + '/Api/goods/statistics',
        method: 'POST',
        data: {
          zm_user_id: user_id,
          goods_id,
          record_type: origin
        },
        success: function (res) {

        }
      })
    }
    
    my.request({
      url: app.globalData.testUrl + '/Api/most/addBrowseRecords',
      method: 'get',
      data: {
        zm_user_id: user_id,
        goods_id: goods_id || this.data.goods_id,
        mode_type: 0,
      },
      success: function (res) {
        if (res.data.status == '1001') {

        }
      }

    })
  },
  // 页面滚动的时候触发,判断是否显示返回顶部按钮
  onPageScroll(e) {
    let vm = this;
    if (e.scrollTop > 300) {
      if (!this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: true
        })
      }
    } else {
      if (this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: false
        })
      }

    }

    my.createSelectorQuery()
      .select('.dong').boundingClientRect()
      .exec((ret) => {
        if (ret[0]) {
          if (ret[0].top <= 0) {
            if (!this.data.module_fixed) {
              this.setData({
                module_fixed: true
              })
            }
          } else {
            if (this.data.module_fixed) {
              this.setData({
                module_fixed: false
              })
            }
          }
        }
      });
    if (this.data.selectTabindex == 0 || this.data.selectTabindex == 3) {
      let vm = this;
      my.createSelectorQuery()
        .select('.footer').boundingClientRect()
        .select('.goods-title').boundingClientRect()
        .exec((ret) => {
          if (ret[0] && ret[1]) {
            if (ret[0].top < ret[1].height) {
              if (this.data.selectTabindex != 3) {
                this.setData({
                  selectTabindex: 3
                })
              }
            } else {
              if (this.data.selectTabindex != 0) {
                this.setData({
                  selectTabindex: 0
                })
              }
            }
          }
        });
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
  //返回首页
  toHome() {
    my.switchTab({
      url: '../rent'
    })
  },

  //********立即租赁  zyj********
  skuData_handle(_res) { //立即租赁 数据处理
    let _leasedata = _res.data.data.lease;
    this.setData({
      goods_price_list: _leasedata
    })
    let _colors = [];
    let _guiges = [];
    let _days = [];
    let _rentals = [];
    for (let item of _leasedata) {
      const {
        colour,
        attr_spec,
        lease_period,
        rental,
      } = item
      colour && _colors.push(colour); // 颜色
      attr_spec && _guiges.push(attr_spec);
      lease_period && _days.push(lease_period);
      rental && _rentals.push(rental);
    }
    _colors = uniq(_colors)
    _guiges = uniq(_guiges)
    _days = uniq(_days)
    _rentals = uniq(_rentals)
    if (_rentals.length === 0) {
      _rentals = ['租完归还 (支持随时买断)']
    }

    this.setData({
      sku_colors: _colors,
      sku_guiges: _guiges,
      sku_days: _days,
      sku_rentals: _rentals,
      sku_colorSelect: _colors[0],
      sku_guigeSelect: _guiges[0],
      sku_daySelect: _days[0],
      sku_rentalSelect: _rentals[0],
    })
    this.computedPrice();
  },
  //意外保障
  click_safe(e) {
    let _goods_safe = this.data.goods_safe;
    _goods_safe[0].isSelect = !_goods_safe[0].isSelect;
    this.setData({
      goods_safe: _goods_safe,
    })
  },
  load_recommendGoods() { //加载猜你喜欢
    let _that = this;


    // 底部商品列表
    my.request({
      url: app.globalData.testUrl + '/Api/goods/guessYouLike',
      method: 'POST',
      data: {
        p: 1,
        pageSize: 9,
        cate_id: _that.data.cate_Id
      },
      dataType: 'json',
      success: function (res) {
        //console.log('底部商品列表', res)
        if (res.data.status == '1001') {

          let _favorite = res.data.data.filter((arr) => {
            arr.goods_labels = arr.goods_label.split(',');
            if (arr.goods_labels.length == 1) {
              arr.goods_labels = arr.goods_labels[0].split('，')
            }
            arr.goods_label = arr.goods_labels[0];
            return arr;
          })


          _that.setData({
            favoritelength: 4,
            showfavorite: _that.split_array(res.data.data, 1, 4),
            favorite: res.data.data
          })
        }
      }
    })
  },
  split_array(arr, p, pageSize) {
    var result = [];

    for (var i = (p - 1) * pageSize; i < pageSize * p; i++) {
      if (arr.length == i) {
        break;
      }
      result.push(arr[i]);
    }
    return result;
  },
  //下拉刷新
  onPullDownRefresh() {
    my.stopPullDownRefresh() //关闭下拉刷新
  },

  hideCollection() {

    my.setStorageSync({
      key: 'is_CollectionShow', // 缓存数据的key
      data: false, // 要缓存的数据
    });

    this.setData({
      is_CollectionShow: false
    })
  },
  toUse() {
    let vm = this;

    my.navigateToMiniProgram({
      appId: app.globalData.appId,
      path: 'pages/index/index?originAppId=' + app.globalData.appId + '&newUserTemplate=KP20200514000002495259',
      success: (res) => {

      },
      fail: (res) => {

      }
    });
    vm.hideCollection();

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
  shangJiaPhone() { //商家客服
    //console.log(this.data.shangJiaPhone);
    my.makePhoneCall({
      number: this.data.shangJiaInfo.mer_phone,
    });
  },
  pingTaiPhone() { //平台客服
    my.makePhoneCall({
      number: app.globalData.pre_sale_phone,
    });
  },
  pingTaiSPhone() { //平台客服（售后）
    my.makePhoneCall({
      number: app.globalData.service_phone,
    });
  },
  onReady() {
    this.answersAnimation = my.createAnimation({
      duration: 200,

    })

  },
  moveMenu(e) { //点击更多按钮
    //console.log(e);
    let vm = this;
    let _movegoodid = e.currentTarget.dataset.id;

    //console.log(_movegoodid);
    if (!vm.data.ismoveMenuBtn) {

      this.answersAnimation.rotate(0).step()
      this.setData({
        answersAnimation: this.answersAnimation.export()
      })

    } else {
      this.answersAnimation.rotate(180).step()
      this.setData({
        answersAnimation: this.answersAnimation.export()
      })
    }


    if (_movegoodid == vm.data.moveMenuSelectId) {

      vm.setData({
        ismoveMenuBtn: !vm.data.ismoveMenuBtn
      })

    } else {
      this.answersAnimation.rotate(0).step()
      this.setData({
        answersAnimation: this.answersAnimation.export()
      })
      vm.setData({
        ismoveMenuBtn: true,
        moveMenuSelectId: _movegoodid
      })
    }


  },
  clickAskanswerMenu(e) {
    let _index = e.currentTarget.dataset.index;
    this.setData({
      answersSelectIndex: _index,
      moveMenuSelectId: ""
    })
  },
  bannerIndex(e) { //轮播滚动事件
    this.setData({
      current: e.detail.current + 1 //当前滚动的index
    })
  },
  activitybannerIndex(e) { //自定义轮播小点
    this.setData({
      customBannerdotsindex: e.detail.current //当前滚动的index
    })
  },
  process_tabIndex(e) { //租机流程滚动

    this.setData({
      process_selectindex: e.detail.current //当前滚动的index
    })
  },
  recommendswiper(e) { //推荐滑动事件

    this.setData({
      showfavorite: this.split_array(this.data.favorite, e.detail.current + 1, 3)
    })
  },
  toCoupon() {
    // this.setData({
    //   showBottom: true
    // });
    // return;

    //console.log(this.data.isYouHaoHuo);
    my.navigateTo({
      url: "../coupon/goodsdetailcoupon/goodsdetailcoupon?isYouHaoHuo=" + this.data.isYouHaoHuo
    });
  },

  tomer() { //跳转商家页面
    my.navigateTo({
      url: "../../merchant/merchant?mer_id=" + this.data.shangJiaInfo.id
    });
  },

  getAuth_base() { //获取静默授权信息
    let vm = this;
    var app = getApp();

    let _zm_userid = my.getStorageSync({
      key: 'zm_user_id'
    }).data;

    if (_zm_userid) {
      my.request({
        url: app.globalData.testUrl + '/Api/goods/AddCount',
        method: 'POST',
        data: {
          goods_id: vm.data.goods_id,
          zm_user_id: _zm_userid
        },
        dataType: 'json',
        success: function (res) {

          if (res.data.status == '1001') {

          }
        }
      })
    } else {
      app.getAuth_base(function (userid) {

        my.setStorageSync({
          key: 'zm_user_id',
          data: userid
        });

        my.request({
          url: app.globalData.testUrl + '/Api/goods/AddCount',
          method: 'POST',
          data: {
            goods_id: vm.data.goods_id,
            zm_user_id: userid
          },
          dataType: 'json',
          success: function (res) {

            if (res.data.status == '1001') {

            }
          }
        })

      })
    }

  },
  tap_process(e) { //点击 品牌保障等类目

    this.setData({
      process_selectindex: e.currentTarget.dataset.index
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
  jump_tap(e) {
    let vm = this;
    var app = getApp();
    vm.hidePanel(e);

    let _type = e.currentTarget.dataset.jump_type, //跳转类型
      _app_id = e.currentTarget.dataset.app_id, //appid
      _content_url = e.currentTarget.dataset.content_url, //跳转路径
      _telmp_id = e.currentTarget.dataset.telmp_id; //模板id

    if (_type == 0) { //内部页面跳转

      if (_content_url.indexOf("cate_id") >= 0) {
        my.setStorageSync({
          key: 'cate_id',
          data: {
            cate_id: _content_url.split("=")[1]
          },
          success: function () {}
        });

        my.switchTab({
          url: '../sorts/sorts',
          success: () => {}
        })
      } else {

        my.navigateTo({
          url: _content_url // "./goodsdetail/goodsdetail??id=111"
        })
      }

    } else if (_type == 1) { //跳转其他小程序
      my.navigateToMiniProgram({
        appId: _app_id,
        path: _content_url,
        success: (res) => {

        },
        fail: (error) => {
          console.log('跳转失败', error);
        }
      })

    } else if (_type == 2) { //会员有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId, //会员有礼小程序AppID
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

    } else if (_type == 3 || _type == 6 || _type == 4) { //收藏有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId,
        path: 'pages/index/index?originAppId=' + app.globalData.appId + '&newUserTemplate=' + _telmp_id
      });
    }
  },
})