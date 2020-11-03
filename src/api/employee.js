import request from '@/utils/request'
import qs from 'qs'
export function getEmployeeListByConditionAndPage(query) {
  return request({
    url: '/webapi/datacenter/core/employee/list',
    method: 'get',
    params: query
  })
}
export function getEmployeeInfoByMobile(loginId) {
  return request({
    url: '/webapi/datacenter/core/employee/find',
    method: 'get',
    params:{loginId}
  })
}
export function editEmployee(data) {
  return request({
    url: '/webapi/user/change/password',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function editEmployeePass(data) {
  return request({
    url: '/webapi/datacenter/core/employee/change/user/password',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function createEmployee(data) {
  return request({
    url: '/webapi/datacenter/core/employee/create',
    method: 'post',
    data:(data)
  })
}
export function editEmployeeRole(data) {
  return request({
    url: '/webapi/datacenter/core/employee',
    method: 'post',
    data:data
  })
}

export function deleteEmployeeById(id) {
  return request({
    url: '/webapi/datacenter/core/employee',
    method: 'post',
    params:{id}
  })
}

