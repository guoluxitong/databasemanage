import request from '@/utils/request'
import qs from 'qs'
export function enterprisecodelist(query) {
  return request({
    url: '/webapi/datacenter/core/enterprise/prefix/list',
    method: 'get',
    params: query
  })
}


export function editenterprisecode(data) {
    return request({
        url: '/webapi/datacenter/core/enterprise/prefix/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}
export function createPrefix(data) {
  return request({
    url: '/webapi/datacenter/core/enterprise/prefix/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
