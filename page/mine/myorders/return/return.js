Page({
  data: {
    imgUrl: '',
  },
  onLoad() {
    var app = getApp();
    this.setData({
      imgUrl: app.globalData.imgUrl,
    })
  },
});
