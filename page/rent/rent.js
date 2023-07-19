Page({
  data: {
    appInfo: getApp(),
    testUrl: getApp().globalData.testUrl,
    imgUrl: getApp().globalData.imgUrl,
    imgHandle: getApp().globalData.imgHandle,
    phone: '',
    windowHeight: 0, //窗口高度
    showWhat: {}, //显示生活号入口还是收藏
    canUse_lifestyle: false, //是否支持生活号组件
    canUse_favorite: false, //是否支持收藏组件
    canUse_spread: false, //是否支持推广位组件
    search_fixed: false, //搜索栏是否置顶
    imgpic: [], //轮播图
    imgLen: 0,
    activityPart: [], //活动区域
    descArr: [
      { txt: '国行正品' },
      { txt: '租金低预收少' },
      { txt: '芝麻免押' },
      { txt: '极速审批' }
    ],
    whoBuy: [], //大家都在买
    whoBuy_page: { //大家都在买分页
      page: 1, //当前页
      pageSize: 10, //所取条数
      totalPage: 1, //总页数
    },
    scroll: false, //是否滑动页面
    loadText: '加载中...',
    isLoad: false, //加载完
    isReceived: false, //是否领取收藏券
    isCollection: true,
    systemInfo: {},
    searchHidden: true, //搜索栏
    favoriteHidden: true, //弹出层
    shadowAnimation: [], //动画-背景
    layerAnimation: [], //动画-弹出层
    // 记录用户是否已经点击了收藏 true收藏 false没有收藏
    is_receive: '',
    show_pop: false, // 弹出层  false去领取
    close_pop: false,
    hide_pop: true,
    pro_page: 1, // 商品列表当前页数
    show_toTop_btn: false, // 返回顶部按钮
    scrollTop: 0, // 距离顶部的距离
    toView: '', // 点击返回顶部按钮，滚动到该元素
    is_fixed: false, // tab栏是否悬浮在顶部

    bajie_good_index: 0,//推荐滚动index

    right_bottomisShow: false,//是否显示优惠券浮动框
    fixed_tab_data: [   // 悬浮顶部tab栏数据
    ],
    // 商品横向滑动数据(今日上新)
    pro_scroll_data: [],
    cate_id: 0,
    merchant: [],//优质店铺
    goods: [],//推荐
    floor_data: [],//活动版块  新人专区、热门活动
    customBannerdotsindex: 0,//自定义轮播小点index
    topHeight: 0,//是否显示高度
    // products_list: [], //新品速报
    hot_list: [],//热租榜
    current: 0,
    startX: 0,//新品速报点击位置
    endX: 0,
    iCenter: 3,
    datas: [],//新品速报
    order: [],//
    scroll_left: 0,//设置新品速报滑动距离
    new_goods_scroll: 0,//新品速报滑动距离
    new_goodsMove: false,//新品速报是否触发触摸事件
    new_goodsWidth: 0,//新品速报宽度
    new_goodsThreshold: 0,//新品速报 少距底部/右边多远时（单位px），触发 scrolltolower 事件。
    new_isThreshold: false,//新品速报  是否滑动到安全距离
    new_goodscroll: true,
    viewonTouchEnd: false,//父级触摸结束
    newgoods_current: 0,
    move_StartX: 0,//触摸开始位置 X轴
    move_StartY: 0,//触摸开始位置 Y轴
    tab_index: 0,//瀑布流选中index
    is_empower: false,//是否授权
    tabscroll_left: 0,//首页分类距离
    newTab: [],//分类列表
    newTabsIndex: 0,//首页分类激活index
    newTabData: [{}, {}, {}, {}, {}, {}],//分类数据
    showKefuPop: false,
    is_show_popup: false // 首页跳转到一元租机活动的弹窗
  },
  closePopup() {
    this.setData({
      is_show_popup: false
    })
  },
  navigateToChannelH5() {
    my.navigateTo({ url: '/page/rent/channelH5/channelH5' })
    this.closePopup()
  },
  showKefu() {
    this.setData({
      showKefuPop: true,
    })
  },
  showKefus() {
    my.navigateTo({ url: '/page/rent/coupon/coupon' })
  },
  hideKefu() {
    this.setData({
      showKefuPop: false,
    })
  },
  activitybannerIndex(e) {//自定义轮播小点

    this.setData({
      customBannerdotsindex: e.detail.current  //当前滚动的index
    })
  },
  //显示弹出层背景
  showShadow() {
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });

    this.shadowAnim = animation;

    animation.opacity(1).step();
    this.setData({
      shadowAnimation: animation.export(),
    });
  },
  // 隐藏弹出层背景
  hideShadow() {
    this.shadowAnim.opacity(0).step();
    this.setData({
      shadowAnimation: this.shadowAnim.export(),
    });
  },
  // 显示弹出层
  showLayer() {
    var animation = my.createAnimation({
      duration: 150,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.layerAnim = animation;
    animation.opacity(1).scale(1).step();
    this.setData({
      layerAnimation: animation.export(),
    });
  },
  // 隐藏弹出层
  hideLayer() {
    this.layerAnim.scale(.8).opacity(0).step();
    this.setData({
      layerAnimation: this.layerAnim.export(),
    });
  },

  //打开面板
  showPanel() {
    this.setData({
      favoriteHidden: false,
      hide_pop: false
    })
    this.showShadow();
    this.showLayer();
  },

  //关闭弹层
  hidePanel() {
    this.hideShadow();
    this.hideLayer();

    this.setData({
      favoriteHidden: true,
      hide_pop: true
    });
  },
  // toUse() {
  //   this.hidePanel();
  //   this.setData({
  //     show_pop: true,
  //     hide_pop: true
  //   })
  // },
  // close_one_pop() {
  //   this.hidePanel();
  //   this.setData({
  //     is_receive: true,
  //     hide_pop: true
  //   })
  // },
  getVoucher() {
    my.navigateTo({
      url: "/page/rent/coupon/coupon",
    });
  },
  //获取大家都在买
  getProductList(action, cate_id) {
    let vm = this;
    //	console.log('商品列表', action, cate_id);
    if (action == "pulldown") { //下拉刷新 
      this.setData({
        scroll: false,
        whoBuy_page: {
          page: 1,
          pageSize: this.data.whoBuy_page.pageSize,
          totalPage: 1,
        }
      })
    }
    if (action == "load") { //下拉刷新 
      this.setData({
        scroll: false,
        whoBuy_page: {
          page: 1,
          pageSize: this.data.whoBuy_page.pageSize,
          totalPage: 1,
        }
      })
    }
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let cateId = '';
    if (cate_id) {
      cateId = cate_id;
    }
    var obj = this;
    var app = getApp();

    if (app.globalData.user_id != "") {
      obj.goodsList_request(obj.data.whoBuy_page.page, obj.data.whoBuy_page.pageSize, cateId)
      vm.setData({
        is_empower: true
      })
    } else {
      app.getAuth_base(function (user_id) {
        vm.setData({
          is_empower: true
        })
        obj.goodsList_request(obj.data.whoBuy_page.page, obj.data.whoBuy_page.pageSize, cateId)
      })
    }


  },
  //
  goodsList_request(page, pageSize, cate_id) {
    var obj = this;
    var app = getApp();
    let _cateId = obj.data.newTab[obj.data.newTabsIndex] ? obj.data.newTab[obj.data.newTabsIndex].cateId : 0
    // 未加密的数据
    let data = {
      page: page,
      pageSize: pageSize,
      cate_id: _cateId,
      zm_user_id: app.globalData.user_id
    }
    //console.log("首页加载", data);
    // 已经加密的数据

    // 底部商品列表
    my.request({
      url: app.globalData.testUrl + '/Api/most/goodsList',
      method: 'get',
      // data: {
      // 	p: obj.data.whoBuy_page.page,
      // 	pageSize: obj.data.whoBuy_page.pageSize,
      // },
      data,
      dataType: 'json',
      success: function (res) {
        //console.log('底部商品列表', res)
        if (res.data.status == '1001') {
          my.hideLoading();
          // if(res.data.data.length==0){
          //   return
          // }
          var whoBuy = [];
          if (obj.data.scroll) { //滚动时，追加数据
            // whoBuy = [].concat(obj.data.whoBuy);
            // for (var i = 0; i < res.data.data.data.length; i++) {
            //   whoBuy.push(res.data.data.data[i]);
            // }
            let _newData = [...obj.data.newTabData[obj.data.newTabsIndex], ...res.data.data.data]
            obj.data.newTabData[obj.data.newTabsIndex] = _newData
            // console.log(obj.data.newTabData)
            obj.setData({
              scroll: false,
              newTabData: obj.data.newTabData
            })
          } else {
            whoBuy = res.data.data.data;
            obj.data.newTabData[obj.data.newTabsIndex] = res.data.data.data;
          }
          // if (whoBuy) {
          //   whoBuy.filter((arr) => {
          //     arr.goods_labels = arr.goods_label.split(',');
          //     if (arr.goods_labels.length == 1) {
          //       arr.goods_labels = arr.goods_labels[0].split('，')
          //     }
          //     return arr;
          //   })
          // }
          obj.scrollTo()

          obj.setData({
            whoBuy: whoBuy,
            newTabData: obj.data.newTabData,
            whoBuy_page: {
              page: obj.data.whoBuy_page.page,
              pageSize: obj.data.whoBuy_page.pageSize,
              totalPage: res.data.data.last_page,
            }
          })

        }
      }, complete: function (res) {
        my.hideLoading();

      }
    })
  },
  scrollTo() {
    let obj = this;
    my.createSelectorQuery().select('.scroll-view_H').boundingClientRect().exec((ret) => {
      if (ret[0]) {
        obj.setData({
          _boxWidth: ret[0].width
        })
      };
    })

    my.createSelectorQuery().select('.scroll-view_H .activeStyle').boundingClientRect().exec((ret) => {
      if (ret[0]) {
        obj.setData({
          tabscroll_left: ret[0].left + 88 - Math.floor(obj.data._boxWidth / 2)
        })
      };
    })
    my.createSelectorQuery().select('.topHeight').boundingClientRect()
      .exec((ret) => {
        let topHeight = 0;
        if (ret[0]) {
          topHeight = ret[0].height;
          obj.setData({
            topHeight: topHeight
          })
        }
      })
  },
  onReady() {
    this.animation = my.createAnimation();//创建动画
  },
  // 触底加载更多
  onReachBottom() {
    var obj = this;
    //console.log("触底加载");

    if (this.data.whoBuy_page.page < this.data.whoBuy_page.totalPage) {
      this.setData({
        scroll: true,
        whoBuy_page: {
          page: this.data.whoBuy_page.page + 1,
          pageSize: this.data.whoBuy_page.pageSize,
          totalPage: this.data.whoBuy_page.totalPage
        }
      });

      this.getProductList('', this.data.cate_id);
    } else {
      this.setData({
        scroll: true,
        loadText: '没有更多了哦',
      })

      setTimeout(function () {
        obj.setData({
          loadText: '',
          scroll: false,
        });
      }, 2000);
    }
  },

  //是否已领取优惠券
  isCollection() {
    let vm = this;
    let app = getApp();

    // my.request({
    //   url: app.globalData.testUrl + '/Api/api/IsGetCoupon',
    //   method: 'POST',
    //   data: {
    //     zm_user_id: app.globalData.user_id
    //   },
    //   success: (res) => {
    //     //console.log('是否领取优惠券', res);
    //     my.hideLoading();
    //     if (res.data.status == '1001') {

    //       if (res.data.data.is_get == 0) {

    //        // vm.showPanel();
    //         this.setData({
    //           right_bottomisShow: true
    //         })

    //       } else {
    //         this.setData({
    //           right_bottomisShow: false
    //         })

    //       }

    //     }
    //   }
    // });
  },
  //搜索
  toSearch() {
    my.navigateTo({
      url: "search/search",
    })
  },

  // scroll(e) {
  onPageScroll(e) {
    let _topHeight = this.data.topHeight;
    let scrollHeight = e.scrollTop;
    if (_topHeight != 0) {
      if (scrollHeight >= _topHeight) {
        this.setData({
          is_fixed: true
        })
        // console.log('true');
      } else {
        this.setData({
          is_fixed: false
        })
        // console.log('false');
      }
    } else {
      // 获取顶部搜索栏的高度
      my.createSelectorQuery().select('.topHeight').boundingClientRect()
        .exec((ret) => {
          let topHeight = 0;
          if (ret[0]) {
            topHeight = ret[0].height;
            // this.setData({
            //   topHeight: topHeight
            // })
          }

          if (scrollHeight >= topHeight) {
            this.setData({
              is_fixed: true
            })
            // console.log('true');
          } else {
            this.setData({
              is_fixed: false
            })
            // console.log('false');
          }
        })
    }

  },
  true() { },
  onLoad(option) {

    my.getSystemInfo({
      success: (res) => {
        this.setData({
          systemInfo: res
        })
      }
    })

    if (option.goods_id) {
      my.navigateTo({ url: './goodsdetail/goodsdetail?id=' + option.goods_id + "&source=" + option.source });
    }

    var app = getApp();
    let obj = this;
    //console.log(app);
    if (option.platform) {
      app.globalData.platform = option.platform
    }
    if (option.come_from) {
      app.globalData.come_from = option.come_from
    }
    if (option.platform) {
      app.getAuth_base(function () {})
    }
    let index_data = {//首页接口参数
      activity: option.activity || '',//活动名称
      goods_id: 0,//
      source: option.source || '',//数据来源  默认
      user_code: option.user_code || "",//用户code
    }


    my.getStorage({
      key: 'user_code',
      success: (res) => {
        if (res.data) {
          index_data.user_code = res.data;
        };
        //获取首页信息
        this.getIndex(index_data)
      }
    });
    //获取 user_code 缓存

    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    this.getProductList("load", this.data.cate_id); //大家都在
  },
  getIndex(index_data) {
    let obj = this;
    my.request({
      url: getApp().globalData.testUrl + '/Api/api/index',
      method: 'post',
      data: index_data,
      dataType: 'json',
      success: function (res) {
        my.hideLoading();
        if (!res.data) {
          return false
        }
        //console.log('首页数据', res);
        if (res.data.status == '1001') {
          res.data.data.cate[0].checked = true;
          let _products_show = res.data.data.products_show;

          _products_show.filter((arr) => {
            if (arr.min_day >= 30) {
              arr.money = (arr.min_price * 30).toFixed(1);
            } else {
              arr.money = (arr.min_price * arr.min_day).toFixed(1);
            }
          })
          let newTab = [];
          newTab = res.data.data.cate.map(item => {
            return {
              title: item.cate_name,
              subTitle: item.sub_name,
              cateId: item.cate_id
            }
          });
          const category = res.data.data.icon.map(item => ({ ...item, icon: obj.data.imgUrl + item.img_uri })).slice(0, 8)
          obj.setData({
            category,//icon
            imgpic: res.data.data.carousel,//轮播
            fixed_tab_data: res.data.data.cate,//悬浮顶部tab栏数据
            floor_data: res.data.data.triger,//活动版块
            datas: _products_show, //新品速报
            hot_list: res.data.data.hot_show,//热租榜
            newTab: newTab,
          })


          if (index_data.user_code == "") {//第一次进入 设置缓存
            my.setStorage({
              key: 'user_code',
              data: res.data.data.user_code
            });
          }

          my.createSelectorQuery()
            .select('.slide').boundingClientRect()
            .exec((ret) => {
              if (ret && ret[0]) {
                obj.setData({
                  new_goodsWidth: ret[0].width,
                  new_goodsThreshold: (ret[0].width * 0.4)
                })
              }
            });

        } else {
          console.log("获取数据失败", res);
        }
      }, complete: function (res) {
        my.hideLoading();

      }
    })

  },
  onShow() {
    var obj = this;
    var app = getApp();
    if (app.globalData.is_gogoods) {
      my.hideLoading();
    }

    this.setData({
      // imgUrl: app.globalData.imgUrl,
      phone: app.globalData.userPhone,
      // testUrl: app.globalData.testUrl
    });
    // 获取本地存储中存储的用户是否已经收藏的字段

    // 当前版本是否支持生活号组件
    if (my.canIUse('lifestyle')) {
      this.setData({
        canUse_lifestyle: true
      });
    }

    // 当前版本是否支持收藏组件
    if (my.canIUse('favorite')) {
      this.setData({
        canUse_favorite: true,
      });
    } else {
      this.setData({
        canUse_favorite: false,
      });
    }
    // // 当前版本是否支持推广位组件
    // if (my.canIUse('spread')) {
    // 	this.setData({
    // 		canUse_spread: true
    // 	});
    // }

    //是否显示生活号入口、收藏组件、活动是否开始、是否显示推广位
    var showWhatParam = {
      version: app.globalData.version,
      device: app.globalData.device,
      signType: app.globalData.signType,
    }


    //获取收藏的高度
    my.createSelectorQuery()
      .selectViewport().boundingClientRect().exec((ret) => {
        obj.setData({
          windowHeight: ret[0].height,
        });
      });



  },
  //下拉刷新
  onPullDownRefresh() {
    my.stopPullDownRefresh()
  },
  toTopIndex(e) { // 点击返回顶部
    // console.log('点击回顶',e)
    my.pageScrollTo({ scrollTop: 0 });

  },
  toSorts(item) {//跳转分类
    // console.log(item);
    const { cate_id } = item;
    my.setStorage({
      key: 'cate_id',
      data: {
        cate_id,
      }
    });

    my.switchTab({
      url: './sorts/sorts',
    })
  },
  clickTopItem(res) { // 顶部悬浮点击
    let vm = this;
    let len = vm.data.fixed_tab_data.length;
    my.pageScrollTo({
      // scrollTop: vm.data.topHeight - 40,
      selector: "#lists"
    })
    let _index = 0;
    let cate_id = 0;
    for (var i = 0; i < len; i++) {
      let item = "fixed_tab_data[" + i + "].checked";
      vm.setData({
        [item]: false
      });
    }
    if (res.target) {
      // console.log('true');
      let id = res.target.dataset.id;
      _index = id;
      let current_item = "fixed_tab_data[" + id + "].checked";
      vm.setData({
        [current_item]: true,
      })
      // 当前分类的id(根据分类id请求商品列表数据)
      cate_id = res.target.dataset.proId;
    } else {
      let index = res.index;
      _index = index;
      let current_item = "fixed_tab_data[" + index + "].checked";
      vm.setData({
        [current_item]: true,
      })
      cate_id = res.cate_id;
    }
    // 当前分类的id(根据分类id请求商品列表数据)
    // let cate_id = res.target.dataset.proId;
    this.setData({
      newTabsIndex: _index,
      tab_index: res.index,
      cate_id: cate_id
    });
    if (this.data.newTabData[this.data.newTabsIndex].length > 0) {
      this.getProductList('load', this.data.cate_id);
      this.scrollTo()
    } else {
      this.getProductList('pulldown', this.data.cate_id);
    }
  },
  // toClassify() {
  //   my.switchTab({
  //     url: './sorts/sorts',
  //     success: () => {

  //     }
  //   })
  // },
  // set_bajie_index: function (e) {//推荐 轮播改变
  //   this.setData({
  //     bajie_good_index: e.detail.current
  //   })
  // },
  // go_good(e) {
  //   //console.log(e);
  //   my.navigateTo({
  //     url: "./goodsdetail/goodsdetail?id=" + e.target.dataset.id,
  //   })
  // },

  //跳转
  jump_tap(e) {
    let vm = this;
    var app = getApp();

    let _type = e.currentTarget.dataset.jump_type,//跳转类型
      _app_id = e.currentTarget.dataset.app_id,//appid
      _content_url = e.currentTarget.dataset.content_url,//跳转路径.
      _mode_type = e.currentTarget.dataset.mode_type,//1=新品速报 2=热门活动 3=专属推荐 4=热租榜
      _telmp_id = e.currentTarget.dataset.telmp_id;//模板id
    if (_type == 0) {//内部页面跳转

      if (_content_url.indexOf("cate_id") >= 0) {
        my.setStorage({
          key: 'cate_id',
          data: {
            cate_id: _content_url.split("=")[1]
          },
          success: function () { }
        });

        my.switchTab({
          url: './sorts/sorts',
        })
      } else {
        my.navigateTo({
          url: _content_url// "./goodsdetail/goodsdetail??id=111"
        })
      }

    } else if (_type == 1) {//跳转其他小程序
      my.navigateToMiniProgram({
        appId: _app_id,
        path: _content_url,
        success: (res) => {

        },
        fail: (error) => {
          console.log('跳转失败', error);
        }
      })

    } else if (_type == 2) {//会员有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId,//会员有礼小程序AppID
        extraData: {
          //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
          templateId: _telmp_id,
          //对应模板配置的小程序AppID
          appId: app.globalData.appId
        },
        success: (res) => {
          //跳转成功回调代码
          //console.log(res)
        },
        fail: (res) => {
          //跳转失败回调代码
          console.log("领取失败", res)
        }
      })

    } else if (_type == 3) {//收藏有礼优惠券领取
      my.navigateToMiniProgram({
        appId: app.globalData.appId,
        path: 'pages/index/index?originAppId=' + app.globalData.appId + '&newUserTemplate=' + _telmp_id
      });

    }

    if (_mode_type == 2) {
      vm.record_Hits(_mode_type, "");
    }


  },
  new_goods_change(e) {//卡片滑动事件
    //console.log("23121",e);
    this.setData({
      newgoods_current: e.detail.current
    })
  },

  new_goodsDetail(e) {//新品速报转跳详情
    this.record_Hits(1, e.target.dataset.id);
    my.navigateTo({
      url: "./goodsdetail/goodsdetail?id=" + e.target.dataset.id,
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
  // rent_step() {//租机攻略
  //   my.navigateTo({
  //     url: "../activity/activity?showWhat=rentProcedure",
  //   })
  // },
  // onTouchStart(e) {//触摸动作开始

  //   let client = e.changedTouches[0];
  //   this.setData({
  //     move_StartX: client.clientX,
  //     move_StartY: client.clientY
  //   })
  // },
  // onTouchEnd(e) {//触摸动作结束
  //   console.log('hahahahaha');
  //   let clientX = e.changedTouches[0].clientX,
  //     clientY = e.changedTouches[0].clientY;
  //   let distanceX = clientX - this.data.move_StartX;//移动距离 X
  //   let distanceY = clientY - this.data.move_StartY;//移动距离 Y

  //   let max_index = this.data.fixed_tab_data.length - 1;//最大index
  //   let selectIndex = this.data.tab_index;//当前选中index

  //   if (distanceY < 30 || -distanceY < 30) {//Y轴移动距离偏差不能大于40
  //     if (-distanceX > 120) {//向右滑动
  //       if (selectIndex < max_index) {

  //         this.setFixed_tab_data(selectIndex + 1)
  //       }

  //     } else if (distanceX > 120) {//向左滑动
  //       if (selectIndex > 0) {
  //         this.setFixed_tab_data(selectIndex - 1)
  //       }

  //     }
  //   }

  // },
  // setFixed_tab_data(index) {//设置瀑布流选中
  //   // topHeight
  //   let vm = this;
  //   let len = vm.data.fixed_tab_data.length;

  //   my.pageScrollTo({
  //     scrollTop: vm.data.topHeight - 40
  //   })

  //   for (var i = 0; i < len; i++) {
  //     let item = "fixed_tab_data[" + i + "].checked";
  //     vm.setData({
  //       [item]: false
  //     });
  //   }
  //   let cate_id = 0;
  //   if (len > 0) {
  //     cate_id = vm.data.fixed_tab_data[index].cate_id;
  //   }

  //   let current_item = "fixed_tab_data[" + index + "].checked";
  //   vm.setData({
  //     [current_item]: true,
  //   })

  //   this.setData({
  //     tab_index: index,
  //     cate_id: cate_id
  //   })
  //   this.getProductList('pulldown', this.data.cate_id);
  // }
});
