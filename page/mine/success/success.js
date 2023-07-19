Page({
  data: {
    is_certifcation: true,
    types: [{
      title_name: "上传成功",
      ms_name: "我们将尽快审核你所上传的信息"
    }, {
      title_name: "实名成功",
      ms_name: "你已完成实名信息认证"
    }, {
      title_name: "归还信息提交成功",
      ms_name: "如约归还后，商家将会完结此订单，押金将自动解冻退还"
    }, {
      title_name: "归还信息提交成功",
      ms_name: "如约归还后，商家将会完结此订单，押金将自动解冻退还"
    }, {
      title_name: "还款成功",
      ms_name: "恭喜你，本次还款已成功！"
    },{
      title_name: "支付成功",
      ms_name: "您已经支付成功！"
    }, {
      title_name: "实名成功",
      ms_name: "你已完成实名信息认证！"
    }],
    typesIndex: 0
  },
  onLoad(opthion) {

    let vm = this;
    console.log("chuan", opthion.typeindex);

    vm.setData({
      typesIndex: opthion.typeindex
    })

  },
  goBack() {

    let vm = this;
    console.log(vm.data.typesIndex);
    if (vm.data.typesIndex == 0) {
      my.navigateBack({
        delta: 2
      });
    } else if (vm.data.typesIndex == 1) {
      my.navigateBack({
        delta: 1
      });
    } else if (vm.data.typesIndex == 2) {
      my.setStorageSync({ //处理订单页面自动刷新缓存
        key: 'isbackorder',
        data: true
      });
      my.navigateBack({
        delta: 2
      });
    } else if (vm.data.typesIndex == 3) {
      my.setStorageSync({  //处理订单页面自动刷新缓存
        key: 'isbackorder',
        data: true
      });
      my.navigateBack({
        delta: 3
      });
    } else if (vm.data.typesIndex == 4) {
      my.setStorageSync({  //处理订单页面自动刷新缓存
        key: 'isbackorder',
        data: true
      });
      my.navigateBack({
        delta: 3
      });
    }else if (vm.data.typesIndex == 5) {
      my.setStorageSync({  //处理订单页面自动刷新缓存
        key: 'isbackorder',
        data: true
      });
      // my.navigateBack({
      //   delta: 3
      // });
      my.navigateTo({
        url: "../myorders/myorders?id=3"
      })
    }else if (vm.data.typesIndex == 6) {//确认订单页面 实名认证
      my.navigateBack({
        delta: 2
      });
    }

  }
});
