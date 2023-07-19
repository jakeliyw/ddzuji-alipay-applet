Page({
  data: {
    tabs: [{
      title: '未使用',
      id:1
    },
    {
      title: '已使用',
      id:2
    },
    {
      title: '已过期',
      id:3
    }
    ],
    status:1,
    nouse: [],
    activeTab: 0,
    con_height: 0, // tab栏切换内容的高度
    user_phone: '', // 用户手机号
    voucher_status: 1, // 优惠券状态  1：未使用，2：已使用
    pageData: {
      page: 1,
      pageSize: 10
    },
    is_guoqi: '',
    tap_role_index: -1, //点击的使用规则说明
    expiring_count: false,//即将过期个数
    move_StartX: 0,//触摸开始位置 X轴
    move_StartY: 0,//触摸开始位置 Y轴
  },
  handleTabClick(e) {
    // console.log('点击',e)
    let vm = this;
    let index = e.index;
    let id = e.currentTarget.dataset.id
    this.setData({
      activeTab: index,
      status:id,
      tap_role_index: -1
    });

    this.setCouponList(id);


  },
  setCouponList(index) {//修改优惠券列表数据

    let vm = this;
    // 未使用
    if (index == 1) {

      vm.setData({
        nousefilter: vm.data.nouse.no_use || [],
        voucher_status: 1,
        is_guoqi: false
      })
    } else if (index == 2) {

      vm.setData({
        nousefilter: vm.data.nouse.expiring_soon || [],
        voucher_status: 2,
        is_guoqi: true
      })
      if (vm.data.expiring_count > 0) {//即将过期个数更改
        vm.readExpiring();
      }

    } else if (index == 3) {
      vm.setData({
        nousefilter: vm.data.nouse.used || [],
        voucher_status: 3,
        is_guoqi: true
      })
    }
  },
  handleTabChange({index}){
    this.setData({
      activeTab: index,
    });
  },
  onShow() {
    let vm = this;
    var app = getApp();
    vm.setData({
      testUrl: app.globalData.testUrl
    })
    // 调用获取优惠券
    vm.requestVoucherList(vm.data.tabs[0].id);
    // 当前页面的高度
    my.getSystemInfo({
      success:(res)=>{
        let winHeight = res.windowHeight
        let tabHeight = 42;
        my.createSelectorQuery()
          .select('.am-tabs-bar').boundingClientRect()
          .exec((ret) => {
            if (ret[0].height) {
              tabHeight = ret[0].height;
            }
          })
        vm.setData({
          con_height: winHeight - tabHeight
        });
      }
    });
  },
  onLoad() {
    let vm = this;
    let app = getApp();
  },

  readExpiring() {//即将过期优惠券列表点击
    let app = getApp();
    let vm = this;
    my.request({
      url: app.globalData.testUrl + '/Api/coupon/ReadExpiring',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id
      },
      success: (res) => {

        vm.setData({
          expiring_count: 0
        })
      }
    });
  },
  // 获取优惠券列表
  requestVoucherList(id) {
    let vm = this;
    let app = getApp();
    // 请求优惠券列表
    my.request({
      url: app.globalData.testUrl + '/Api/my/myCouponList',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id,
        cou_status:id
      },
      success: (res) => {
        //console.log('优惠券', res.data.data);

        my.hideLoading();
        if (res.data.status == '1001') {

          vm.setData({
            nousefilter: res.data.data.no_use || [],
            nouse: res.data.data,
            expiring_count: res.data.data.expiring_count
          })
        }
      }
    });

  },
  goReceive() {//去领取

    // my.navigateTo({
    //   url: "../../rent/receiveCoupon/receiveCoupon"
    // })
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
  onTouchStart(e) {//触摸动作开始

    let client = e.changedTouches[0];
    this.setData({
      move_StartX: client.clientX,
      move_StartY: client.clientY
    })
  },
  onTouchEnd(e) {//触摸动作结束

    let clientX = e.changedTouches[0].clientX,
      clientY = e.changedTouches[0].clientY;
    let distanceX = clientX - this.data.move_StartX;//移动距离 X
    let distanceY = clientY - this.data.move_StartY;//移动距离 Y

    if (distanceY < 30 || -distanceY < 30) {//Y轴移动距离偏差不能大于40
      if (-distanceX > 120) {//向右滑动

        if (this.data.activeTab < 2) {
          let a_tab = this.data.activeTab + 1;

          this.setData({
            activeTab: a_tab,
            tap_role_index: -1
          });
          this.setCouponList(a_tab);
        }

      } else if (distanceX > 120) {//向左滑动

        if (this.data.activeTab > 0) {
          let a_tab = this.data.activeTab - 1;

          this.setData({
            activeTab: a_tab,
            tap_role_index: -1
          });
          this.setCouponList(a_tab);
        }
      }
    }

  }
});
