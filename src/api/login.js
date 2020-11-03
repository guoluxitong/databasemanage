import request from '@/utils/request'

export function login(loginId, password) {

  return request({
    url: '/account/datamanage/login',
    method: 'post',
    params: { loginId, password }
  })
}