import { insetAddress, delAddress, findAddress } from '/api/address';
import city from '/utils/city';
Page({
  data: {
    systemInfo: null, //系统信息
    id: '0',
    receiver_name: '',
    receiver_phone: '',
    area: '',
    address: '',
    city_index: [],
    cityList: city,
  },
  onLoad(opts) {
    const { id } = opts;
    if (id) {
      this.setData({
        id,
      });
      this.getAddressById();
    }
  },
  async getAddressById() {
    const rst = await findAddress({ id: this.data.id });
    const { receiver_name, receiver_phone, address, city_index, area } =
      rst.data;
    console.log(city_index);
    this.setData({
      receiver_name,
      receiver_phone,
      address,
      area,
      city_index,
    });
  },
  handleValuesChange(value, values) {
    console.log(value, values);
  },
  submit(e) {
    if (!this.data.receiver_name) {
      my.showToast({
        type: 'none',
        content: '请输入收货人姓名！',
        duration: 1000,
      });
      return;
    }
    if (!this.data.receiver_phone) {
      my.showToast({
        type: 'none',
        content: '请输入收货人手机！',
        duration: 1000,
      });
      return;
    }
    let regPhone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
    if (!regPhone.test(this.data.receiver_phone)) {
      my.showToast({
        type: 'none',
        content: '收货人手机格式不正确！',
        duration: 1000,
      });
      return;
    }
    if (!this.data.area) {
      my.showToast({
        type: 'none',
        content: '请选择地区！',
        duration: 1000,
      });
      return;
    }
    if (!this.data.address) {
      my.showToast({
        type: 'none',
        content: '请输入详细地址！',
        duration: 1000,
      });
      return;
    }
    const zm_user_id = my.getStorageSync({ key: 'zm_user_id' }).data;
    insetAddress({
      id: this.data.id ? this.data.id : '',
      zm_user_id,
      receiver_name: this.data.receiver_name,
      receiver_phone: this.data.receiver_phone,
      address: this.data.address,
      city_index: this.data.city_index,
      area: this.data.area,
    }).then(() => {
      my.navigateBack();
    });
  },
  handleNameInput(e) {
    this.setData({
      receiver_name: e.detail.value,
    });
  },
  handlePhoneInput(e) {
    this.setData({
      receiver_phone: e.detail.value,
    });
  },
  handleMailInput(e) {
    this.setData({
      email: e.detail.value,
    });
  },
  handleAddressInput(e) {
    this.setData({
      address: e.detail.value,
    });
  },
  del() {
    my.confirm({
      title: '温馨提示',
      content: '您是否想删除当前收获地址',
      confirmButtonText: '删除',
      cancelButtonText: '暂不',
      success: () => {
        delAddress({
          id: parseInt(this.data.id),
        })
          .then(() => {
            my.navigateBack();
          })
          .catch(() => {
            my.showToast({
              type: 'none',
              content: '删除失败，请稍后重试',
              duration: 1000,
            });
          });
      },
    });
  },
  handleOk(value, selectedOption, e) {
    console.log(value, selectedOption, e);
    this.setData({
      area:
        selectedOption[0].label +
        selectedOption[1].label +
        selectedOption[2].label,
      city_index: value,
    });
  },
});
