var md5Encrypt = require('../../util/md5/md5.js');
let app = getApp()
Page({
  data: {
    appInfo:getApp(),
    baseUrl: '', // 根路径
    imgUr: '', // 图片根路径
    infoCount: {}, // 订单数量
    user_phone: '', // 用户手机号
    avatar_image: "../../image/my-avatar.png",
    kefuisShow: false,//客服弹框
    complaintisShow: false,//申诉反馈
    mall_datas: [{
      img: '../../image/my-yuqi.png',
      txt: '待付款',
      status: 1
    }, {
      img: '../../image/my-post.png',
      txt: '待发货',
      status: 2,
    },
    {
      img: '../../image/my-shouhuo.png',
      txt: '待收货',
      status: 3
    },
    {
      img: '../../image/my-wanjie.png',
      txt: '已完成',
      status: 4
    }],
    order_datas: [{
      img: '../../image/my-fahuo.png',
      txt: '待审核',
      id: 1,
      status: 1
    }, {
      img: '../../image/my-shouhuo.png',
      txt: '待发货',
      status: 3,
      id: 3
    },
    {
      img: '../../image/my-zuyong.png',
      txt: '租用中',
      id: 4,
      status: 4
    },
    {
      img: '../../image/my-yuqi.png',
      txt: '已逾期',
      id: 7,
      status: 7
    },
    {
      img: '../../image/my-wanjie.png',
      txt: '已完成',
      status: 6,
      id: 6
    }
    ],
    server_data: [
      {
      img: '../../image/my-youhui.png',
      txt: '领券中心',
      page: 'myVouchers/myVouchers',
      id: 'card',
      fun:'',
      tag: ''
    }, 
    {
      img: '../../image/my-kefu.png',
      txt: '在线客服',
      id: 'kefu'
    },
    {
      img: '../../image/my-tousu.png',
      page: 'my_feedback/feedback',
      txt: '申诉反馈',
      id: 'feedback'
    },
    {
      img: '../../image/my-help.png',
      page: 'helpcenter/helpcenter',
      txt: '帮助中心',
      id: 'helper'
    }
    ],
    recomend_list: [],
    page:{
      size:10,
      page:1,
      total:0,
      pageSize:0
    },
    scroll: false, //是否滑动页面
    loadText: '加载中...',
    is_getOrder: false,//是否下过订单
    is_certification: false,//是否已经实名
    code_name: "",
    animation: "",
    isHide: false,//页面是否被隐藏
    is_financial: 0,
    is_warrant: 0,
    order_flag: 1,
  },
  onReady() {
    this.animation = my.createAnimation({
      duration: 500
    })
  },
  onRenderSuccess(e){
    console.log('success',e);
  },
  onRenderFail(e){
    console.log('err',e);
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
        success: (res) =>{
          //console.log("热门推荐", res.data);
          if (res.data.status == '1001') {
            let list = [...this.data.recomend_list,...res.data.data.data];
            vm.setData({
              recomend_list: list,
              
              'page.total':res.data.data.total,
              'page.pageSize':Math.ceil(res.data.data.total/vm.data.page.size)
            })
            // console.log(list) 
          }
        },
        
        complete: function (res) {
          my.hideLoading(); //加载结束
        }
      });
      
    },
  translate(_bol) {
    let position = 0;
    if (_bol) {
      position = position + 10
    } else {
      position = position - 10
    }
    if (typeof (this.animation) != "undefined") {
      this.animation.translate(0, position).step()
      this.setData({ animation: this.animation.export() })
    }

  },
  reset() {
    if (typeof (this.animation) != "undefined") {
      this.animation.translate(0, 0).step()
      this.setData({ animation: this.animation.export() })
    }
  },

  // 订单切换
  switchOrder(e) {
    const { target: { dataset } } = e;
    this.setData({
      order_flag: dataset.flag
    })
  },

  //获取优惠券
  getMyVouchers(action) {
    var obj = this;


    //获取用户信息
    my.getStorage({
      key: 'userInfo',
      success: function (result) {
        // console.log(result.data);
        if (typeof (result.data) != 'undefined' && result.data != null) {
          var phone = result.data.phone;

          var voucherParam = {
            version: app.globalData.version,
            device: app.globalData.device,
            signType: app.globalData.signType,
            phone: phone,
          }
          var voucherStr = md5Encrypt.md5(voucherParam);

          // 优惠券
          my.request({
            url: app.globalData.testUrl + 'Api/coupon/couponsList',
            method: 'POST',
            data: {
              version: app.globalData.version,
              device: app.globalData.device,
              signType: app.globalData.signType,
              phone: phone,
              token: voucherStr,
            },
            dataType: 'json',
            success: function (res) {
              if (res.data.status == '1001') {
                var voucherLen = 0;
                for (var i = 0; i < res.data.data.length; i++) {
                  if (res.data.data[i].my_cou_status == "1") {
                    voucherLen += 1;
                  }
                }

                if (voucherLen == 0) {
                  obj.setData({
                    noVoucher: true,
                  });
                }

                for (var j = 0; j < obj.data.listData.length; j++) {
                  if (obj.data.listData[j].event == "myVouchers" && voucherLen > 0) {
                    obj.data.listData[j].isShow = true;
                  } else if (obj.data.listData[j].event == "myVouchers" && voucherLen == 0) {
                    obj.data.listData[j].isShow = false;
                  }
                }

                obj.setData({
                  listData: obj.data.listData,
                });
              } else {
                obj.setData({
                  noVoucher: true,
                });
              }
            },
            complete: function (res) {
              if (action == 'load') {
                my.hideLoading(); //加载结束
              } else if (action == 'pulldown') {
                setTimeout(function () {
                  my.stopPullDownRefresh(); //停止刷新
                }, 1000);
              }
            }
          });
        } else {
          for (var k = 0; k < obj.data.listData.length; k++) {
            if (obj.data.listData[k].event == "myVouchers") {
              obj.data.listData[k].isShow = false;
            }
          }
          if (action == 'load') {
            my.hideLoading(); //加载结束
          } else if (action == 'pulldown') {
            setTimeout(function () {
              my.stopPullDownRefresh(); //停止刷新
            }, 1000);
          }
        }
      },
    });
  },

  onLoad() {
    let vm = this;
    let app = getApp();
    // 
    setTimeout(()=>{
      if (app.globalData.user_id == "") {
      app.getAuth_base(function () {
        vm.getcertification();
      })
    } else {
      vm.getcertification();
    }
    },1000)
    

  },
  onGetAuthorize(res) {//获取基础信息
    let that = this;
    my.getOpenUserInfo({
      fail: (res) => {
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        
        my.setStorageSync({
          key: 'base_userInfo',
          data: userInfo
        });
        that.setData({
          avatar_image: userInfo.avatar
        })
        
      }
    });
  },
  mine_getAuthCode() {
    let vm = this;
    var app = getApp();
    app.getAuthCode(function (res1) {
      if (!res1) {

      } else {
        setTimeout(function () {
          my.getStorage({
            key: 'userInfo', // 缓存数据的key
            success: (res2) => {
              
              //console.log(res2)
              vm.setData({
                avatar_image: (res2.data.avatar == "" ? "../../image/my-avatar.png" : res2.data.avatar),
                user_phone: res2.data.phone
              })
              vm.getmyInfo();
            }
          })
        }, 500)
      }
    });

  },
  getcertification() {//获取实名结果
    let vm = this;
    let app = getApp();

    //是否下过订单
    my.request({
      url: app.globalData.testUrl + '/Api/order/is_getOrder',
      method: 'get',
      data: {
        zm_user_id: app.globalData.user_id
      },
      success: (res) => {
        
        //console.log("是否下单",res)
        if (res.data.status == '1001') {
          vm.setData({
            is_financial: res.data.data.is_financial,
            is_warrant: res.data.data.is_warrant,
            code_name: res.data.data.user_name,
          })
          //是否已经实名
          my.request({
            url: app.globalData.testUrl + '/Api/order/is_certification',
            method: 'get',
            data: {
              zm_user_id: app.globalData.user_id
            },
            success: (res) => {
              //console.log("是否实名认证",res);
              if (res.data.status == '1001') {
                vm.setData({
                  is_getOrder: true,
                  is_certification: true
                })
              } else {
                let _bol = true;
                let _second = 0;
                let sss = setInterval(() => {
                  if (_second == 3) {

                    clearInterval(sss);
                    vm.reset();
                    return;
                  }
                  vm.translate(_bol);
                  _bol = !_bol;
                  _second += 0.5
                }, 500)


                vm.setData({
                  is_getOrder: true,
                  is_certification: false
                })
              }
            }
          })
        } else {
          // vm.setData({
          //   is_getOrder: false
          // })
          vm.setData({
            is_getOrder: true
          })
          //  is_getOrder:false,//是否下过订单
          //  is_certification:false,//是否已经实名
        }
      }
    })
  },
  onHide() {
    // 页面隐藏
    this.setData({
      isHide: true
    })

  },

  onShow() {
    
    let vm = this;
    let app = getApp();


    if (vm.data.isHide) {
      vm.getcertification();
    }
    // console.log("onshow")
    my.getStorage({
      key: 'userInfo', // 缓存数据的key
      success: (res) => {
        if (res.data == null) {
          vm.mine_getAuthCode();
        } else {
          vm.setData({
            avatar_image: (res.data.avatar == "" ? "../../image/my-avatar.png" : res.data.avatar),
            user_phone: res.data.phone
          })

        }
      },
      fail: (err) =>{
        console.log('--err--')
      }
    })
    my.getStorage({
      key: 'base_userInfo', // 缓存数据的key
      success: (res) => {
        if (res.data != null) {
          vm.setData({
            avatar_image: (res.data.avatar == "" ? "../../image/my-avatar.png" : res.data.avatar)
          })

        }
      }
    })


    if (app.globalData.user_id != '') {
      // console.log('11',app.globalData.userInfo.user_id,app.globalData.user_id,app.globalData.userInfo)
      vm.getmyInfo(app.globalData.user_id);
    } else {
      console.log('22')
      app.getAuth_base(function (user_id) {//静默获取user_id
        vm.getmyInfo(user_id);
      })
    }


    vm.setData({
      // baseUrl: app.globalData.testUrl,
      testUrl: app.globalData.testUrl,
      imgUr: app.globalData.imgUrl,
      recomend_list: [],
      page:{
        pageSize:0,
        size:10,
        page:1,
        total:0
      }
    })
    this.getRecommendGoods();
  },

  getmyInfo(user_id) {
    let vm = this;
    let app = getApp();
    // console.log(vm.data.user_phone,user_id)
    // 获取优惠券与待发货数量
    my.request({
      url: app.globalData.testUrl + '/Api/my/myInfo',
      method: 'POST',
      data: {
        user_phone: vm.data.user_phone,
        user_id: user_id ? user_id : ''
      },
      success: (res) => {
        //console.log('列表', res);
        if (res.data.status == '1001') {
          let _order_data = []; // 租机订单
          let _mall_data = []; // 商城订单
          for (let item of vm.data.order_datas) {
            for (let item1 of res.data.data.order_count) {
              if (item1.order_status == item.status) {
                item.tag = item1.number;
              }
              if (item1.order_status == 0) {
                item.tag = false;
              }
            }
            _order_data.push(item);
          }
          for (let item of vm.data.mall_datas) {
            for (let item1 of res.data.data.hidden_goods) {
              if (item1.status == item.status) {
                item.tag = item1.num;
              }
              if (item1.status == 0) {
                item.tag = false;
              }
            }
            _mall_data.push(item);
          }

          let _server_data = this.data.server_data;
          _server_data[0].tag = res.data.data.cou_coupon_count;
          vm.setData({
            order_datas: _order_data,
            server_data: _server_data,
            mall_datas: _mall_data
          })

        }
      }
    });
  },
  // 跳转到订单列表
  toOrderList(e) {
    //console.log('e', e);
    let id = e.target.dataset.id;

    // console.log('点击', id);
    my.navigateTo({
      url: './myorders/myorders?id=' + id,
    });
  },
  toHiddenOrderList(e) {
    let id = e.target.dataset.status;

    // console.log('点击', id, status);
    my.navigateTo({
      url: '../buynow/myorder/myorder?id=' + id,
    });
  },
  toAllList(e) {//全部订单
    if (this.data.order_flag == 1) {//租机订单
      my.navigateTo({
        url: './myorders/myorders'
      });
    }
  },
  toServer(e) {
    // console.log('id', e.target.dataset.id);
    let id = e.target.dataset.id;
    if (id == 'kefu') {
      return
      // });
    } else if (id == "feedback") {

      this.showcomplaint();
    }else if(id == 'card'){
      my.navigateTo({
        url: "/page/rent/coupon/coupon",
      });
    }else {
      let url = e.target.dataset.url;
      my.navigateTo({
        url: url
      });
    }
  }, onPullDownRefresh(e) {//下拉刷新监听事件
    my.stopPullDownRefresh()

  },
  uploadCodeImg(e) {//转跳实名认证页面
    let vm = this;
    let app = getApp();
    if (vm.data.is_certification) {//已实名
      my.navigateTo({
        url: 'upload_codeImg/upload_codeImg?codeName=' + vm.data.code_name + "&is_financial=" + vm.data.is_financial + "&is_warrant=" + vm.data.is_warrant + "&t=1",

      });
    } else {//未实名
      my.navigateTo({
        url: 'upload_codeImg/upload_codeImg?codeName=' + vm.data.code_name + "&is_financial=" + vm.data.is_financial + "&is_warrant=" + vm.data.is_warrant + "&t=0",

      });
    }


  },
  pingTaiPhone() {//平台客服
    let app = getApp();
    my.makePhoneCall({
      number: app.globalData.service_phone,
    });
  },
  pre_sale_phone() {//售前客服
    let app = getApp();
    my.makePhoneCall({
      number: app.globalData.pre_sale_phone,
    });
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
  closecomplaint() {
    this.setData({
      complaintisShow: false
    })
  },
  showcomplaint() {
    this.setData({
      complaintisShow: true
    })
  },
  tocomplaint() {
    this.setData({
      complaintisShow: false
    })
    my.navigateTo({
      url: "my_feedback/feedback"
    });
  }
  
})
