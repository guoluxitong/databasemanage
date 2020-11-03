import request from '@/utils/request'
import qs from 'qs'
export function getCategoryList(query) {
  return request({
    url: '/webapi/datacenter/boiler/part/list',
    method: 'get',
    params: query
  })
}
export function createCategory(data) {
  return request({
    url: '/webapi/datacenter/boiler/part/create',
    method: 'post',
    data:data
  })
}
export function modifyCategory(data) {
  return request({
    url: '/webapi/datacenter/boiler/part/modify',
    method: 'post',
    data:data
  })
}
export function removeCategory(partId) {
  console.log(qs.stringify({partId: partId}))
  return request({
    url: '/webapi/datacenter/boiler/part/remove',
    method: 'post',
    data: qs.stringify({partId: partId})
  })
}
