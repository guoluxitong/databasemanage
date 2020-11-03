import request from '@/utils/request'

export function getRelation_DeviceControlMapMapperListByConditionAndPage(query) {
  return request({
    url: '/webapi/weixinmanage/devicecontrol/list/page',
    method: 'get',
    params: query
  })
}
export function editRelation_DeviceControlMap(data) {
  return request({
    url: '/webapi/weixinmanage/devicecontrol/edit',
    method: 'post',
    data:data
  })
}
export function deleteRelation_DeviceControlMapById(id) {
  return request({
    url: '/webapi/weixinmanage/devicecontrol/delete',
    method: 'post',
    params:{id}
  })
}
