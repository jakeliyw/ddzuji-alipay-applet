import request from "/utils/request";

// 获取地址列表
export function getAddressList(data) {
  return request({
    url: '/Api/address/list',
    data,
  })
}

// 新增地址
export function insetAddress(data) {
  return request({
    url: '/Api/address/insetAddress',
    method: 'POST',
    data,
  })
}

// 删除地址
export function delAddress(data) {
  return request({
    url: '/Api/address/delAddress',
    method: 'DELETE',
    data,
  })
}

// 查询地址
export function findAddress(data) {
  return request({
    url: '/Api/address/findAddress',
    method: 'GET',
    data,
  })
}
