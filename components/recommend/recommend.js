var app = getApp();
Component({
  props: {
    goods_id: "",//商品id
    type: 0,// 0 我的页面 1 详情页面 2 下单完成页面,
    recomend_list:[],
    loadText:"",
    scroll:false
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    page:1,
    size:10
  },
  didMount() { // 组件创建完毕时触发
    let app = getApp();
    let vm = this;
    // if (app.globalData.user_id == "") {
    //   app.getAuth_base(function () {
    //     vm.getRecommendGoods();
    //   })
    // } else {
    //   vm.getRecommendGoods();
    // }

  },
  methods: {
    getRecommendGoods() {
      let app = getApp();
      let vm = this;
      // 优惠券
      my.request({
        url: app.globalData.testUrl + '/Api/goods/recommendGoods',
        data: {
          zm_user_id: app.globalData.user_id,
          goods_id: vm.data.goods_id,
          page_size: vm.data.size,
          page: vm.data.page
        },
        method: 'post',
        dataType: 'json',
        success: (res) =>{
          //console.log("热门推荐", res.data);
          if (res.data.status == '1001') {
            let list = [...this.data.recomend_list,...res.data.data];
            vm.setData({
              recomend_list: list
            })
          }
        },
        complete: function (res) {
          my.hideLoading(); //加载结束
        }
      });
    },
    go_mer: function (e) {
      let _type = this.props.type;
      if (_type == 0) {
        my.navigateTo({
          url: "../merchant/merchant?mer_id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      } else if (_type == 1) {
        my.navigateTo({
          url: "../../merchant/merchant?mer_id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      } else if (_type == 2) {
        my.navigateTo({
          url: "../../merchant/merchant?mer_id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      }

    },
    go_kill: function (e) {//秒杀转跳

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
    jump_type: function (e) {
      let _app_id = e.currentTarget.dataset.app_id;//appid
      let _content_url = e.currentTarget.dataset.content_url;//跳转路径
      my.navigateToMiniProgram({
        appId: _app_id,
        path: _content_url,
        success: (res) => {

        },
        fail: (error) => {
          console.log('跳转失败', error);
        }
      })
    },
    to_goods: function (e) {
      let _type = this.props.type;
      if (_type == 0) {
        my.navigateTo({
          url: "../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      } else if (_type == 1) {
        my.navigateTo({
          url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      } else if (_type == 2) {
        my.navigateTo({
          url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id// "./goodsdetail/goodsdetail??id=111"
        })
      }

    }
  },


});