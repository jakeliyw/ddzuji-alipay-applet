Page({
  data: {
    showWhat: "giftbox", //treatment:理疗   package:箱包配饰   giftbox:手机   beauty:女神节
    random: 2019010901,
    address: '',
    is_skip: false, // 判断address这个参数存在并且不为null的时候跳转,
    skip_url: '', // 跳转到活动页的路径
    user_id: "",//用户userid
    isNew: '',//是否是新活动页面
    h5HTMLname: '',
    _taskId: '',//活动任务id
    is_time10: false,//是否跳转够10秒
    is_timeout: false,//是否是浏览其他小程序后返回 
    setTimeout: null,
    token: '',//token
  },
  onLoad(option) {
    this.setData({
      h5HTMLname: option.h5HTMLname,
      isNew: option.isNew,
      showWhat: option.showWhat,
    });

    if (option.source) {
      my.setStorageSync({
        key: 'h5source',
        data: option.source
      });
    } else {
      my.removeStorageSync({
        key: 'h5source'
      });
    }

    this.webViewContext = my.createWebViewContext('webView');

    if (my.canIUse('web-view')) {
      this.setData({
        canUse: true
      });
    } else {
      this.setData({
        canUse: false
      });
    }

  },
  onShow() {// 页面显示
    let app = getApp();
    if (this.data.setTimeout) {
      // console.log("timsssssss",this.data.setTimeout);
      clearTimeout(this.data.setTimeout)
    }

    if (this.data.is_timeout) {
      //  console.log(this.data.is_time10)
      if (this.data.is_time10) {
        // my.showToast({
        //   content: '浏览成功'
        // });
        this.setData({
          is_time10: false
        })
        let res = my.getStorageSync({ key: 'token' });
        console.log(this.data.token,res.data );
        if (this.data.token !== '') {
          this.webViewContext.postMessage({ 'onApplet': true, 'taskId': this.data._taskId, 'token': this.data.token });
        } else {
          this.webViewContext.postMessage({ 'onApplet': true, 'taskId': this.data._taskId, 'token': res.data });
        }

      } else {
        // my.showToast({
        //   content: '小淘气 你没有浏览够10秒哦!'
        // });
        let res = my.getStorageSync({ key: 'token' });
         console.log(this.data.token,res.data );
        if (this.data.token !== '') {
          this.webViewContext.postMessage({ 'onApplet': true, 'taskId': this.data._taskId, 'token': this.data.token });
        } else {
          this.webViewContext.postMessage({ 'onApplet': true, 'taskId': this.data._taskId, 'token': res.data });
        }
        my.setStorageSync({
          key: 'toApplet',
          data: false
        });
      }
    }
    this.setData({
      is_timeout: false
    });
  },
  //分享
  onShareAppMessage(_userCode) {
    var obj = this;
    var app = getApp();

    return {
      title: '八戒租',
      desc: '八戒租 信用免押 更多爆款超低价格',
      path: 'page/rent/rent?user_code=' + _userCode,
      success: function () {
        my.showToast({
          type: 'none',
          content: '分享成功',
          duration: 2000,
          success: () => {

          }
        });
      },
      fail: function (res) {
        console.log(res);
        my.showToast({
          type: 'none',
          content: '分享失败',
          duration: 500,
          success: () => {

          },
        });
      }
    }
  },
  // 接收来自H5的消息
  onMessage(e) {
    let _navigateid = e.detail.navigateid;
    if (_navigateid == 1) {
      //   my.navigateToMiniProgram({
      //   appId: '2019071165809378',
      //   path: 'pages/list2/list2'
      // });
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=77700148&query=tabId%3Drent'
      })

    } else if (_navigateid == 2) {//收藏有礼
      my.navigateToMiniProgram({
        appId: '2018122562686742',
        path: 'pages/index/index?originAppId=2018031602387571&newUserTemplate=20190821000000224650'
      });
    } else if (_navigateid == 3) {//五折券
      this.coupon();
    } else if (_navigateid == 4) {//我的芝麻
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=77700148&query=tabId%3Drent'
      })
    } else if (_navigateid == 5) {//信用守护
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=68687059&url=%2Fwww%2FhomeV4.html&canPullDown=NO'
      })
    } else if (_navigateid == 6) {//信用生活
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=77700148&query=tabId%3Drent'
      })
    } else if (_navigateid == 7) {//芝麻生活号
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=20000042&publicBizType=LIFE_APP&publicId=2015060900116695&sourceId=xinshougonglue01'
      })
    } else if (_navigateid == 8) {//租享生活
      my.navigateToMiniProgram({
        appId: '2019071165809378',
        path: 'pages/list2/list2',
        extraData: {
          "chInfo": "ch_appxagg__chsub_2019071165809378_pages_list1_list1"
        },
        success: (res) => {
          console.log(JSON.stringify(res))
        },
        fail: (res) => {
          console.log(JSON.stringify(res))
        }
      });

    } else if (_navigateid == 9) {//收藏有礼(券码券) 7折
      my.navigateToMiniProgram({
        appId: '2018122562686742',
        path: 'pages/index/index?originAppId=2018031602387571&newUserTemplate=KP20191128000002144334'
      });
    } else if (_navigateid == 10) {//
      my.navigateToMiniProgram({
        appId: '2018122762703259',//会员有礼小程序AppID
        extraData: {
          //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
          templateId: 'ME20191118000002127501',
          //对应模板配置的小程序AppID
          appId: '2018031602387571'
        },
        success: (res) => {
          //跳转成功回调代码
          console.log(res)
        },
        fail: (res) => {
          //跳转失败回调代码
          console.log("3333")
        }
      })
    } else if (_navigateid == 11) {//跳转秒杀
      my.navigateToMiniProgram({
        appId: '2019081966280702'
      });

    } else if (_navigateid == 12) {//跳转秒杀详情页
      let _goods_id = e.detail.goods_id;
      my.navigateToMiniProgram({
        appId: '2019081966280702',
        path: 'pages/index/goodsdetail/goodsdetail?goods_id=' + _goods_id
      });
    } else if (_navigateid == 13) { //会员有礼通用   
      let _templateid = e.detail.templateid;
      my.navigateToMiniProgram({
        appId: '2018122762703259',//会员有礼小程序AppID
        extraData: {
          //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
          templateId: _templateid,
          //对应模板配置的小程序AppID
          appId: '2018031602387571'
        },
        success: (res) => {
          //跳转成功回调代码
          console.log(res)
        },
        fail: (res) => {
          //跳转失败回调代码
          console.log("领取失败", res)
        }
      })
    } else if (_navigateid == 14) {//收藏有礼通用
      let _templateid = e.detail.templateid;
      my.navigateToMiniProgram({
        appId: '2018122562686742',
        path: 'pages/index/index?originAppId=2018031602387571&newUserTemplate=' + _templateid
      });
    } else if (_navigateid == 15) {//跳转外部小程序 通用
      let _appid = e.detail.appid;
      let _path = e.detail.path;
      my.navigateToMiniProgram({
        appId: _appid,
        path: _path
      });

    } else if (_navigateid == 16) {//跳转支付宝活动小程序
      let _path = e.detail.path;
      my.ap.navigateToAlipayPage({
        path: _path
      })
    } else if (_navigateid == 17) {//向h5 传递userid
      let app = getApp();
      let vm = this;
      if (app.globalData.user_id != '') {//是否已经获取到userid
        vm.webViewContext.postMessage({
          'zm_user_id': app.globalData.user_id
        });
      } else {
        app.getAuth_base(function (user_id) {//调用静默授权获取userid
          vm.webViewContext.postMessage({
            'zm_user_id': user_id
          });
        })
      }
    } else if (_navigateid == 18) {//token获取storage
      let vm = this;
      let res = my.getStorageSync({ key: 'token' });
      vm.webViewContext.postMessage({
        'data': res.data
      });
    } else if (_navigateid == 19) {//获取h5活动storage
      let vm = this;
      let res = my.getStorageSync({ key: 'h5source' });
      vm.webViewContext.postMessage({
        'data': res
      });
    } else if (_navigateid == 20) {//盲盒任务上传图片
      let vm = this;
      let sourceType = ['album'];//['camera', 'album']
      my.chooseImage({
        sourceType: sourceType,
        count: 1,
        success: (res) => {
          my.compressImage({
            apFilePaths: res.apFilePaths,
            level: 1, //压缩等级 0低质量 1中等质量 2高质量 3不压缩  4根据网络适应
            success: data => {
              const path = data.apFilePaths[0];
              // console.log(path,"11111");
              my.uploadFile({
                url: 'https://xcx.develop.bajiezu.cn/api/upImg',
                fileType: 'image',
                fileName: 'img',
                filePath: path,
                success: res => {
                  console.log(res)
                  res = JSON.parse(res.data);
                  console.log(res.data.object)
                  my.showToast({
                    content: '上传成功！'
                  });
                  vm.webViewContext.postMessage({
                    'img': res.data.object
                  });
                },
                fail: function (res) {
                  my.showToast({
                    content: '上传失败！'
                  });
                },
              });
            }
          })
        },
        fail: () => {//取消
          // my.showToast({
          //   content: 'fail', // 文字内容
          // });
        }
      })
    } else if (_navigateid == 21) {//获取用户token存入storage
      let app = getApp();
      //console.log(app.globalData.authCode,"1111")
      let vm = this;
      if (app.globalData.user_id != '') {//是否已经获取到autoCode
        my.request({//获取用户token
          // url: app.globalData.testUrl + '/Api/api/IsGetCoupon',
          url: 'https://xcx.bajiezu.cn/Api/authUser/getRefreshToken',
          method: 'POST',
          data: {
            auth_code: app.globalData.authCode
          },
          success: (res) => {
            // res = JSON.parse(res);
            if (res.data.status == '1001') {
              vm.setData({
                token: res.data.data.token
              });
              vm.webViewContext.postMessage({
                'token': res.data.data.token,
                'user_code': res.data.data.user_id
              });

              my.setStorage({
                key: 'token',
                data: res.data.data.token,
                success: function () {
                }
              });
            }
          }
        });

      } else {
        app.getCode(function (autoCode) {//调用静默授权获取autoCode
          my.request({//获取用户token
            // url: app.globalData.testUrl + '/Api/api/IsGetCoupon',
            url: 'https://xcx.bajiezu.cn/Api/authUser/getRefreshToken',
            method: 'POST',
            data: {
              auth_code: autoCode
            },
            success: (res) => {
              // res = JSON.parse(res);
              // console.log(res,"3333")
              vm.setData({
                token: res.data.data.token
              });

              vm.webViewContext.postMessage({
                'token': res.data.data.token,
                'user_code': res.data.data.user_id
              });

              my.setStorage({
                key: 'token',
                data: res.data.data.token,
                success: function () {
                }
              });

            }
          });
        })
      }

    } else if (_navigateid == 22) {//记录跳转app
      let vm = this;
      let _appid = e.detail.appid;
      let _path = e.detail.path;
      let _taskId = e.detail.taskId;
      //console.log(_path)
      if (_appid == "2018031602387571") {
        my.navigateTo({ url: _path })
      } else {
        my.navigateToMiniProgram({
          appId: _appid,
          path: _path
        });
      }
      my.setStorageSync({
        key: 'toApplet',
        data: true
      });

      this.setData({
        _taskId: _taskId,
        is_timeout: true
      });
      let stime = setTimeout(() => {
        let res = my.getStorageSync({ key: 'toApplet' });
        
        if (!vm.data.is_timeout) {
          // console.log("setTimeout11111111111", vm.data.is_timeout)

          return;
        }
        // console.log("setTimeout", res.data)
        if (res.data) {
          vm.setData({
            is_time10: true
          })
        } else {
          vm.setData({
            is_time10: false
          })
        }
      }, 10000);
      vm.setData({
        setTimeout: stime
      })
    } else if (_navigateid == 23) {//跳转生活号
      let vm = this;
      let _taskId = e.detail.taskId;
      my.ap.navigateToAlipayPage({
        path: 'alipays://platformapi/startapp?appId=77700296&startMultApp=YES&page=pages%2Findex%2Findex%3FnewsContentId%3D2017081408189483fdb287e4-76b3-459b-91e5-a4077aab7059%26sceneId%3D%26LinkSource%3Dnormal%26scm%3D6.matrix.video.-.-.-.-.-.2017081408189483fdb287e4-76b3-459b-91e5-a4077aab7059.-.homepage.2017081408189483.-.-%26SourceId%3Dhomepage%26spmab%3D%26__webview_options__%3Dpd%253DNO%2526prm%253Dy%26enableWK%3DYES%26from%3DlifeApp'
      })
      //console.log(_taskId,"_taskId")
      vm.setData({
        is_time10: true,
        is_timeout: true,
        _taskId: _taskId
      })
    } else if (_navigateid == 24) {//分享
      let vm = this;
      let _code = e.detail.userCode;//用户id
      let _taskId = e.detail.taskId;
      //console.log("分享",_code);
      vm.onShareAppMessage(_code);
      vm.setData({
        is_time10: true,
        is_timeout: true,
        _taskId: _taskId
      })
    } else if (_navigateid == 25) {//跳转到内部页面
      let vm = this;
      let _path = e.detail.path;

      my.navigateTo({
        //url: "../../buynow/buynow?good_id=41&entry=2"
        url: _path
      })
    } else if (_navigateid == 1000) {//吐司提示

      let _toast = e.detail.toast;
      my.showToast({
        content: _toast
      });
    } else if (_navigateid == 10000) {//测试打印数据
      console.log(e)
    }
  },


});
