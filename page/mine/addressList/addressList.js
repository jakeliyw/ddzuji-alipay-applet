import { getAddressList } from '/api/address';
import { insetAddress } from '/api/address';
Page({
  data: {
    addressList: [],
    zm_user_id: '',
    id: '',
  },
  onLoad() {
    const zm_user_id = my.getStorageSync({ key: 'zm_user_id' }).data;
    this.setData({
      zm_user_id,
    });
    // this.getAddressListData();
  },
  onShow() {
    this.getAddressListData();
  },
  async getAddressListData() {
    const rst = await getAddressList({
      zm_user_id: this.data.zm_user_id,
    });
    console.log(rst);
    this.setData({
      addressList: rst.data,
    });
  },
  chooseAddress(e) {
    const id = e.target.dataset.id;
    this.setData({
      id
    })
    my.navigateBack();
  },
  edit(e) {
    const item = e.target.dataset.item;
    my.navigateTo({ url: `/page/mine/addAddress/addAddress?id=${item.id}` });
  },
  onUnload() {
    const { globalData } = getApp()
    globalData.addressId = this.data.id
  },
  handleNewAddress() {
    my.getAddress({
      success: async (res) => {
        console.log(res);
        const { address, city, fullname, mobilePhone, prov, area } = res.result;
        if (res.resultStatus == 9000) {
          const params = {
            id: '',
            zm_user_id: this.data.zm_user_id,
            receiver_name: fullname,
            receiver_phone: mobilePhone,
            address: address,
            city_index: '',
            area: prov + city + area,
          };
          await insetAddress(params);
          this.getAddressListData();
        } else {
          console.log('getAddress cancel', JSON.stringify(res));
        }
      },
      fail: (res) => {
        my.navigateTo({ url: '/page/mine/addAddress/addAddress' });
      },
    });
  },
});
