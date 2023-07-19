Page({
  data: {
    user_phone: "",//用户收货手机号
    express: "",//快递
    exp_number: "",//快递单号
    express_infos: [],//快递信息
    isexpress_infos: true,//是否有快递信息
  },
  onLoad(option) {
    let app = getApp();
    let vm = this;
    let api = '';
    let params = { order_id: option.order_id };
    if (option.userid) {
      api = '/Api/hidden/express';
      params.zm_user_id = option.userid
    } else {
      api = '/Api/order/queryExpress'
    }

    my.request({
      url: app.globalData.testUrl + api,
      method: 'POST',
      data: params,
      dataType: 'json',
      success: function (res) {
        if (res.data.status == "1001") {
          let _express_infos = [];
          if (res.data.data.express_data && res.data.data.express_data.status == 200) {
            _express_infos = res.data.data.express_data.data.filter((arr) => {
              arr.time_minute = arr.time.split(" ")[1].substring(0, 5);
              arr.time_date = arr.time.split(" ")[0].replace(/\-/g, ".");
              arr.context = vm.getContexts(arr.context);
              return arr;
            })
          } else if (option.userid && res.data.data.data.status == 200) {
            _express_infos = res.data.data.data.data.filter((arr) => {
              arr.time_minute = arr.time.split(" ")[1].substring(0, 5);
              arr.time_date = arr.time.split(" ")[0].replace(/\-/g, ".");
              arr.context = vm.getContexts(arr.context);
              return arr;
            })
          } else {
            vm.setData({
              isexpress_infos: false
            })
          }
          vm.setData({
            express_infos: _express_infos,
            express: option.userid ? res.data.data.express : res.data.data.express.express,
            exp_number: option.userid ? res.data.data.number : res.data.data.express.exp_number,
          })


        } else if (res.data.status == "1002") {
          vm.setData({
            isexpress_infos: false
          })
        }
      },
      fail: function (res) {
        vm.setData({
          isexpress_infos: false
        })
      },
      complete: function (res) {

      }
    });
  },
  getContexts(text) {
    let _text = text;
    var value = text.replace(/[^0-9]/ig, "");
    let _contexts = [text];
    let _returnC = [];
    if (value.length == 11) {
      _contexts = text.split(value);
      _returnC.push(_contexts[0]);
      _returnC.push(value);
      _returnC.push(_contexts[1]);
    } else {
      _returnC.push(text);
    }

    return _returnC;
  },
  //复制快递单号
  copyNum(e) {
    let vm = this;
    my.setClipboard({
      text: vm.data.exp_number,
      success: function (e) {
        my.showToast({
          type: 'none',
          content: '复制成功',
          duration: 1200,
          success: () => {
          },
        });
      }
    });
  },
  call(e) {//点击拨打电话
    let _phone = e.currentTarget.dataset.phone;

    if (_phone == "") {
      return;
    }
    my.makePhoneCall({
      number: _phone,
    });
  },

});
