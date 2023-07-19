Page({
  data: {
    isEdit: false,//处于编辑/新增页面
    canSwitch: false,//可以设置为默认地址
    isChecked: true,//是否处于默认地址
    id: NaN,//编辑地址的id
    address: {
      province: "",
      city: "",
      region: ""
    },//地址数据
  },
  onLoad(query) {
    console.log("a")
    if (query.type === "edit") {
      my.setNavigationBar({
        title: "编辑收货地址"
      });
      this.setData({
        isEdit: true,
        id: query.id,
        address: JSON.parse(decodeURIComponent(query.address))
      })
    }
  },
  selectCity() {
    if (my.regionPicker) {
      my.regionPicker({
        success: (res) => {
          console.log(res)
          this.setData({
            "address.province": res.data[0],
            "address.city": res.data[1],
            "address.region": res.data[2],
          })
        }
      })
    } else {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });

    }
  },
  changeInput(e) {
    let type = e.target.dataset.type;
    let value = e.detail.value;
    let data = "address." + type;
    this.setData({
      [data]: value
    })

  },
  changeDefault(e) {
    this.setData({
      "address.is_default": e.detail.value ? 1 : 0
    })
  },
  deleteAddress() {
    my.confirm({
      title: '温馨提示',
      content: '是否确定删除地址？',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          getApp().myRequest("/user/deleteAddress", "post", { id: this.data.address.id }).then(res => {
            console.log(res)
            if (res.data.ret_code === 200) {
              my.navigateBack()
            }
          })
        }
      },
    });
  },
  submit() {
    // getApp()
    let addressData = this.data.address;
    if (!addressData.consignee) {
      my.alert({
        title: "姓名不能为空"
      })
      return false
    };
    if (!addressData.consignee_phone) {
      my.alert({
        title: "手机号码不能为空"
      })
      return false
    };
    if (addressData.consignee_phone.length != 11) {
      my.alert({
        title: "手机号码格式不正确"
      })
      return false
    };
    if (!addressData.region) {
      my.alert({
        title: "请选择所在地区"
      })
      return false
    };
    if (!addressData.address) {
      my.alert({
        title: "请填写详细地址"
      })
      return false
    };
    let data = {
      address: JSON.stringify(this.data.address),
      member_id: 3,
      id: this.data.address.id,
      is_default: this.data.address.is_default,
      type: 2
    };
    console.log(data)
    let url = this.data.isEdit ? "/user/updateAddress" : "/user/addAddress"
    getApp().myRequest(url, "post", data).then(res => {
      console.log(res)
      if (res.data.ret_code === 200) {
        my.navigateBack()
      }
    })
  }
})