import request from '@/utils/request'
import qs from 'qs'
export function getorderList(query) {
  return request({
    url: '/webapi/wechat/JinRong_Order/all/list',
    method: 'get',
    params: query
  })
}
export function getUserList(moblie) {
  return request({
    url: '/wechat/user/find/moblie',
    method: 'post',
    params: {moblie}
  })
}
export function addorder(resource_product) {
  return request({
    url: '/webapi/wechat/JinRong_Order/create',
    method: 'post',
    data:resource_product
  })
}
