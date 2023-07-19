Page({
  data: {
    addressList: []
  },
  onLoad() {
  },
  onShow() {
    this.getAddress()
  },
  // 获取用户实名信息
  getUserReal() { },
  // 获取支付宝收货地址et
  getAddress() {
    my.showLoading()
    getApp().myRequest("/user/getUserAddress", "get").then(res => {
      this.setData({
        addressList: res.data.result
      })
    })
  },
  getAliAdd() {
    if (my.canIUse('getAddress')) {
      my.getAddress({
        success: (res) => {
          my.hideLoading();
          if (res.resultStatus === "6001") {
            // 用户取消授权获取收货地址
            return
          } else if (res.resultStatus === "9000") {
            let data = JSON.stringify(res.result);
            // getApp().myRequest("/user/addAddress", "post", { address: data, member_id: 10, type: 1 }).then(res => {
            getApp().myRequest("/user/addAddress", "post", { address: data, type: 1 }).then(res => {
              if (res.data.ret_code === 200) {
                this.getAddress()
              }
            })
          }
        }
      })
    } else {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
    }
  },
  // 新增/编辑地址
  toEditAdd(e) {
    let type = e.target.dataset.type;
    let id = e.target.dataset.id;
    let query = {};
    if (id) {
      console.log(this.data.addressList)
      this.data.addressList.forEach(item => {
        if (item.id === id) {
          query = item
        }
      })
      query = encodeURIComponent(JSON.stringify(query))
      console.log(query)
    }
    my.navigateTo({ url: 'edit-address/edit-address?type=' + type + "&id=" + id + "&address=" + query })
  },
  // 选择收货地址
  selectAdd(e) {
    my.setStorageSync({
      key: 'shopAdd',
      data: this.data.addressList[e.target.dataset.index]
    });
    my.navigateBack()
  }
});
