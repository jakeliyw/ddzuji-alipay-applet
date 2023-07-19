Page({
  data: {
    couponlist: [],
    isYouHaoHuo: false
  },
  onLoad(options) {
    
  },
  onReady() {


  },
  receive(e) {
    let _cou_kind = e.currentTarget.dataset.cou_kind;
    let _cou_id = e.currentTarget.dataset.cou_id
    let vm = this;
    let app = getApp();
    
  },
  //返回首页
  toHome() {
    if (this.data.is_nice == 1) {
      my.navigateBack({
        delta: 1
      });
    } else {
      my.switchTab({
        url: '../../rent'
      })
    }

  },
});
