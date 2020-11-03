import request from '@/utils/request'
import qs from 'qs'
export function enterprisecustomercodelist(enterpriseCustomerId) {
  return request({
    url: '/webapi/datacenter/core/enterprise/customer/prefix/list',
    method: 'get',
    params: {enterpriseCustomerId: enterpriseCustomerId}
  })
}


export function editenterprisecustomercode(data) {
    return request({
        url: '/webapi/datacenter/core/enterprise/customer/prefix/create',
        method: 'post',
        data:qs.stringify(data)
    })
}

