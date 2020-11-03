import request from '@/utils/request'
import qs from 'qs'
export function getEnterpriseListByConditionAndPage(query) {
    return request({
        url: '/webapi/datacenter/core/enterprise/list',
        method: 'get',
        params: query
    })
}
export function editEnterprise(data) {
    return request({
        url: '/webapi/datacenter/core/enterprise/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}
export function create(data) {
  return request({
    url: '/webapi/datacenter/core/enterprise/create',
    method: 'post',
    data:qs.stringify(data)
  })
}

export function deleteEnterpriseById(id) {
    return request({
        url: '/webapi/datacenter/enterprise',
        method: 'post',
        params:{id}
    })
}
