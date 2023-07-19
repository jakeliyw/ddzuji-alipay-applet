var app = getApp();
Page({
  data:{
    order_id: '',
    userid: '',
    goods_id: '',
    entry: ''
  },
  onLoad(query) {
    this.setData({
      order_id: query.order_id,
      userid: query.userid,
      goods_id: query.goods_id,
      entry: query.entry,
    })
  },
  viewOrder() {
    my.navigateTo({
      url: '../order-status/status?order_id='+this.data.order_id+'&userid='+this.data.userid+'&goods_id='+this.data.goods_id+'&entry='+this.data.entry
    });
  },
  goIndex() {
    my.switchTab({
      url: '../../rent/rent'
    })
  }
})