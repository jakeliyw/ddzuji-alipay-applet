Page({
  data: {
    systemInfo: null,//系统信息
    tap_role_index: -1, //点击的使用规则说明
    nousefilter: [],//优惠券列表数据
  },
  onLoad(query) {
    this.setData({
      systemInfo: my.getSystemInfoSync(),
    });
    let app = getApp();
    let vm = this;
    if (app.globalData.user_id == "") {
      app.getAuth_base(function () {
        // 调用获取优惠券
        vm.requestVoucherList();
      })
    } else {
      // 调用获取优惠券
      vm.requestVoucherList();
    }

  },
  // 获取优惠券列表
  requestVoucherList() {
    let vm = this;
    let app = getApp();

    // 请求优惠券列表
    my.request({

      url: app.globalData.testUrl + '/Api/most/couponList',
      method: 'get',
      data: {
        zm_user_id: app.globalData.user_id
      },
      success: (res) => {
        //console.log('优惠券', res.data.data);

        let _nousefilter=res.data.data.filter((arr)=>{
          
          return arr;
        })

        my.hideLoading();
        if (res.data.status == '1001') {

          vm.setData({
            nousefilter: res.data.data || []
          })
        }
      }
    });

  },
  rule_explain(e) {//点击使用规则说明
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

    let _type = e.currentTarget.dataset.jump_type,//跳转类型
      _app_id = e.currentTarget.dataset.app_id,//appid
      _content_url = e.currentTarget.dataset.content_url,//跳转路径
      _cou_id = e.currentTarget.dataset.cou_id,//优惠券id
      _telmp_id = e.currentTarget.dataset.telmp_id;//模板id

    if (_type == 0) {//内部页面跳转

      if (_content_url.indexOf("cate_id") >= 0) {
        my.setStorageSync({
          key: 'cate_id',
          data: {
            cate_id: _content_url.split("=")[1]
          },
          success: function () { }
        });

        my.switchTab({
          url: '../sorts/sorts',
          success: () => {
          }
        })
      } else {
        my.navigateTo({
          url: _content_url// "./goodsdetail/goodsdetail??id=111"
        })
      }

    } else if (_type == 1) {//跳转其他小程序
      my.navigateToMiniProgram({
        appId: _app_id,
        path: _content_url,
        success: (res) => {

        },
        fail: (error) => {
          console.log('跳转失败', error);
        }
      })

    } else if (_type == 2) {//会员有礼优惠券领取
      my.navigateToMiniProgram({
        appId: '2018122762703259',//会员有礼小程序AppID
        extraData: {
          //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
          templateId: _telmp_id,
          //对应模板配置的小程序AppID
          appId: '2018031602387571'
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

    } else if (_type == 3 || _type == 6 || _type == 4) {//收藏有礼优惠券领取
      if (_cou_id) {
        let app = getApp();
        let vm = this;
        // 优惠券
        my.request({
          url: app.globalData.testUrl + '/Api/most/receiveCoupon',
          method: 'get',
          data: {
            zm_user_id: app.globalData.user_id,
            coupon_id: _cou_id
          },
          dataType: 'json',
          success: function (res) {
            //console.log("专属推荐", res.data);
            if (res.data.status == '1001') {
             vm.requestVoucherList();
            }
          },
          complete: function (res) {
            my.hideLoading(); //加载结束
          }
        });
      }
      my.navigateToMiniProgram({
        appId: '2018122562686742',
        path: 'pages/index/index?originAppId='+app.globalData.appId+'&newUserTemplate=' + _telmp_id
      });

    }

  },
  goSort() {//分类
    my.switchTab({
      url: '../sorts/sorts'
    })
  }
});
