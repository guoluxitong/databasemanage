import request from '@/utils/request'

export function relation_devicePermissionlistbyconditionandpage(query) {
  return request({
    url: '/webapi/weixinmanage/devicePermission/list/page',
    method: 'get',
    params: query
  })
}
export function editrelation_devicePermission(data) {
  return request({
    url: '/webapi/weixinmanage/devicePermission/edit',
    method: 'post',
    data:data
  })
}
export function deleterelation_devicePermissionbyid(id) {
  return request({
    url: '/webapi/weixinmanage/devicePermission/delete',
    method: 'post',
    params:{id}
  })
}
