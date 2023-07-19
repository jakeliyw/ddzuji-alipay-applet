import decodeBase64Content from '../../util/base64/base64';
var app = getApp();
Page({
  ...decodeBase64Content,
  data: {
    appInfo:app,
    notice: false, // 公告显示控制字段
    notice_content: '', // 公告内容
    good_infomation: '', // 产品描述信息
    goods_id: '', // 商品id
    pro_price: '', // 使用优惠券之后商品价格
    pro_origin_price: '', // 商品原价
    free_post: '', // 是否包邮， 1包邮，2不包邮
    pay_post: '', // 不包邮需要付的邮费
    product_model: false, // 型号筛选弹框是否显示
    pro_select_name: '', // 选中型号
    pro_select_img: '', // 选中型号对用的预览图
    pro_select_id: '', // 选中型号对用的id
    placeholder_img: '', // 占位图
    model_list: {}, // 型号列表
    banner: '', //轮播图
    imgUrl: '',
    noData: false, // 点击进入详情页没有数据时候的提示信息
    detail_img: [],
    entry: '', // 页面入口标识符 1-支付宝，2-盲盒活动，3-其它
    receiver_data: [], // 默认收货地址
    show_toTop_btn: false, // 返回顶部按钮
    module_fixed: false,//商品详情 租赁须知等悬浮
    selectTabindex: 0,//商品介绍 租赁须知等 选中index
    current: 1,
    userid: '', // 用户id
    type: '', // 区别商品购买还是话费充值，1-商品购买，2-话费充值
    img: '', // 话费充值预览图
    auto_code: '', // 后端判断用户是否有购买资格
  },

  onLoad(query) {
    var obj = this;
    if (!my.canIUse("request")) {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
      return
    }
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


    this.setData({
      imgUrl: app.globalData.imgUrl,
      goods_id: parseInt(query.goods_id),
      baseUrl: app.globalData.testUrl,
      entry: query.entry, // 从哪里跳过来的
      auto_code: query.auto_code
    });

    // 缓存userid
    let userid = my.getStorageSync({ key: 'zm_user_id' }).data;
    if (userid) {
      obj.setData({
        userid: userid
      })
      getHiddenGoods(userid);
    } else {
      getUserId().then(function (res) {
        obj.setData({
          userid: res
        })
        my.setStorageSync({
          key: 'zm_user_id',
          value: res
        });
        getHiddenGoods(res);
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

    // 隐藏类目商品数据处理
    function getHiddenGoods(userid) {
      my.request({
        url: app.globalData.testUrl + '/Api/hidden/goodsDetail',
        method: 'GET',
        data: {
          goods_id: obj.data.goods_id,
          zm_user_id: userid,
          auto_code: obj.data.auto_code,
          entry: obj.data.entry
        },
        success: function (res) {
          if (res.data.status == '1001') {
            let data = res.data.data;
            let newmodel = data.specs_attr.map(function (item, i, arr) {
              if (i == 0) {
                item = { ...{ checked: true }, ...item }
              } else {
                item = { ...{ checked: false }, ...item }
              }
              return item;
            })
            obj.setData({
              notice_content: data.head_notice.length > 0 ? data.head_notice[0].content : '',
              banner: data.rotation_img,//顶部轮播
              good_infomation: data.goods_name,
              free_post: data.is_free,
              pay_post: data.free_price,
              pro_price: data.specs_attr[0].goods_price,
              pro_origin_price: data.specs_attr[0].original_price,
              pro_select_name: data.specs_attr[0].specs_names,
              pro_select_img: data.specs_attr[0].img,
              pro_select_id: data.specs_attr[0].id,
              placeholder_img: data.goods_img,
              model_list: newmodel,
              detail_img: data.detail_img,
              receiver_data: data.receiver_data,
              type: data.type,
              img: data.detail_img[0],
              auto_code: data.auto_code,
              notice: data.head_notice.length > 0 ? true : false
            })
          }
          if (res.data.status == '1002') {
            obj.setData({
              noData: true
            })
          }
        },
        complete() {
          my.hideLoading();
        }
      })
    }
  },

  onShow() {
    console.log(11, '测试测试');
  },
  // 通告栏
  actionClick() {
    this.setData({ notice: false })
  },
  // 产品型号选择弹框出现
  productModelShow() {
    this.setData({
      product_model: true
    })
  },
  // 产品型号选择弹框隐藏
  productModelClose() {
    this.setData({
      product_model: false
    })
  },
  // 套餐切换
  radioChange(e) {
    this.setData({
      pro_select_name: e.detail.value
    })
    this.data.model_list.forEach((item) => {
      if (item.specs_names == e.detail.value) {
        this.setData({
          pro_select_img: item.img,
          pro_select_id: item.id,
          pro_price: item.goods_price
        })
      }
    })
  },

  goOrder() {
    let buynow = { ...buynow, ...this.data }; // 用户下单信息缓存
    my.setStorageSync({
      key: 'buynow',
      data: buynow
    })
    my.navigateTo({
      url: './order/order?id=' + this.data.goods_id + '&entry=' + this.data.entry
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

    if (e.scrollTop > this.data.module_top) {
      this.setData({
        module_fixed: true
      })

    } else {
      this.setData({
        module_fixed: false
      })
    }

    if (this.data.selectTabindex == 0 || this.data.selectTabindex == 3) {
      let vm = this;
      my.createSelectorQuery()
        .select('.footer').boundingClientRect()
        .select('.goods-title').boundingClientRect()
        .exec((ret) => {
          if (ret[0] && ret[1]) {
            if (ret[0].top < ret[1].height) {
              this.setData({
                selectTabindex: 3
              })
            } else {
              this.setData({
                selectTabindex: 0
              })
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
  goHome() {
    my.switchTab({
      url: '../rent/rent'
    })
  },

  bannerIndex(e) {//轮播滚动事件
    this.setData({
      current: e.detail.current + 1  //当前滚动的index
    })
  },

})
