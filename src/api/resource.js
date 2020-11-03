import request from '@/utils/request'
import qs from 'qs'
export function getResourceList(query) {
  return request({
    url: '/webapi/datacenter/boiler/resource/list',
    method: 'get',
    params: query
  })
}
export function getResoure(orgId) {
  return request({
    url: '/webapi/datacenter/boiler/resource/org',
    method: 'get',
    params: {orgId:orgId}
  })
}

export function createResource(data) {
  return request({
    url: '/webapi/datacenter/boiler/resource/create',
    method: 'post',
    data:data
  })
}
export function editResource(data) {
  return request({
    url: '/webapi/datacenter/boiler/resource/modify',
    method: 'post',
    data:data
  })
}
export function map(data) {
  console.log(data)
  return request({
    url: '/webapi/datacenter/boiler/resource/map',
    method: 'post',
    params:{orgId:data.orgId},
    data:data.orgResources
  })
}

