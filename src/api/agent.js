import request from '@/utils/request'
import qs from 'qs'
export function agentlist(query) {
  return request({
    url: '/webapi/datacenter/core/agent/list',
    method: 'get',
    params: query
  })
}
export function editagent( data) {
    return request({
        url: '/webapi/datacenter/core/agent/modify',
        method: 'post',
        data:qs.stringify(data)
    })
}
export function create(data) {
  return request({
    url: '/webapi/datacenter/core/agent/create',
    method: 'post',
    data:qs.stringify(data)
  })
}
