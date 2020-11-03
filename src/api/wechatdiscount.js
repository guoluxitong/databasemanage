import request from '@/utils/request'
import qs from 'qs'
export function getWeChatList(query) {
  return request({
    url: '/webapi/wechat/DiscountStrategy/list',
    method: 'get',
    params: query
  })
}
export function editWeChat(data) {
  return request({
    url: '/webapi/wechat/DiscountStrategy/modify',
    method: 'post',
    data:data
  })
}
export function addWeChat(resource_product) {
  console.log(resource_product)
  return request({
    url: '/webapi/wechat/DiscountStrategy/create',
    method: 'post',
    data:resource_product
  })
}
