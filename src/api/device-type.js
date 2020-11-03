import request from '@/utils/request'
import qs from 'qs'
export function getDeviceTypeList() {
  return request({
    url: '/webapi/datacenter/core/device/type/list',
    method: 'get'
  })
}
export function getDeviceTypeListByConditionAndPage(query) {
  return request({
    url: '/webapi/datacenter/core/device/type/list',
    method: 'get',
    params: query

  })
}
export function editdeviceType(data) {
  return request({
    url: '/webapi/datacenter/core/device/type/modify',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function createdeviceType(data) {
  return request({
    url: '/webapi/datacenter/core/device/type/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function deletedeviceTypebyid(id) {
  return request({
    url: '/webapi/datacenter/core/device',
    method: 'post',
    params:{id}
  })
}
