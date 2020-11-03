import request from '@/utils/request'
import qs from 'qs'
export function getorderItemList(OrderId) {
  return request({
    url: '/webapi/wechat/JinRong_OrderItem/list',
    method: 'get',
    params: OrderId
  })
}
export function addItemOrder(OrderItemList) {
  console.log(OrderItemList)
  return request({
    url: '/webapi/wechat/JinRong_OrderItem/create/many',
    method: 'post',
    data:OrderItemList
  })
}
