import request from '@/utils/request'

export function getRelation_DeviceSmsMapMapperListByConditionAndPage(query) {
  return request({
    url: '/webapi/weixinmanage/deviceSms/list/page',
    method: 'get',
    params: query
  })
}
export function editRelation_DeviceSmsMap(data) {
  return request({
    url: '/webapi/weixinmanage/deviceSms/edit',
    method: 'post',
    data:data
  })
}
export function deleteRelation_DeviceSmsMapById(id) {
  return request({
    url: '/webapi/weixinmanage/deviceSms/delete',
    method: 'post',
    params:{id}
  })
}
