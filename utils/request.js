export default function request({ url, method = 'get', data }) {
  const app = getApp();
  my.showLoading();
  return new Promise((resolve, reject) => {
    my.request({
      url: app.globalData.testUrl + url,
      method,
      dataType: 'json',
      data,
      success: (res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        my.hideLoading();
      },
    });
  });
}
