
var md5Encrypt = require('../../../../util/md5/md5.js');
Page({
  data: {
    goodsInfo: {},
    imgUrl: "",
    order_id: "",//订单号
    goods_rents: [],//天数对应的日租金
    ismessage: false,
    express_no: "", //快递单号
    isGuiHuan: false,//是否归还
    mer_data: {},//商家收货信息 
    typeindex: 2,
    showms: "",//展开动画样式
    isShowyinying: true //展开动画阴影部分
  },
  onLoad(option) {

    let _order_id = option.order_id;
    let _isGuiHuan = option.isGuiHuan;
    let _typeindex = option.typeindex;
    console.log("是否从详情页进入", _typeindex);
    let app = getApp();
    let vm = this;
    vm.setData({
      order_id: _order_id,
      typeindex: _typeindex,
      //order_id: 2019091706534254991025,
      isGuiHuan: _isGuiHuan
    })
    //order/getGoodsTrem
    console.log(_order_id);
    my.request({
      url: app.globalData.testUrl + '/Api/order/GetMerAddress',
      method: 'POST',
      data: {
        order_id: _order_id
        //order_id: 2019091706534254991025
      },
      dataType: 'json',
      success: function(res) {
        //console.log('商品', res)
        if (res.data.status == '1001') {
          //
          vm.setData({
            imgUrl:app.globalData.imgUrl,
            goodsInfo: res.data.data,
            express_no:res.data.data.express_num
          })


        }
      }
    })
    setTimeout(function() {  //快递动画关闭
      vm.setData({
        isShowyinying: true,
        ismessage: true
      })
      setTimeout(function() {
        vm.setData({
          isShowyinying: false
        })
      }, 1000)
    }, 8000)

    setTimeout(function() {//快递动画展开
      vm.setData({
        isShowyinying: true,
        showms: "showms"
      })
      setTimeout(function() {
        vm.setData({
          isShowyinying: false
        })
      }, 1000)
    }, 1000)


  },
  onclickDay(e) {

    let _monthly_rent = parseFloat(this.data.goodsInfo.order_monthly_rent);

    let _day = parseInt(e.currentTarget.dataset.value);
    let _index = e.currentTarget.dataset.index;

    this.setData({
      day: _day,
      selectDayindex: _index,
      money: (parseFloat(this.data.goods_rents[_index]) * parseFloat(this.data.days[_index])).toFixed(2)
    })

  },
  //复制地址
  copyAddress(e) {
    let _mer_data = this.data.goodsInfo;
    let _address = _mer_data.consignee_name + ' ' + _mer_data.consignee_phone + ' ' + _mer_data.consignee_address+_mer_data.consignee_address_detail;
    my.setClipboard({
      text: _address,
      success: function(e) {
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
  returnSbumit(e) {//归还

    var formId = e.detail.formId; //模板消息formId
    var obj = this;
    var app = getApp();


    if (obj.data.express_no == "") {
      my.showToast({
        type: 'none',
        content: '请输入快递单号',
        duration: 800,
        success: () => {
        },
      });
      return;
    }

    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let _data = {
      order_id: obj.data.order_id,
      express_num: obj.data.express_no
    }

    //console.log(_data);
    my.request({
      url: app.globalData.testUrl + '/Api/order/goods_back',
      method: 'POST',
      data: _data,
      dataType: 'json',
      success: function(res) {
        console.log(res);
        // console.log('电话', obj.data.phone)
        // console.log('立即租赁返回的数据', res);
        if (res.data.status == '1001') {
          my.showToast({
            type: 'none',
            content: '确认成功。',
            duration: 800,
            success: () => {
              my.navigateTo({
                url: '../../success/success?typeindex=' + obj.data.typeindex,
              });
            },
          });
        } else if (res.data.status == '1002') {
          my.showToast({
            type: 'none',
            content: res.data.msg,
            duration: 800,
            success: () => {
              
            },
          });
        }
      },
      complete: function(res) {
       my.hideLoading()
      }
    })

  },
  bindNumbersInput(e) {

    this.setData({
      express_no: e.detail.value
    })

  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: "../../../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.goods_id
    })
  }



});
