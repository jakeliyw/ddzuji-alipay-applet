var app = getApp();
Component({
  props: {
    goods_list: [],//商品列表数据
    type: 0,// 0 我的页面 1 详情页面 2 下单完成页面
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    imgHandle: getApp().globalData.imgHandle,
  },
  didMount() { //组件创建完毕时触发
  },
  methods: {
    go_kill: function (e) {
      my.navigateToMiniProgram({
        appId: app.globalData.appId,
        path: e.currentTarget.dataset.url,
        success: (res) => {

        },
        fail: (error) => {
          //console.log('跳转失败', res);
        }
      })
    },
    to_goods: function (e) {//跳转商品详情
      let _type = this.props.type;
      if (_type == 0) {
        my.navigateTo({
          url: "../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id
        })
      } else if (_type == 1) {
        my.navigateTo({
          url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id
        })
      } else if (_type == 2) {
        my.navigateTo({
          url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id
        })
      }
    },
    go_mer: function (e) {//跳转商户页面
      let _type = this.props.type;
      if (_type == 0) {
        my.navigateTo({
          url: "../merchant/merchant?mer_id=" + e.currentTarget.dataset.id
        })
      } else if (_type == 1) {
        my.navigateTo({
          url: "../../merchant/merchant?mer_id=" + e.currentTarget.dataset.id
        })
      } else if (_type == 2) {
        my.navigateTo({
          url: "../../merchant/merchant?mer_id=" + e.currentTarget.dataset.id
        })
      }

    },
  },


});