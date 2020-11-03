import request from '@/utils/request'
import qs from 'qs'
export function getDeviceList(query) {
  return request({
    url: '/webapi/datacenter/core/device/list',
    method: 'get',
    params: query
  })
}

export function getDeviceListByEnterpriseIdAndPage(enterpriseId) {
  return request({
    url: '/webapi/datacenter/core/device/list/enterprise',
    method: 'get',
    params: {enterpriseId:enterpriseId }
  })
}
export function getDeviceListBySuffix(query) {
  return request({
    url: '/webapi/datacenter/core/device/fix/suffix',
    method: 'get',
    params:{suffix:query}
  })
}
export function getDeviceListBycustom(query) {
  return request({
    url: '/webapi/datacenter/core/device/list/suffix5',
    method: 'get',
    params:{suffix5:query}
  })
}
export function insertDevice(data) {
  return request({
    url: '/webapi/datacenter/core/device/create',
    method: 'post',
    data:data
  })
}

export function updateManyDeviceNo(data) {
  return request({
    url: '/webapi/datacenter/core/device',
    method: 'post',
    data:data
  })
}

export function editDevice(data) {
  return request({
    url: '/webapi/datacenter/core/device/fix/modify',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function deleteDeviceById(id) {
  return request({
    url: '/webapi/datacenter/core/device',
    method: 'post',
    params:{id}
  })
}
