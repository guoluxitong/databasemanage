import request from '@/utils/request'
import qs from 'qs'
export function enterprisecustomerlist(enterpriseId) {
  return request({
    url: '/webapi/datacenter/core/enterprise/customer/list',
    method: 'get',
    params: {enterpriseId: enterpriseId}
  })
}
export function editenterprisecustomer(data) {
    return request({
        url: '/webapi/datacenter/core/enterprise/customer/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}
export function createcustomer(data) {
  console.log(data)
  return request({
    url: '/webapi/datacenter/core/enterprise/customer/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
