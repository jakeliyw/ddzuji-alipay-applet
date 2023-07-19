Page({
  data: {
    appInfo:getApp(),
    mer_id: "",//商家id
    imgUrl: '',
    shadowAnimation: [], //动画-背景
    contentAnimation: [], //动画-内容
    filterHidden: false,//筛选弹窗
    kefuisShow: false,//客服弹窗
    mer_info: {},//商户信息
    cates: [],//商户分类
    cateSelectIndex: 0,//当前选择的分类
    cateSelectId: "",//当前选择的分类ID
    brand: [],//子级分类列表
    brandSelectIndex: 0,//当前选择的子级分类
    brandSelectId: "",//当前选择的子级分类ID
    filterbrand: [],//筛选后子级分类列表
    brandstr: "",//当前选择子分类名称
    goodslist: [],//商品列表
  },
  onLoad(option) {
    let vm = this;
    let app = getApp();
    vm.setData({
      mer_id: option.mer_id
    })
    let _cate_id = option.cate_id;
    //console.log(_cate_id);
    my.createSelectorQuery()
      .selectViewport().boundingClientRect().exec((ret) => {
        // console.log(ret);
        vm.setData({
          windowHeight: ret[0].height
        });
      });
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    vm.setData({
      imgUrl: app.globalData.imgUrl
    })

    my.request({
      url: app.globalData.testUrl + '/Api/goods/getMerInfo',
      method: 'POST',
      data: {
        mer_id: vm.data.mer_id
      },
      success: (res) => {
        //console.log('商家信息', res);
        my.hideLoading();
        if (res.data.status == '1001') {

          let _mer_info = res.data.data.mer_data[0];//商户信息
          _mer_info.renting = res.data.data.renting;
          _mer_info.total = res.data.data.total;

          let _cates = res.data.data.cate;//商户分类
          _cates.unshift({
            cate_id: "",
            cate_name: "全部商品"
          })

          let _filterbrand = res.data.data.brand.filter((arr) => {
            if (arr.pid == _cates[1].cate_id) {
              return arr;
            }
          })
          my.setNavigationBar({
            title: _mer_info.mer_name,
          });

          vm.setData({
            mer_info: _mer_info,
            cates: res.data.data.cate,
            brand: res.data.data.brand,
            filterbrand: _filterbrand,

          })
          if (_cate_id) {
            let _cateSelectIndex=0;
            _cates.forEach((arr,index)=>{
                if(arr.cate_id==_cate_id){
                    _cateSelectIndex=index;
                }
            })
            vm.setData({
              brandSelectId: _cate_id,
              cateSelectIndex: _cateSelectIndex
            })
            vm.getMerGoodsList(_cate_id, "",0);
          } else {
            vm.getMerGoodsList("", "",0)
          }


        } else if (res.data.status == '1002') {
          console.log("缺少参数", res)
        }
      }
    });


  },
  //分类点击
  cateOnclick(e) {
    console.log(e)
    let _type = e.currentTarget.dataset.type
    if (_type == "parent") {//商户页面分类点击
      this.getMerGoodsList(e.currentTarget.dataset.id, "",0)

    }

    let _filterbrand = this.data.brand.filter((arr) => {
      if (arr.pid == e.currentTarget.dataset.id) {
        return arr;
      }
    })

    this.setData({
      filterbrand: _filterbrand,
      cateSelectIndex: e.currentTarget.dataset.index,
      cateSelectId: e.currentTarget.dataset.id,
      brandSelectId: "",
      brandstr: ""
    })
    if (e.currentTarget.dataset.id == "") {
      this.setData({
        cateSelectIndex: 0,

        cateSelectId: "",
      })
    }

  },
  brandOnclick(e) {//子级分类点击

    this.setData({
      brandSelectId: e.currentTarget.dataset.id,
      brandstr: e.currentTarget.dataset.name
    })
  },
  filterGoodsList(e) {//分类筛选 确定
    let vm = this;
    vm.hidePanel();

    vm.getMerGoodsList(vm.data.cateSelectId, vm.data.brandstr,vm.data.brandSelectId)
  },
  getMerGoodsList(_cate_id, _brand,_brandSelectId) {//获取商家商品列表

    let vm = this;
    let app = getApp();

    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    my.request({
      url: app.globalData.testUrl + '/Api/most/getMerGoodsList',
      method: 'get',
      data: {
        mer_id: vm.data.mer_id,
        cate_pid: _cate_id,// vm.data.cateSelectId,
        cate_id:_brandSelectId,
        brand: _brand //vm.data.brandstr
      },
      success: (res) => {
        //console.log('商品列表', res);

        if (res.data.status == '1001') {
          let _goodslist = res.data.data;
          _goodslist.filter((arr) => {
            arr.goods_labels = arr.goods_label.split(',');
            if (arr.goods_labels.length == 1) {
              arr.goods_labels = arr.goods_labels[0].split('，')
            }
            return arr;
          })

          vm.setData({
            goodslist: _goodslist
          })

        } else if (res.data.status == '1002') {
          console.log("缺少参数", res)
        }
      }, complete: (r) => {
        my.hideLoading();
      }
    });
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
  // 显示弹出层面板
  showContent() {
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      contentAnimation: animation.export(),
    });
  },
  // 隐藏弹出层背景
  hideContent() {
    this.contentAnim.translateY('100%').step();
    this.setData({
      contentAnimation: this.contentAnim.export(),
    });
  },
  showPanel(e) {

    if (e.currentTarget.dataset.origin == "filter") {
      this.setData({
        filterHidden: !this.data.filterHidden,
        cateSelectId: this.data.cateSelectId == "" ? this.data.cates[1].cate_id : this.data.cateSelectId,
        cateSelectIndex: this.data.cateSelectIndex == 0 ? 1 : this.data.cateSelectIndex,
      });

      let _filterbrand = this.data.brand.filter((arr) => {
        if (arr.pid == this.data.cateSelectId) {
          return arr;
        }
      })

      this.setData({
        filterbrand: _filterbrand
      })
    }
    this.showShadow();
    this.showContent();
  },
  closekefu() {
    this.setData({
      kefuisShow: false
    })
  },
  showkefu() {
    this.setData({
      kefuisShow: true
    })
  },
  shangJiaPhone() {//商家客服

    my.makePhoneCall({
      number: this.data.mer_info.mer_phone,
    });
  },
  pingTaiPhone() {//平台客服
    let app=getApp();
    my.makePhoneCall({
      number: app.globalData.service_phone
    });
  },
  //关闭面板/弹层
  hidePanel(e) {

    this.hideShadow();
    this.hideContent();

    setTimeout(() => {
      this.setData({
        filterHidden: false
      });
    }, 150);

  },
});
