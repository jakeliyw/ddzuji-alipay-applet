const app = getApp();
Page({
  data: {
    frontfilePath: "", //身份证正面
    backfilePath: "", //身份证反面
    headfilePath: "", //人像识别
    codeName: "",
    saveDisabled: false,
    isSaved: false, // 用户已保存
    zm_user_id: "",
  },
  onLoad(option) {
    my.setNavigationBar({
      title: "上传证件资料",
      backgroundColor: "#000000",
      frontColor: "#ffffff"
    })
    this.setData({
      codeName: `*${option.codeName.substring(1)}`,
      zm_user_id: app.globalData.user_id || my.getStorageSync({ key: "zm_user_id" }).data,
    })
    this.getUserData();
  },
  onUnload() {
    if (
      this.data.frontfilePath &&
      this.data.backfilePath &&
      this.data.headfilePath
    ) {
      my.setStorageSync({
        key: "has_user_info_photo",
        data: true,
      });
    } else {
      my.setStorageSync({
        key: "has_user_info_photo",
        data: false,
      });
    }
  },
  getUserData() {
    my.request({
      url: app.globalData.testUrl + "/Api/order/getUserImg",
      method: "get",
      data: {
        zm_user_id: this.data.zm_user_id,
      },
      success: (res) => {
        if (res.data.status == "1001") {

          const { idcardFront, idcardBack, head } = res.data.data
          this.setData({
            frontfilePath: idcardFront, //身份证正面
            backfilePath: idcardBack, //身份证反面
            headfilePath: head, //人像识别
            isSaved: idcardFront && idcardBack && head,
          });
        } else {
          my.showToast({
            content: "请重新授权再进行资料上传"
          })
          my.switchTab({
            url: '../mine'
          })
        }
      },
    });
  },
  uploadImg(file, type) {
    const { key: fileName, localPath: filePath } = file;

    return new Promise((resolve) => {
      my.uploadFile({
        url: `${app.globalData.testUrl}/Api/order/uploadIDcard`,
        // url: `120.77.177.120/Api/order/uploadIDcard`,
        filePath,
        fileName,
        fileType: "image",
        formData: {
          zm_user_id: this.data.zm_user_id,
        },
        success: res => {
          const { status, data, msg } = JSON.parse(res.data || {});
          if (status === "1001") {
            my.showToast({
              type: "none",
              content: msg,
              duration: 800
            });
          }
          switch (type) {
            case "frontfilePath":
              this.setData({ frontfilePath: data });
              break;
            case "backfilePath":
              this.setData({ backfilePath: data });
              break;
            case "headfilePath":
              this.setData({ headfilePath: data });
              break;

            default:
              break;
          }
          return resolve(data)
        },
        fail: err => {
          return resolve(err)
        },
      })
    })
  },
  uploadFrontfile(file) {
    return new Promise((resolve) => {
      this.uploadImg(file, "frontfilePath").then(res => {
        resolve({
          ...file,
          status: "done",
          url: res
        })
      })
    })
  },
  uploadBackfile(file) {
    return new Promise((resolve) => {
      this.uploadImg(file, "backfilePath").then(res => {
        resolve({
          ...file,
          status: "done",
          url: res
        })
      })
    })
  },
  uploadHeadfile(file) {
    return new Promise((resolve) => {
      this.uploadImg(file, "headfilePath").then(res => {
        resolve({
          ...file,
          status: "done",
          url: res
        })
      })
    })
  },
  onDelete(v) {
    console.log('即将删除的图片为：', v);
    return new Promise((resolve) => {
      my.confirm({
        title: '是否确认删除图片',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (e) => {
          resolve(e.confirm);
        }
      });
    })
  },
  previewImage(e) {
    my.previewImage({
      urls: [e.target.dataset.src],
    });
  },
  save() {
    if (!this.data.frontfilePath || !this.data.backfilePath || !this.data.headfilePath) return;
    my.request({
      url: `${app.globalData.testUrl}/Api/order/updateUserIdCard`,
      method: "POST",
      data: {
        zm_user_id: this.data.zm_user_id,
        id_card_front: this.data.frontfilePath,
        id_card_back: this.data.backfilePath,
        head: this.data.headfilePath
      },
      success: res => {
        const { msg, status } = res.data
        my.showToast({
          type: status === "1001" ? "success" : "fail",
          content: msg,
          success: _res => {
            status === "1001" && my.navigateBack()
          }
        })
      },
      fail: err => {
        my.showToast({
          type: "success",
          content: err.data.msg,
          success: _res => { }
        })
      }
    })
  },
});
