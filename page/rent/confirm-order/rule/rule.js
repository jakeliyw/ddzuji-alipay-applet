Page({
  data: {
    canUse: true,
    agreement:0,
    appInfo:getApp()
  },
  onLoad(option) {
    let app = getApp();
    if(my.canIUse('web-view')){
      my.downloadFile({
        url: app.globalData.imgUrl+"yonghuzulinxieyi.pdf",
        success({ apFilePath }) {
          my.hideLoading();
          my.openDocument({
            filePath: apFilePath,
            fileType: 'pdf',
          })
        }
      })
    }else{
      this.setData({
        canUse: false
      })
    }
  },
});
