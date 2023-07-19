Component({
  mixins: [],
  data: {
    // hoverIndex: 0,
    bcPic: ["2020082614324688657.png", "2020082614320154169.png", "2020082614322242287.png", "2020082614312997953.png"],
    imgUrl: getApp().globalData.imgUrl,
  },
  props: {
    goods_id: "",//商品id
    is_index: 1,//1 首页专属推荐 0 详情页专属推荐
    cate_pid: "",//分类父id, 商品详情页返回，当is_index=0是必填
    currentIndex: 0,//当前轮播
    titleList: ["学生专区", "商务必备", "设计无忧", "畅爽竞技"],
    background: "", //背景样式
    exclusive_list:[]
  },
  didMount() {
    let app = getApp();
    let vm = this;
    // if (app.globalData.user_id == "") {
    //   app.getAuth_base(function () {
    //     vm.getExclusive(vm.props.is_index);
    //   })
    // } else {
    //   vm.getExclusive(vm.props.is_index);
    // }

  },

  didUpdate() { },
  didUnmount() { },
  methods: {
    getExclusive(index) {
      let app = getApp();
      let vm = this;
      // 优惠券
      my.request({
        url: app.globalData.testUrl + '/Api/most/exclusiveList',
        method: 'get',
        data: {
          zm_user_id: app.globalData.user_id,
          goods_id: vm.props.goods_id,
          cate_pid: vm.props.cate_pid,
          is_index: index
        },
        dataType: 'json',
        success: function (res) {
          //console.log("专属推荐", res.data);
          if (res.data.status == '1001') {

            vm.setData({
              exclusive_list: res.data.data
            })
          }
        },
        complete: function (res) {
          my.hideLoading(); //加载结束

        }
      });
    },
    to_goods: function (e) {//跳转商品详情
      let _is_index = this.props.is_index;
      this.record_Hits(2, e.currentTarget.dataset.id);
      if (_is_index == 0) {
        my.navigateTo({
          url: "../goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id
        })
      } else if (_is_index == 1) {
        my.navigateTo({
          url: "../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.id
        })
      }
    },
    checkTitle(e) {
      this.setData({
        currentIndex: e.target.dataset.index
      })
    },
    swiperChange(e) {
      // console.log(e.detail)
      this.setData({
        currentIndex: e.detail.current
      })
    },

    record_Hits(type, goods_id) {//记录模块点击量
      let app = getApp();
      let vm = this;
      if (app.globalData.user_id == "") {
        app.getAuth_base(function () {
          vm.record_HitsRequest(type, goods_id);
        })
      } else {
        vm.record_HitsRequest(type, goods_id);
      }

    },
    record_HitsRequest(type, goods_id) {
      let app = getApp();
      my.request({
        url: app.globalData.testUrl + '/Api/most/addBrowseRecords',
        method: 'get',
        data: {
          zm_user_id: app.globalData.user_id,
          goods_id: goods_id || '',
          mode_type: type,//1=新品速报 2=热门活动 3=专属推荐 4=热租榜
        },
        dataType: 'json',
        success: function (res) {
          //console.log('首页数据', res);
          if (res.data.status == '1001') {

          } else {

          }
        }
      })
    },
  },
});
