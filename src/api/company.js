import request from '@/utils/request'

export function companylist(query) {
  return request({
    url: '/webapi/datacenter/company/list',
    method: 'get',
    params: query
  })
}


export function create(data) {
    return request({
        url: '/webapi/datacenter/company/create',
        method: 'post',
        data:data
    })
}
export function editcompany(data) {
  return request({
    url: '/webapi/datacenter/company/modify',
    method: 'post',
    data:data
  })
}
