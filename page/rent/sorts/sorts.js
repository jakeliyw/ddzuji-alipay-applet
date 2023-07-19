var md5Encrypt = require('../../../util/md5/md5.js');
var md5RequestData = require('../../../util/md5/md5-1.js');
Page({
  data: {
    imgUrl: '', // 图片域名
    baseUrl: '', // 请求地址根路径
    windowHeight: 0, //窗口高度
    titleBarHeight: 0,//标题栏高度
    statusBarHeight: 0,//状态栏高度
    topHeight: 0,
    cateTwoHeight: 0, //二级分类区域高度

    cateTwo_type: 0, //二级分类显示效果 1:左右滑动 2:平铺
    cateTwo_type_name: '', //类别/品牌
    cateOne_id: '', //当前一级分类
    cateOne_index: 0,//当前一级分类index
    cateOne_name: '', //当前一级分类
    scroll: false, //是否滑动页面
    choose_category: [], // 选中商品
    choose_category_name: [], // 选中商品name
    choose_category_id: [], // 选中商品id
    pages: {
      nowPage: 1, //当前页
      count: 10, //所取条数
      totalPage: 1, //总页数
    },
    loadText: '加载中...',
    isLoad: false,
    cateTwoHidden: true, //弹出层
    searchHidden: true, //搜索栏
    shadowAnimation: [], //动画-背景
    contentAnimation: [], //动画-内容
    searchAnimation: [], //搜索动画
    show_toTop_btn: false, // 返回顶部按钮
    toView: '', // 点击返回顶部按钮，滚动到该元素
    is_fixed: false, // 顶部悬浮吸顶
    fixed_tab_data: [], // 悬浮顶部tab栏数据	
    level_one_data: [], // 顶部一级分类 [[{},{}],[{},{}]] 后期可能改成能手动滑动的
    cover_data: [],   //分类子级
    selectSublevelid: 0,//选择的子级id
    swiper_index: 0,//当前swiper索引
    scrollHeight: 0,
    parentscrolly: true,//最外层是否滚动
    isshowcateTabs: false,//列表上方tabs 是否显示
    cate_strid: 0,//二级分类id
    optioncate_id: 0,//主页跳转分类id
    externalcate_id: 0,//外连接跳转分类id
    move_StartX: 0,//触摸开始位置 X轴
    move_StartY: 0,//触摸开始位置 Y轴
  },

  //搜索
  toSearch() {
    my.navigateTo({
      url: "../search/search",
    })
  },

  //滚动时搜索置顶
  scroll(e) {
    let vm = this;
    //console.log(e);
    if (e.detail.scrollTop > 0) {
      if (this.data.searchHidden) {

        this.setData({
          searchHidden: false,
        });

        this.showSearch();
      }
    } else {
      if (!this.data.searchHidden) {

        this.hideSearch();
        this.setData({
          searchHidden: true,
        });
      }
    }

    //	console.log('searchHidden',this.data.searchHidden);
    // 页面滚动的时候触发,判断是否显示返回顶部按钮
    if (e.detail.scrollTop > 300) {
      if (!this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: true,
          toView: ''
        })
      }
    } else {
      if (this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: false,
          toView: ''
        })
      }

    }

    my.createSelectorQuery().select('.search').boundingClientRect()
      .select('.levelOne').boundingClientRect()
      .select('.levelTow').boundingClientRect()
      .exec((ret) => {

        let _searchheight = 0, _levelOneheight = 0, _levelTowheight = 0;

        if (ret[0]) {
          _searchheight = ret[0].height;
        }
        if (ret[1]) {
          _levelOneheight = ret[1].height;
        }
        if (ret[2]) {
          _levelTowheight = ret[2].height;
        }
        let topHeight = _searchheight + _levelOneheight + _levelTowheight;
        let _scrollTop = e.detail.scrollTop + vm.data.titleBarHeight + vm.data.statusBarHeight;
        //console.log(e.detail.scrollTop, topHeight)

        if (_scrollTop >= topHeight) {
          if (!this.data.isshowcateTabs) {

            this.setData({
              isshowcateTabs: true,
            })
          }
        } else {
          if (this.data.isshowcateTabs) {

            this.setData({
              isshowcateTabs: false,
            })
          }
        }

      })
  },
  // 搜索栏滑出
  showSearch() {
    var animation = my.createAnimation({
      duration: 0,
      timingFunction: 'ease-in-out',
      delay: 0,
    });
    this.searchAnim = animation;
    animation.top(0).step();
    this.setData({
      searchAnimation: animation.export(),
    });
  },
  // 搜索栏滑走
  hideSearch() {
    this.searchAnim.top("-100%").step();
    this.setData({
      searchAnimation: this.searchAnim.export(),
    });
  },
  //获取一级分类
  getCateOne() {
    var app = getApp();
    let vm = this;

    my.request({
      url: app.globalData.testUrl + '/Api/category/parentCategory',
      method: 'POST',
      data: {
        type: "sort"
      },
      success: (res) => {
        let level_one_data = res.data.data.list;
        //console.log('一级分类请求', level_one_data);
        if (res.data.status == '1001') {

          let _cateOne_id = 0;
          if (vm.data.optioncate_id != 0) {
            _cateOne_id = vm.data.optioncate_id;
          } else {
            _cateOne_id = level_one_data[0].cate_id;
          }

          if (vm.data.externalcate_id != 0) {
            _cateOne_id = vm.data.externalcate_id;
          }



          // 选中的一级分类对应的数据
          vm.setData({
            cateOne_id: _cateOne_id,
            cateOne_name: level_one_data[0].cate_name,
            fixed_tab_data: level_one_data, // 悬浮模块数据
          })


          // 后期一级分类会改成能手动滑动的 [[{},{}],[{},{}]]

          vm.setData({
            level_one_data: level_one_data
          })
          //	console.log('数组',vm.data.level_one_data,vm.data.fixed_tab_data);

          vm.getCateList(); //获取默认商品列表
          vm.getCateTwo(_cateOne_id); //获取二级分类
        }
      }
    })
  },

  //获取二级分类数据
  getCateTwo(_cate_id) {
    //	console.log('品牌筛选');
    let vm = this;
    let app = getApp();

    let brandData = {
      cate_id: _cate_id,
      Cate_str: '1',
      Brand_str: ''
    }

    // 规格筛选
    my.request({
      url: app.globalData.testUrl + '/Api/category/categoryScreen',
      method: 'POST',
      data: brandData,
      success: (res) => {
        //console.log('规格筛选', res.data.data.list);
        if (res.data.status == '1001') {
          var params_data = res.data.data.list;

          let _cover_data = [];

          for (var i = 0, len = params_data.length; i < len; i += 6) {
            _cover_data.push(params_data.slice(i, i + 6));
          }

          vm.setData({
            cover_data: _cover_data,
          })
        }
      },
      fail: (res) => {
        // console.log('规格筛选',res,brandData);
      }
    })

  },
  //获取商品列表
  getCateList(action) {

    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var obj = this;
    var app = getApp();

    //分页置零
    if (!this.data.scroll) {
      this.setData({
        loadText: '加载中...',
        pages: {
          nowPage: 1,
          count: this.data.pages.count,
          totalPage: 1,
        }
      });
    }

    // console.log({
    //   p: obj.data.pages.nowPage,
    //   cate_id: obj.data.cateOne_id,
    //   cate_str: obj.data.selectSublevelid,
    //   pageSize: obj.data.pages.count,
    // });

    my.request({
      url: app.globalData.testUrl + '/Api/most/cateGoodsList',
      method: 'get',
      cahce: false,
      data: {
        p: obj.data.pages.nowPage,
        cate_id: obj.data.cateOne_id,
        cate_str: obj.data.selectSublevelid,
        pageSize: obj.data.pages.count,
      },
      dataType: 'json',
      success: function (res) {
        //console.log('商品列表==||', res);
        if (res.data.status == '1001') {

          if (obj.data.scroll) {//如果是上滑加载就追加数据，否则是覆盖

            let _cateList = obj.data.cateList;

            _cateList.push.apply(_cateList, res.data.data.data);

            _cateList.filter((arr) => {
              arr.goods_labels = arr.goods_label.split(',');
              if (arr.goods_labels.length == 1) {
                arr.goods_labels = arr.goods_labels[0].split('，')
              }
              return arr;
            })

            obj.setData({
              cateList: _cateList,
              pages: {
                nowPage: obj.data.pages.nowPage,
                count: obj.data.pages.count,
                totalPage: res.data.data.totalPage,
              },
              scroll: false,
            })
          } else {
            let _cateList = res.data.data.data;
            _cateList.filter((arr) => {
              arr.goods_labels = arr.goods_label.split(',');
              if (arr.goods_labels.length == 1) {
                arr.goods_labels = arr.goods_labels[0].split('，')
              }
              return arr;
            })
            obj.setData({
              cateList: _cateList,
              pages: {
                nowPage: obj.data.pages.nowPage,
                count: obj.data.pages.count,
                totalPage: res.data.data.totalPage,
              },
              scroll: false,
            })
          }
        } else if (res.data.status == '1002') {
          obj.setData({
            cateList: [],
            scroll: false,
          })
        }
        obj.setData({
          isLoad: true
        });
      },
      fail: (res) => {
        console.log('商品列表请求失败', res);
      },
      complete: () => {
        my.hideLoading(); //加载结束
      }
    })
  },

  //加载更多
  loadMore() {
    var obj = this;

    this.setData({
      scroll: true,
    });

    if (this.data.pages.nowPage < this.data.pages.totalPage) {
      this.setData({
        pages: {
          nowPage: this.data.pages.nowPage + 1,
          count: this.data.pages.count,
          totalPage: this.data.pages.totalPage,
        }
      });
      this.getCateList();
    } else {
      this.setData({
        loadText: '没有更多了哦',
      });
      setTimeout(function () {
        obj.setData({
          scroll: false,
        });
      }, 800);
    }
  },

  onShow() {
    let vm = this;
    my.getStorage({ 
      key: 'cate_id',
      success:(res)=>{
         if (res.data != null) {
          //console.log(res.data.cate_id);
          vm.setData({
            cateOne_id: res.data.cate_id,
            optioncate_id: res.data.cate_id
          })
          vm.getCateOne();
          my.removeStorage({
            key: 'cate_id',
          });
        }
      }
    });

  },

  onLoad(option) {
    // this.getCateOne();
    //加载动画
    // my.showLoading({
    //   content: '加载中...',
    //   delay: 0,
    // });

    var obj = this;
    var app = getApp();
    this.setData({
      imgUrl: app.globalData.imgUrl,
      baseUrl: app.globalData.testUrl,
      testUrl: app.globalData.testUrl
    });

    // console.log('在哪出现',option)
    if (option.cate_id) {
      this.setData({
        externalcate_id: option.cate_id
      });
    } else if (app.globalData.cateOne_id) { //外部跳转到小程序
      this.setData({
        cateOne_id: app.globalData.cateOne_id,
        cateOne_index: app.globalData.cateOne_index
      });
    }

    ////////////////////////////////////////////////
    this.setData({
      cateTwo_id: [],
      cateTwo_name: [],
    });

    my.getSystemInfo({ //获取手机系统信息
      success: (res) => {
        //console.log("手机系统信息", res);
        //手机高度
        my.createSelectorQuery()
          .select('.search').boundingClientRect().exec((ret) => {
            //console.log(ret);
            obj.setData({
              searchHeight: ret[0].height,
              titleBarHeight: res.titleBarHeight,
              statusBarHeight: res.statusBarHeight,//状态栏高度
              scrollHeight: res.windowHeight - ret[0].height
            })
          })
      }
    })


    my.createSelectorQuery()
      .selectViewport().boundingClientRect().exec((ret) => {
        // console.log(ret);
        obj.setData({
          windowHeight: ret[0].height,
          cateTwoHeight: ret[0].height - ret[0].width / 750 * (66 + 70 + 80), //获取二级分类高度
        });
      });

    //获取一级分类
    this.getCateOne();

  },
  // 页面滚动的时候触发,判断是否显示返回顶部按钮
  onPageScroll(e) {
    if (e.scrollTop > 300) {
      if (!this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: true
        })
      }

    } else {
      if (this.data.show_toTop_btn) {
        this.setData({
          show_toTop_btn: false
        })
      }
    }
  },
  toTop() { // 点击返回顶部
    this.setData({
      show_toTop_btn: false,
      toView: 'view-position'
    })
  },


	/*
		点击顶部某一项，改变当前项的选中状态
	*/
  clickScrollItem(res) {

    let vm = this;

    vm.getCateTwo(res.currentTarget.dataset.cateOne_id);

    this.setData({
      selectSublevelid: 0,
      cateOne_id: res.currentTarget.dataset.cateOne_id,
      cateOne_index: res.currentTarget.dataset.proIndex
    })

    vm.getCateList(); //获取商品列表

  },
  swiperChange(e) {//二级分类左右滑动事件
    this.setData({
      swiper_index: e.detail.current
    })
  },
  childOnclick(e) {//二级分类点击事件
    //console.log(e);
    this.setData({
      selectSublevelid: e.currentTarget.dataset.cata_id
    })
    this.getCateList(); //获取商品列表
  },
  onPullDownRefresh() {//下拉刷新
    my.stopPullDownRefresh()

  },
  onTouchStart(e) {//触摸动作开始

    let client = e.changedTouches[0];
    this.setData({
      move_StartX: client.clientX,
      move_StartY: client.clientY
    })
  },
  onTouchEnd(e) {//触摸动作结束
    let vm = this;
    let clientX = e.changedTouches[0].clientX,
      clientY = e.changedTouches[0].clientY;
    let distanceX = clientX - this.data.move_StartX;//移动距离 X
    let distanceY = clientY - this.data.move_StartY;//移动距离 Y

    let max_index = this.data.level_one_data.length - 1;//最大index
    let selectIndex = this.data.cateOne_index;//当前选中index

    if (distanceY < 30 || -distanceY < 30) {//Y轴移动距离偏差不能大于40
      if (-distanceX > 120) {//向右滑动
        if (selectIndex < max_index) {
          vm.toTop();
          vm.getCateTwo(vm.data.level_one_data[selectIndex + 1].cate_id);

          vm.setData({
            selectSublevelid: 0,
            cateOne_id: vm.data.level_one_data[selectIndex + 1].cate_id,
            cateOne_index: selectIndex + 1
          })

          vm.getCateList(); //获取商品列表
        }

      } else if (distanceX > 120) {//向左滑动
        if (selectIndex > 0) {
          vm.toTop();
          vm.getCateTwo(vm.data.level_one_data[selectIndex - 1].cate_id);

          vm.setData({
            selectSublevelid: 0,
            cateOne_id: vm.data.level_one_data[selectIndex - 1].cate_id,
            cateOne_index: selectIndex - 1
          })

          vm.getCateList(); //获取商品列表
        }
      }
    }

  },
});
