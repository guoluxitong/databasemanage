import request from '@/utils/request'
import qs from 'qs'

export function getSubCategoryList(partId) {
  return request({
    url: '/webapi/datacenter/boiler/subpart/list',
    method: 'get',
    params: {partId}
  })
}
export function createSubCategory(data) {
  return request({
    url: '/webapi/datacenter/boiler/subpart/create',
    method: 'post',
    data:data
  })
}
export function modifySubCategory(data) {
  return request({
    url: '/webapi/datacenter/boiler/subpart/modify',
    method: 'post',
    data:data
  })
}
export function removeSubCategory(subPartId) {
  return request({
    url: '/webapi/datacenter/boiler/subpart/remove',
    method: 'post',
    data:qs.stringify({subPartId:subPartId})
  })
}
