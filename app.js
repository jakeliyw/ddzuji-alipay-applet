// import compareVersions from 'compare-versions/index.js'
// const { version } = my.getSystemInfoSync()
// if (compareVersions(version, '10.1.85') < 0) {
//   my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
// }

App({
  onLaunch(options) {
    // console.log(options)
    //如果是从第三方链接跳转过来的
    if (options.scene == 1300) {
      // this.getUserInfo( (res)=>{
      //   this.globalData.user_id = res.user_id
      //   // console.log(this.globalData.user_id)
      //   console.log(this.globalData)
      // })
      my.setStorageSync({
        key: 'isOtherApp',
        data: 'isOtherApp'
      });

    }
    // =====
    //uma.init('5d55152c570df31360000802', my);
    if (options.query) {
      // console.log('有没有query', options.query)
      var path = options.query.path;
      var canshu = options.query.id;
      var source = options.query.source;
      if (path) {
        if (path.indexOf("activity") != "-1") {
          // 跳转活动页
          //console.info(path + '?showWhat=' + canshu)
          my.navigateTo({ url: path + '?showWhat=' + canshu });

        } else if (path.indexOf("sorts") != "-1") {

          //console.info(path + '?cate_id=' + canshu)
          // 跳转分类
          my.navigateTo({ url: path + '?cate_id=' + canshu });
        } else {
          console.info(path + '?id=' + canshu)
          // console.log(path + '?id=' + canshu)
          // 跳转详情
          my.navigateTo({ url: path + '?id=' + canshu + '&source=' + source });

        }
      }
    }
    var obj = this;

    if (options.query) {
      // //商品详情
      // this.globalData.goods_id = options.query.goods_id;
      // //订单详情
      // this.globalData.order_id = options.query.order_id;
      // //分类----1级分类
      // this.globalData.cateOne_id = options.query.cate_id;

      var path = options.query.path;
      var canshu = options.query.id;
      var source = options.query.source;
      //商品详情
      this.globalData.goods_id = options.query.goods_id;
      //订单详情
      this.globalData.order_id = options.query.order_id;
      //分类----1级分类
      this.globalData.cateOne_id = options.query.cate_id;

      if (path && source) {
        // 跳转详情
        my.navigateTo({ url: path + '?id=' + canshu + '&source=' + source });
      }
    }

    const updateManager = my.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })

    updateManager.onUpdateReady(function () {
      if (obj.globalData.is_update) {
        my.alert({
          title: '更新提示',
          content: obj.globalData.title + '有新版本啦 快去体验一下',
          buttonText: '我知道了',
          success: () => {
            updateManager.applyUpdate()
          }
        });
      }
    })

  },
  getLocation(user_id) {//获取定位信息
    var that = this;
    my.showLoading();

    my.getLocation({
      type: 0,
      success(res) {
        my.hideLoading();
        my.setStorage({
          key: 'isgetLocation',//是否授权定位信息
          data: true
        });


        my.request({
          url: that.globalData.testUrl + '/Api/user/canGetPosition',
          method: 'POST',
          data: {
            zm_user_id: user_id
          },
          dataType: 'json',
          success: (res1) => {

          }
        });
      },
      fail() {
        that.globalData.get_position = 0;
        my.hideLoading();
      },
    })
  },
  getAuth_base(callback) {
    let obj = this;
    //静默授权、生活号接收消息授权
    my.getAuthCode({
      scopes: 'auth_base', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        if (res.authCode) {
          obj.globalData.authCode = res.authCode;//wxc
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
              callback(res1.data.data.user_id);
            }
          });
        }
      }, fail: (res) => {

      }
    });
  },
  getCode(callback) {//wxc
    //console.log("res")
    let that = this;
    //静默授权、生活号接收消息授权
    my.getAuthCode({
      scopes: 'auth_base', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {

        if (res.authCode) {
          that.globalData.authCode = res.authCode;//wxc
          callback(res.authCode);
        }
      }, fail: (res) => {

      }
    });
  },
  onShow(options) {

    // console.log(options)
    if (!my.canIUse("request")) {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
      return
    }
    let that = this;
    //console.log('onShow1111111111', this.globalData.systemInfo);
    if (options.query) {
      //商品详情
      this.globalData.goods_id = options.query.goods_id;
      //订单详情
      this.globalData.order_id = options.query.order_id;
      //分类----1级分类
      this.globalData.cateOne_id = options.query.cate_id;
      // 用户唯一标识
      this.globalData.user_mark = options.query.user_mark;
    }
    my.getStorage({
      key: 'isgetLocation',
      success: (res) => {
        let _userid = this.globalData.user_id
        if (my.canIUse("getLocation") && (!res.data || res.data == null) && this.globalData.get_position == 1) {
          if (this.globalData.user_id != "") {
            // console.log('appjs198userid:', this.globalData.user_id)
            this.getLocation(this.globalData.user_id);
          } else {
            // console.log('appjs201userid:', this.globalData.user_id, '_userid', _userid)
            this.getAuth_base(function (_userid) {
              this.getLocation(_userid);
            })
          }
        }

      }
    });


  },
  getUserPhone(callback) {
    let obj = this;
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = JSON.parse(res.response).response;
        my.request({
          url: obj.globalData.testUrl + "/Api/order/phoneDecrypt",
          method: 'POST',
          dataType: 'json',
          data: {
            phone_str: encryptedData,
            zm_user_id: obj.globalData.user_id
          },
          success: (res) => {
            // console.log(res)
            obj.globalData.userPhone = res.data.data.phone;
            obj.globalData.userInfo.phone = res.data.data.phone
            my.setStorage({
              key: 'userInfo',
              data: obj.globalData.userInfo,
            });
            callback(res)
          }
        });
      },
      fail: (res) => {
        console.log(1, res)
      },
    });
  },
  getAuthCode(callback) {//授权方法
    var obj = this;
    //静默授权、生活号接收消息授权
    my.getAuthCode({
      scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        if (res.authCode) {
          //获取用户信息
          my.request({
            url: obj.globalData.testUrl + '/Api/user/getUserInfoByAuthCode',
            method: 'POST',
            data: {
              auth_code: res.authCode,
              zm_user_id: obj.globalData.user_id,
              user_mark:  obj.globalData.user_mark,
            },
            dataType: 'json',
            success: (res1) => {
              if (res1.data.status == '1001') {
                obj.globalData.userPhone = res1.data.data.phone;

                my.setStorage({
                  key: 'userInfo',
                  data: {
                    avatar: res1.data.data.avatar,
                    username: res1.data.data.name,
                    phone: res1.data.data.phone,
                    ...res1.data.data
                  },
                });
                obj.globalData.user_id = res1.data.data.user_id;
                return callback(true);
              } else if (res1.data.status == '1002') { //新用户、非法数据
                return callback(false);
              }
            }
          });
        }
      }, fail: (res) => {
        return callback(false);
      }
    });

  },
  getUserInfo(callback) {//主动授权获取用户信息   //
    var obj = this;
    let _user_code = "";
    my.getStorage({
      key: 'user_code',
      success: (res1) => {
        if (res1.data) {
          _user_code = res1.data
          my.getAuthCode({
            scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
            success: (res) => {
              if (res.authCode) {
                //获取用户信息
                //console.log('获取用户授权信息', res);
                my.showLoading()
                my.request({
                  url: obj.globalData.testUrl + '/Api/user/getUserInfoByAuthCode',
                  method: 'POST',
                  data: {
                    auth_code: res.authCode,
                    user_code: _user_code,
                    zm_user_id: obj.globalData.user_id,
                    inviter_id: obj.globalData.inviter_id,
                    user_mark:  obj.globalData.user_mark,
                  },
                  dataType: 'json',
                  success: (res1) => {
                    // console.log('主动授权获取用户信息', res1);
                    if (res1.data.status == '1001') {
                      obj.globalData.phone = res1.data.data.phone;
                      obj.globalData.user_id = res1.data.data.user_id;
                      obj.globalData.userInfo = res1.data.data;

                      return callback(res1.data.data);
                    } else if (res1.data.status == '1002') { //新用户、非法数据
                      return callback(false);
                    }
                  }
                });
              }
            }, fail: (res) => {
              my.hideLoading();
              return callback(false);
            }, complete: (res) => {

            }
          });
        }
      }
    });//获取 user_code 缓存
    // let _user_code = "";
    // if (_code.data) {
    //   _user_code = _code.data;
    // }
    //静默授权、生活号接收消息
  },
  onHide() {
    //uma.pause();
  },
  globalData: {
    //testUrl: 'https://api.ddzuji.cn',//正式
    testUrl: 'https://tapi.ddzuji.cn',//测试
    imgUrl: 'https://img.ddzuji.cn/',//oss 图片域名 
    imgHandle: "?x-oss-process=image/resize,w_750/quality,q_90/format,webp",//oss图片统一处理
    title: "叮咚租机",
    abbreviation: "叮咚租机",
    company: "深圳叮咚租机科技信息有限公司",//公司名 
    companyAddress: "广东省深圳市南山区粤海街道大冲社区大冲一路18号大冲商务中心(三期)3栋32C2",//公司地址
    email: "271721792@qq.com",//公司邮箱
    phone: "19926551640",
    userPhone: "",
    platform: "", //渠道来源
    come_from: "", //用户标识
    rent: {
      innerContent: "本租赁服务由深圳叮咚租机科技信息有限公司提供",//首页页尾提示语
    },
    goodDetail: {
      kf: {
        time: "9:00-18:30",//客服在线时间
        scene: "SCE01049099",
        tntInstId: "xVn_xtxp",
        phoneTitle: "联系叮咚租机",//电话客服下提示语
      },
    },
    appId: '2021002129611863',
    version: '2.2',
    version_new: '2.3',
    version_new2: '2.4',
    device: 'XCX_ZFB',
    signType: 'md5',
    item_id: '',
    goods_id: '', //商品id
    order_id: '', //订单id
    cateOne_id: '', //一级分类
    cateOne_index: '', //一级分类index
    is_gogoods: false,//是否进入商品详情页
    user_id: "",
    authCode: "",//存Code，wxc
    userInfo: {
      phone: ""
    },//用户信息
    is_update: true,//是否提示用户更新
    service_phone: "0755-29898168",//售后电话
    pre_sale_phone: "0755-29898168",//售前电话
    kfPhone: "0755-29898168",//客服电话
    inviter_id: "",//上级用户id
    // is_receive:true, // true标识小程序已经收藏过了，false表示小程序还未收藏 

    //第三方平台跳转过来的信息
    otheruid: "",
    addressId: "",
    /** 用户唯一标识 */
    user_mark: "",
  }
});


