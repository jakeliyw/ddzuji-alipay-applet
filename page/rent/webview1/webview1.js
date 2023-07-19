Page({
  data: {
    showUrl: "",
    canUse: true,
  },
  onLoad(options) {
    // if (my.canIUse('web-view')) {
    //   this.setData({
    //     canUse: true
    //   });
    // } else {
    //   this.setData({
    //     canUse: false
    //   });
    // }
    // const { showUrl } = options;
    this.data.showUrl = 'https://www.ddzuji.cn/topic/alipay/h5/zuershouphone/index.html';
    // this.data.showUrl = 'http://192.168.0.184:8080/';
  },
  onMessage(e) {
    console.log(e);
  }
});
