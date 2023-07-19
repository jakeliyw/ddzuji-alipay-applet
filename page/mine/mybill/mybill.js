var md5Encrypt = require('../../../util/md5/md5.js');

Page({
  data: {
    addUrl: '',
    imgUrl: '',
    order_id: '',
    bill: [],
    depositState: "", //-1不免，0半免，1全免
    money: { //金额
      price1: '',
      price2: ''
    },
    isLoadFlag: false,
    _yihuan: 0,
    goodsInfo: null,
    isShowToubao: false,
    isSelectAll: false,
    billids: [],//待还款 ids
    selectbillids: [],//已选待还款 ids
    total: "", //还款金额
    stageNum: 0, //期数
    isShowHuankuan: false,//还款弹出框
    selectbill: [],//已选列表
    amount_override:0,//应还逾期金额
  },

  //获取账单信息
  showBill(action) {
    var self = this;
    var app = getApp();
    var _testUrl = app.globalData.testUrl;

    this.setData({
      imgUrl: app.globalData.imgUrl,
    });

    var billParam = {
      version: app.globalData.version,
      device: app.globalData.device,
      signType: app.globalData.signType,
      order_id: self.data.order_id, //订单号
      // order_id: "2019080403001951495648",

    }
    var billStr = md5Encrypt.md5(billParam);

    my.request({
      url: _testUrl + '/Api/order/checkBill',
      method: 'POST',
      data: {
        version: app.globalData.version,
        device: app.globalData.device,
        signType: app.globalData.signType,
        order_id: self.data.order_id, //订单号
        token: billStr,
      },
      dataType: 'json',
      success: function (res) {
       // console.log("获取账单列表", res);
        var money = [];
        var mon1 = '', mon2 = '';
        if (res.data.status == '1001') {
          let _zdData = res.data.data.row;


          var depositFlag = ""; //押金类型

          if (res.data.data.zm_myj == '0.00') { //不免
            depositFlag = '-1';
          } else if (res.data.data.zm_zyj == res.data.data.zm_myj) { //全免
            depositFlag = '1';
          } else {  //半免
            depositFlag = '0';
          }


          let _yihuan = 0;
          for (let item of _zdData) {
            if (item.fq_status == 2) {
              _yihuan += item.total_pay;
            }
          }

          // order_gross_rent //总租金
          let _kehuanitems = [], _yihuanitems = [], _billids = [];
          let _bill = res.data.data.row.map((arr) => {

            arr.last_repayment_time = arr.last_repayment_time.split(" ")[0]

            if (arr.fq_status == 1) {//待还款
              arr.fq_statusName = "待还款"
              _kehuanitems.push(arr);
              _billids.push(arr.id);
            } else if (arr.fq_status == 2) {//已还款
              arr.fq_statusName = "已还款"
              _yihuanitems.push(arr);
            } else if (arr.fq_status == 3) {//逾期中
              arr.fq_statusName = "逾期中"
              _kehuanitems.push(arr);
              _billids.push(arr.id);
            } else if (arr.fq_status == 4) {//异常退货
              arr.fq_statusName = "异常退货"
            }

            return arr;
          })


          self.setData({
            bill: _kehuanitems.concat(_yihuanitems),
            billids: _billids,
            depositState: depositFlag,
            isLoadFlag: true,
            _yihuan: parseFloat(_yihuan).toFixed(2),
            goodsInfo: res.data.data.dateil
          });
        }
      },
      complete: function (res) {
        if (action == "load") {
          my.hideLoading();
        } else if (action == "pulldown") {
          setTimeout(function () {
            my.stopPullDownRefresh(); //停止刷新
          }, 1000);
        }
      }
    });
  },

  onLoad(option) {
    //加载动画
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });

    var order_id = option.order_id; //订单号

    this.setData({
      order_id: order_id,
    })
    setTimeout(() => {

      this.showBill("load");
    }, 100)

  },

  //下拉刷新
  onPullDownRefresh() {
    this.showBill("pulldown");
  },
  toGoodsDetail(e) {
    my.navigateTo({
      url: "../../rent/goodsdetail/goodsdetail?id=" + e.currentTarget.dataset.goods_id
    })
  },
  showtoubao() {
    this.setData({
      isShowToubao: true
    })
  },
  closetoubao(e) {
    this.setData({
      isShowToubao: false
    })
  },
  checkedAll() {//全选
    let _isSelectAll = !this.data.isSelectAll;


    this.setData({
      isSelectAll: _isSelectAll,
      selectbillids: _isSelectAll ? this.data.billids : []
    })
    this.countMoney(this.data.selectbillids);
  },
  clickItem(e) {//期数点击事件

    console.log(e);
    // let _index = e.currentTarget.dataset.index;
    let _uuid = e.currentTarget.dataset.id;
    let _selectbillids = this.data.selectbillids;

    // if (_index + 1 != this.data.selectbillids.length) {
    //   _selectbillids = this.data.billids.slice(0, _index + 1);
    // } else {

    //   _selectbillids.splice(_index, 1);
    // }
    _selectbillids = [_uuid]

    this.countMoney(_selectbillids)
    this.setData({
      selectbillids: _selectbillids,
      // isSelectAll: false
    })

  },
  countMoney(ids) {//计算金额
    let _total = 0;//应还
    let _amount_override=0;
    let _selectbill = [];

   

    ids.forEach((iarr) => {
      this.data.bill.forEach((barr) => {

        if (barr.id == iarr) {
          _selectbill.push(barr);
          _total += parseFloat(barr.total_pay)+parseFloat(barr.amount_override);
          _amount_override+=parseFloat(barr.amount_override);
          return false;
        }
      })
    })
     console.log(_selectbill);

    this.setData({
      stageNum: ids.length,
      total: parseFloat(_total).toFixed(2),
      selectbill: _selectbill,
      amount_override:_amount_override,//逾期金额
    })
  },
  showhuankuan() { //还款弹出框

    this.setData({
      isShowHuankuan: true,
    })
  },
  hidehuankuan() { //还款弹出框

    this.setData({
      isShowHuankuan: false,
    })
  },
  repayment() {//确认还款
    let vm = this;
    let app = getApp();
    my.showLoading({
      content:'请稍后',
      delay: 0,
    })
    my.request({
      url: app.globalData.testUrl + '/Api/order/StagesPay',
      method: 'POST',
      data: {
        order_id: vm.data.order_id,
        stages_id: vm.data.selectbillids.join(",")
      },
      success: (res) => {
        my.hideLoading()
        if (res.data.status == '1001') {
          let _tradeNO = res.data.data;
          my.tradePay({
            tradeNO: _tradeNO,
            success: function (res) {
              //console.log("主动支付成功回调",res);
              if(res.resultCode == 9000){
                my.navigateTo({
                  url: '../success/success?typeindex=4',
                });
              }else if(res.resultCode == 4000){
                my.showToast({
                  type: 'none',
                  content: '支付失败',
                  duration: 800, success: () => {
                  },
                });
              }

            },
            fail: function (res) {
              my.showToast({
                type: 'none',
                content: '支付失败',
                duration: 800, success: () => {
                },
              });
            }
          });
        }else if(res.data.status == '101'){
          my.showToast({
            type: 'none',
            content: res.data.msg,
            duration: 800, success: () => {
            },
          });
        } 
        else  {
          my.showToast({
            type: 'none',
            content: '系统繁忙,请稍后从事',
            duration: 800, success: () => {
            },
          });
        }
      },
      complete: (res) => {
        my.hideLoading();
      }
    });




  },

});
