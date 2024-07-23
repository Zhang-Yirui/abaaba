import request from '@/utils/request'

// 查询用户列表列表
export function listPersonnel(query) {
  return request({
    url: '/peoples/personnel/list',
    method: 'get',
    params: query
  })
}

// 查询用户列表详细
export function getPersonnel(id) {
  return request({
    url: '/peoples/personnel/' + id,
    method: 'get'
  })
}

// 查询用户上下级详细
export function selectAllSuById(id,superiorId) {
  return request({
    url: '/peoples/personnel/selectAllSuById?id=' + id+'&superiorId='+superiorId,
    method: 'get'
  })
}

// 新增用户列表
export function addPersonnel(data) {
  return request({
    url: '/peoples/personnel',
    method: 'post',
    data: data
  })
}

// 修改用户列表
export function updatePersonnel(data) {
  return request({
    url: '/peoples/personnel',
    method: 'put',
    data: data
  })
}

// 删除用户列表
export function delPersonnel(id) {
  return request({
    url: '/peoples/personnel/' + id,
    method: 'delete'
  })
}
