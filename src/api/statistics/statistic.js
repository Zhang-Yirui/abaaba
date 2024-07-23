import request from '@/utils/request'

// 查询销售统计列表
export function listStatistic(query) {
  return request({
    url: '/statistics/statistic/list',
    method: 'get',
    params: query
  })
}

// 查询销售统计详细
export function getStatistic(id) {
  return request({
    url: '/statistics/statistic/' + id,
    method: 'get'
  })
}

// 新增销售统计
export function addStatistic(data) {
  return request({
    url: '/statistics/statistic',
    method: 'post',
    data: data
  })
}

// 修改销售统计
export function updateStatistic(data) {
  return request({
    url: '/statistics/statistic',
    method: 'put',
    data: data
  })
}

// 删除销售统计
export function delStatistic(id) {
  return request({
    url: '/statistics/statistic/' + id,
    method: 'delete'
  })
}

//销售统计总览
export function selectStatistics() {
  return request({
    url: '/statistics/statistic/',
    method: 'get'
  })
}
