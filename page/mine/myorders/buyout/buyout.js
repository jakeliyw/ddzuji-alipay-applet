Page({
  data: {
    order_id: ""
  },
  onLoad(option) {
    this.getMsg(option.order_id)
    this.setData({
      order_id: option.order_id
    })
  },
  getMsg(order_id) {
    getApp().myRequest("/order/buyOutMsg", "post", {
      order_id: order_id
    }).then(res => {
      console.log(res)
    })
  },
  toPay() {
    getApp().myRequest("/order/buyOutSubmit", "post", {
      order_id: this.data.order_id
    }).then(res => {
      my.tradePay({
        tradeNO: res.data.result.trade_no,
        success: res => {
          console.log(res)
        }
      })
    })
  }
});
