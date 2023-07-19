Page({
  data: {
    showUrl: "",
    canUse: true,
  },
  onLoad(options) {
    // console.log('onLoad', options)
    // my.alert({ content: JSON.stringify(options) });
    let app = getApp()
    // app.globalData.platform = 'platform'
    // app.globalData.come_from = 'come_from'
    if (options.platform) {
      app.globalData.platform = options.platform
    }
    if (options.come_from) {
      app.globalData.come_from = options.come_from
    }
    if (my.canIUse('web-view')) {
      this.setData({
        canUse: true
      });
    } else {
      this.setData({
        canUse: false
      });
    }
    // const { showUrl } = options;
    this.data.showUrl = 'https://www.ddzuji.cn/topic/alipay/h5/new_web_view/index.html';
    // this.data.showUrl = 'http://192.168.1.91:8080/';
    app.getAuth_base(function () {})
  },
  onMessage(e) {
    console.log(e);
  }
});
