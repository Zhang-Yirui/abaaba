import request from '@/utils/request'

// 查询订单管理列表
export function listManage(query) {
  return request({
    url: '/orders/manage/list',
    method: 'get',
    params: query
  })
}

// 查询订单管理详细
export function getManage(id) {
  return request({
    url: '/orders/manage/' + id,
    method: 'get'
  })
}

// 新增订单管理
export function addManage(data) {
  return request({
    url: '/orders/manage',
    method: 'post',
    data: data
  })
}

// 修改订单管理
export function updateManage(data) {
  return request({
    url: '/orders/manage',
    method: 'put',
    data: data
  })
}

// 删除订单管理
export function delManage(id) {
  return request({
    url: '/orders/manage/' + id,
    method: 'delete'
  })
}

// 商品销售明细
export function personnelVOlist(productId) {
  return request({
    url: '/orders/manage/personnelVOList/',
    method: 'get',
    params: {
      productId: productId
    }
  })
}

// 修改订单状态
export function updateOrderStatus(data) {
  return request({
    url: '/orders/manage/updateOrderStatus',
    method: 'post',
    data: data
  })
}


// 新增提成记录
export function addCommission(data) {
  return request({
    url: '/orders/manage/insertCommission',
    method: 'post',
    data: data
  })
}

export function salesDetails(id) {
  return request({
    url: '/orders/manage/Synthesize/',
    method: 'get',
    params: {
      id:id
    }
  })
}

//销售统计总览
export function selectStatistics() {
  return request({
    url: '/orders/manage/selectStatistics',
    method: 'get'
  })
}

