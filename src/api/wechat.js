import request from '@/utils/request'
import qs from 'qs'
export function getWeChatList(query) {
  return request({
    url: '/webapi/wechat/Resource_Product/list',
    method: 'get',
    params: query
  })
}
export function getResourceList(query) {
  return request({
    url: '/webapi/wechat/Resource_Product/Resource/list',
    method: 'get',
    params: query
  })
}
export function editWeChat(data) {
  return request({
    url: '/webapi/wechat/Resource_Product/modify',
    method: 'post',
    data:data
  })
}
export function deleteWeChat(id) {
  return request({
    url: '/webapi/wechat/Resource_Product/remove',
    method: 'get',
    params:{openId:id}
  })
}
export function addWeChat(resource_product) {
  console.log(resource_product)
  return request({
    url: '/webapi/wechat/Resource_Product/create',
    method: 'post',
    data:resource_product
  })
}
