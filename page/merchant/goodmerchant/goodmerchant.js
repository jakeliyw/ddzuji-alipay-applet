var app = getApp();
Page({
  data: {
    merchant: [],//优质店铺列表
    you_mer: [], //推荐
    imgurl: app.globalData.imgUrl
  },
  onLoad() {
    let vm = this;
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    my.request({
      url: app.globalData.testUrl + '/Api/api/RecommendMer',
      method: 'POST',
      success: (res) => {
        //console.log('商家信息', res);

        if (res.data.status == '1001') {
          vm.setData({
            merchant: res.data.data.merchant,
            you_mer: res.data.data.you_mer
          })
        } else if (res.data.status == '1002') {
          console.log("获取失败", res)
        }
      },
      complete: function (res) {
        my.hideLoading();
      }
    });



  },
  go_mer(e) {

    my.navigateTo({
      url: "../merchant?mer_id=" + e.target.dataset.mer_id,
    })

  },
  go_mer_sort(e) {
    my.navigateTo({
      url: "../merchant?mer_id=" + e.target.dataset.mer_id+"&cate_id="+e.target.dataset.cate_id,
    })
  }
});
