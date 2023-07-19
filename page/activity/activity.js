Page({
  data: {
    showWhat: "rentProcedure",
    random: 2019010901,
    canUse: false,
    address: '',
    is_skip: false, // 判断address这个参数存在并且不为null的时候跳转,
    skip_url: '', // 跳转到活动页的路径
    user_id: "",//用户userid
    isNew: '',//是否是新活动页面
    h5HTMLname: '',
    appInfo:getApp(),
    source: "",//活动来源
  },
  onLoad(option) {
    this.setData({
      h5HTMLname: option.h5HTMLname,
      isNew: option.isNew,
      showWhat: option.showWhat,
    });

    if (option.source) {//记录h5来源
      this.setData({
        source: option.source
      })
      my.setStorageSync({
        key: 'h5source',
        data: option.source
      });
    } else {
      my.removeStorageSync({
        key: 'h5source'
      });
    }

    this.webViewContext = my.createWebViewContext('webView');

    if (my.canIUse('web-view')) {
      this.setData({
        canUse: true
      });
    } else {
      this.setData({
        canUse: false
      });
    }

  },
  // 接收来自H5的消息
  onMessage(e) {
    let _navigateid = e.detail.navigateid;

    if (_navigateid == 1) {
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=77700148&query=tabId%3Drent'
      })

    }else if (_navigateid == 17) {//向h5 传递userid
      let app = getApp();
      let vm = this;
      if (app.globalData.user_id != '') {//是否已经获取到userid
        vm.webViewContext.postMessage({
          'zm_user_id': app.globalData.user_id
        });
      } else {
        app.getAuth_base(function (user_id) {//调用静默授权获取userid
          vm.webViewContext.postMessage({
            'zm_user_id': user_id
          });
        })
      }
    } else if (_navigateid == 18) {//存入storage

      let _toast = e.detail.data;
      my.setStorage({
        key: 'number',
        data: _toast,
        success: function () {
        }
      });
    } else if (_navigateid == 19) {//获取storage
      let vm = this;
      let res = my.getStorageSync({ key: 'h5source' });
      vm.webViewContext.postMessage({
        'data': res
      });
    }
  },


});
