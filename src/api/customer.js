import request from '@/utils/request'
import qs from 'qs'
export function getCustomerListByConditionAndPage(query) {
  return request({
    url: '/webapi/datacenter/core/customer/list',
    method: 'get',
    params: query
  })
}
export function editCustomer(data) {
    return request({
        url: '/webapi/datacenter/core/customer/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}
export function create(data) {
  return request({
    url: '/webapi/datacenter/core/customer/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
