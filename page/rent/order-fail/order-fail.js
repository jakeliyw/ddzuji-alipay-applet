Page({
  data: {
    msg: '',
  },

  onLoad(option){
    var msg = option.msg;
    this.setData({
      msg: msg
    });
  },
 
  //查看订单
  checkOrder(){
    my.navigateTo({
      url:'../../mine/myorders/myorders?status=0'
    });
  },
  
  //返回首页
  backToOrigin(){
    my.switchTab({
      url: '../rent'
    })
  }
});
