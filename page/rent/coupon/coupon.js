Page({
  data: {
    systemInfo: null,//系统信息
    cou_list: [
    ],//优惠券列表数据
    params: [
      {
        activityId: '2022120800826004713920122076',
        outBizNo: '5b8f5511256eedf7710ef90af1dc864e',// 导码模式商家券
      },
      {
        activityId: '2022120800826004713920121708',
        outBizNo: 'af86fcc3ba49ce7cc2cb8a44f11d5c6e',
      },
    ],
    senderMerchantId: '',
    dialogBtnType: 0,
    dialogBtnStyle: {
      color: '#000',
      borderColor: 'yellowgreen',
      backgroundColor: 'yellowgreen',
    },
    butActive: true,
  },
  onmessage(e) {
    my.alert({
      content: '拿到数据' + JSON.stringify(e), // alert 框的标题
    });
  },
  onGetCouponSuccess(resultList, { extraData }) {
    console.log('触发了 onGetCouponSuccess 事件')
    console.log('成功返回结果: ', resultList)
  },
  onGetCouponFail(result, { extraData }) {
    console.log('触发了 onGetCouponFail 事件')
    console.log('失败返回结果: ', result)
  },
  onUseImmediately(event, { extraData }) {
    console.log('触发了 onUseImmediately 事件')

    // // 可以跳转到自定义的页面
    // my.navigateTo({
    //   url: '/pages/goods-detail/index',
    // })
  },
  onClose(event, { extraData }) {
    this.requestVoucherList()
    console.log('触发了 onClose 事件')
  },
  onLoad() {
    my.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
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
          obj.globalData.authCode = res.authCode;//wxc
          // console.log(res.authCode);
          // return;
          my.request({
            url: obj.globalData.testUrl + '/Api/user/getUserInfoByAuthCodeB',
            method: 'POST',
            data: {
              auth_code: res.authCode,
              user_mark:  obj.globalData.user_mark,
            },
            dataType: 'json',
            success: (res1) => {
              if (!res1.data) {
                return false
              }
              console.log("静默授权", res1)
              obj.globalData.user_id = res1.data.data.user_id;
              // callback(res1.data.data.user_id);
              vm.requestVoucherList()
            }
          });
        }
      }, fail: (res) => {

      }
    });
  },
  getBut() {
    this.setData({
      butActive: true
    })
    this.requestVoucherList()
  },
  getButs() {
    this.setData({
      butActive: false
    })
    this.requestVoucherLists()
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
  // 获取领取中心优惠卷列表
  requestVoucherList() {
    let vm = this
    let app = getApp()
    my.showLoading({
      content: '加载中'
    })
    vm.setData({
      cou_list: []
    })

    my.request({
      url: app.globalData.testUrl + '/api/voucher/receiveVoucherCenter',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id,
      },
      dataType: 'json',
      success: function (res) {
        let list = res.data.data
        list.forEach((item, index) => {
          item.uuid = new Date().getTime() + '' + index
        })
        vm.setData({
          cou_list: list
        })
        //领取优惠卷需要唯一值

        // console.log(vm.data.cou_list);
        my.hideLoading()
      }
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
      url: app.globalData.testUrl + '/api/voucher/getUserVoucherList',
      method: 'POST',
      data: {
        zm_user_id: app.globalData.user_id,
      },
      dataType: 'json',
      success: function (res) {
        vm.setData({
          cou_list: res.data.data.list
        })
        my.hideLoading()
      }
    })
  },
  jump_tap(e) {
    // my.navigateToMiniProgram(e.currentTarget.dataset.obj)
    my.switchTab({
      url: '/page/rent/rent'
    })
  },
})