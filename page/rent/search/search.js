var md5Encrypt = require('../../../util/md5/md5.js');

Page({
  data: {
    focus: 'true',
    hotSearch: [],
    curSearchKey: '', //当前搜索的关键字
    goodsList: [], //搜索结果
    merList: [],//商家列表
    isSearch: false,
    tabs: [
      { title: '商品搜索' },
      // { title: '商户搜索' }
    ],
    activeTab: 0,
    history: []
  },

  //获取商品列表
  getGoodsList() {
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var obj = this;
    var app = getApp();

    var goodsParam = {
      version: app.globalData.version_new,
      device: app.globalData.device,
      signType: app.globalData.signType,
      search_tag: this.data.curSearchKey,
    }
    var goodsStr = md5Encrypt.md5(goodsParam);

    my.request({
      url: app.globalData.testUrl + '/Api/most/search',
      method: 'get',
      data: {
        version: app.globalData.version_new,
        device: app.globalData.device,
        signType: app.globalData.signType,
        search_tag: obj.data.curSearchKey,
        token: goodsStr,
      },
      dataType: 'json',
      success: function (res) {
        //console.log('===', res.data);

        my.hideLoading(); //加载结束

        if (res.data.status == '1001') {

          let _goodsList = res.data.data.filter((arr) => {
            arr.goods_labels = arr.goods_label.split(',');
            if (arr.goods_labels.length == 1) {
              arr.goods_labels = arr.goods_labels[0].split('，')
            }
            return arr;
          })



          obj.setData({
            goodsList: _goodsList,
            isSearch: true,
            // day_rent:res.data.data.ForEach(function(item){
            //   item.monthly_rent.toFixed(2);
            // })
          });
        } else {
          obj.setData({
            goodsList: [],
            isSearch: true,
          });
        }

      }
    })
  },
  //获取商户列表
  getMersList(_key) {
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var obj = this;
    var app = getApp();

    var goodsParam = {
      version: app.globalData.version_new,
      device: app.globalData.device,
      signType: app.globalData.signType,
      search_mer: this.data.curSearchKey,
    }
    var goodsStr = md5Encrypt.md5(goodsParam);

    my.request({
      url: app.globalData.testUrl + '/Api/goods/search',
      method: 'POST',
      data: {
        version: app.globalData.version_new,
        device: app.globalData.device,
        signType: app.globalData.signType,
        search_mer: _key,
        token: goodsStr,
      },
      dataType: 'json',
      success: function (res) {
        //console.log('===', res.data);

        my.hideLoading(); //加载结束

        if (res.data.status == '1001') {

          let _merchant = res.data.data;

          _merchant = _merchant.filter((arr) => {
            let _mer = arr;
            _mer.two = parseInt(_mer.mer_score / 2);
            if ((10 - _mer.mer_score) == 1) {
              _mer.one = 1;
              _mer.zero = 0;
            } else {
              if ((10 - _mer.mer_score) % 2 > 0) {
                _mer.one = 1;
                _mer.zero = parseInt((10 - _mer.mer_score) / 2);
              } else {
                _mer.zero = parseInt((10 - _mer.mer_score) / 2);
              }
            }
            return arr;
          })


          //console.log(_merchant);
          obj.setData({
            merList: _merchant,

            // day_rent:res.data.data.ForEach(function(item){
            //   item.monthly_rent.toFixed(2);
            // })
          });
        } else {
          obj.setData({
            merList: [],
          });
        }

      }
    })
  },
  //获取输入的数据
  inputText(e) {
    //console.log(e.detail.value)
    this.setData({
      curSearchKey: e.detail.value,
    });

  },
  inputText1(e) {
    //console.log(e.detail.value)
    this.getMersList(e.detail.value);
  },
  //点击键盘上的“搜索”
  getSearchKey(e) {
    let _value = e.detail.value;
    this.setData({
      curSearchKey: _value,
    });

    let history_data = this.data.history;

    if (_value != '' && history_data.indexOf(_value) == -1) {
      history_data.push(_value);
    }


    my.setStorageSync({
      key: 'search_history',
      data: history_data
    });

    this.setData({
      history: history_data
    })
    //搜索
    if (_value != "") {

      console.log(e.currentTarget.dataset.type);
      if (e.currentTarget.dataset.type == "goods") {
        this.getGoodsList(_value);
      } else {
        this.getMersList(_value);
      }

    }
  },

  //将热门搜索的关键字赋值
  setSearchKey(e) {
    // console.log(e);
    this.setData({
      curSearchKey: e.currentTarget.dataset.name,
    });

    //搜索
    if (e.currentTarget.dataset.name != "") {
      this.getGoodsList(e.currentTarget.dataset.name);
    }
  },

  //删除输入框中的关键词
  delSearchKey() {
    this.setData({
      curSearchKey: '',
    });
  },

  //跳转到详情
  toDetail(e) {
    var id = e.currentTarget.dataset.id;
    my.navigateTo({
      url: "../goodsdetail/goodsdetail?id=" + id,
    });
  },

  //返回首页
  toHome() {
    my.switchTab({
      url: '../rent'
    })
  },

  onLoad() {
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var obj = this;
    var app = getApp();
    this.setData({
      imgUrl: app.globalData.imgUrl,
    });

    my.getSystemInfo({
      success: (res1) => {

        my.createSelectorQuery().select('.search').boundingClientRect().exec((ret) => {
            // console.log('////',ret)

            obj.setData({
              scrollviewheight: res1.windowHeight - ret[0].height,


            });
          })

      }
    })
    let res = my.getStorageSync({ key: 'search_history' });

    let history_data = res.data;

    obj.setData({
      history: history_data == null ? [] : history_data
    });





    var hotSearchParam = {
      version: app.globalData.version_new,
      device: app.globalData.device,
      signType: app.globalData.signType,
    }
    var hotSearchStr = md5Encrypt.md5(hotSearchParam);

    my.request({
      url: app.globalData.testUrl + '/Api/goods/hotSearch',
      method: 'POST',
      data: {
        version: app.globalData.version_new,
        device: app.globalData.device,
        signType: app.globalData.signType,
        token: hotSearchStr,
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data);

        my.hideLoading(); //加载结束

        if (res.data.status == '1001') {
          obj.setData({
            hotSearch: res.data.data,
          });
        } else {
          obj.setData({
            hotSearch: [],
          });
        }
      }
    })


  },
  remove_history() {//删除历史搜索

    my.removeStorageSync({
      key: 'search_history',
    });
    this.setData({
      history: []
    })
  },
  remove_historyone(e) {//删除单个历史搜索

    console.log(e);
    let search_value = e.currentTarget.dataset.name;

    let del_history = [];

    this.data.history.forEach((arr) => {
      if (arr != search_value) {
        del_history.push(arr);
      }
    })

    this.setData({
      history: del_history
    })

  },
  handleTabClick({ index }) {

    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  tomer(e) {//跳转商家页面
    my.navigateTo({
      url: "../../merchant/merchant?mer_id=" + e.currentTarget.dataset.id
    });
  }
});
