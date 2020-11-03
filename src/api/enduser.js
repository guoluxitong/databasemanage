import request from '@/utils/request'
import qs from 'qs'
export function enduserlist(query) {
  return request({
    url: '/webapi/datacenter/core/enduser/list',
    method: 'get',
    params: query
  })
}


export function editenduser(data) {
    return request({
        url: '/webapi/datacenter/core/enduser/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}

export function create(data) {
  return request({
    url: '/webapi/datacenter/core/enduser/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
