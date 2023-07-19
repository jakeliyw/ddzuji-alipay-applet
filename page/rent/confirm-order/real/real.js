Page({
  data: {
    name: "",
    id_card: "",
    is_tap: false, //是否可以点击
    zfb_phone: "", //支付宝绑定的手机号码
    is_skip_face_auth: null
  },
  onLoad(e) {
    let vm = this
    vm.setData({
      is_skip_face_auth: e.is_skip_face_auth
    })
    console.log(vm.data.is_skip_face_auth);
    let app = getApp();
    this.setData({
      zfb_phone: app.globalData.userPhone
    })

  },
  bindNameInput(e) {

    this.setData({
      name: e.detail.value
    });

    this.setData({
      is_tap: (this.data.name != "" && this.data.id_card != "") ? true : false
    });
  },
  bindIdInput(e) {

    this.setData({
      id_card: e.detail.value
    });

    this.setData({
      is_tap: (this.data.name != "" && this.data.id_card != "") ? true : false
    });

  },
  bindPhoneInput(e) {
    this.setData({
      zfb_phone: e.detail.value
    });

    this.setData({
      is_tap: (this.data.name != "" && this.data.id_card != "") ? true : false
    });
  },
  authentication() { //认证
    //console.log("认证")
    let app = getApp();
    let vm = this;

    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    if (vm.data.is_skip_face_auth=='0') {
      my.request({ 
        // url: app.globalData.testUrl + '/Api/user/Faceauth',
        url: app.globalData.testUrl + '/Api/user/Faceauth',
        method: 'POST',
        data: {
          user_name: vm.data.name,
          user_idcard: vm.data.id_card
        },
        dataType: 'json',
        success: function (res) {
          //console.log('成功', res.data);
          let _info = res.data.data;
          if (res.data.status == '1001') {
            /**
             * 唤起认证流程
             * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
             * 详细说明可查看文档下方的参数说明
             **/
            my.startAPVerify({
              certifyId: _info.certify_id,
              url: _info.certify_url,
              success: res => {
                if (res.resultStatus === '9000') {
                  my.request({
                    url: app.globalData.testUrl + '/Api/user/Attestation',
                    method: 'POST',
                    data: {
                      user_name: vm.data.name,
                      user_idcard: vm.data.id_card,
                      zm_user_id: app.globalData.user_id,
                      user_phone: vm.data.zfb_phone
                    },
                    dataType: 'json',
                    success: function (res) {
                      //console.log("保存信息到数据库",res);
                      // 验证成功
                      my.setStorageSync({ //处理返回临时订单页面
                        key: 'isbackreal',
                        data: true
                      });
                      my.showToast({
                        content: '验证成功'
                      });
                      my.setStorageSync({ //是否是第一次进行人脸识别
                        key: 'firstFaceauth',
                        data: true
                      });
                      my.navigateTo({
                        url: "../../../mine/success/success?typeindex=6"
                      })
                    }
                  })
                } else {
                  my.showToast({
                    content: res.resultStatus === "6001" ? "请进行实名认证" : "实名认证失败"
                  });
                }
              }
            })
          } else {
            my.showToast({
              content: '实名认证失败！请填写正确的实名信息！'
            })
          }
        },
        fail: (res) => {
          console.log('失败', res.data);
        },
        complete: () => {
          my.hideLoading();
        }
      });

    } else {
      my.request({
        url: app.globalData.testUrl + '/Api/user/Attestation',
        method: 'POST',
        data: {
          user_name: vm.data.name,
          user_idcard: vm.data.id_card, 
          zm_user_id: app.globalData.user_id,
          user_phone: vm.data.zfb_phone
        },
        dataType: 'json',
        success: function (res) {
          //console.log("保存信息到数据库",res);
          // 验证成功
          my.setStorageSync({ //处理返回临时订单页面
            data: true
          });
          my.showToast({
            content: '验证成功'
          });
          my.setStorageSync({ //是否是第一次进行人脸识别
            key: 'firstFaceauth',
            data: true
          });
          my.navigateTo({
            url: "../../../mine/success/success?typeindex=6"
          })
        },
        complete: () => {
          my.hideLoading();
        }
      })
    }
  }
});