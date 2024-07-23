import request from '@/utils/request'

// 查询商品管理列表
export function listManage(query) {
  return request({
    url: '/products/manage/list',
    method: 'get',
    params: query
  })
}

// 查询商品管理详细
export function getManage(id) {
  return request({
    url: '/products/manage/' + id,
    method: 'get'
  })
}

// 新增商品管理
export function addManage(data) {
  return request({
    url: '/products/manage',
    method: 'post',
    data: data
  })
}

// 修改商品管理
export function updateManage(data) {
  return request({
    url: '/products/manage',
    method: 'put',
    data: data
  })
}

// 删除商品管理
export function delManage(id) {
  return request({
    url: '/products/manage/' + id,
    method: 'delete'
  })
}
