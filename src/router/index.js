import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {path: '/login',component: () => import('../views/login/index'),hidden: true},
  {
    path:'/home',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('../views/home/index'),
        name: 'home',
        meta: { title: '首页', noCache: true}
      }
    ]
  },
  {
    path:'/',
    component: Layout,
    name: '核心数据管理',
    meta: { title: '核心数据管理'},
    children: [
          {
            path: '/enterprise',
            component: () => import('../views/enterprise/index'),
            name: '企业管理',
            meta: { title: '企业管理', noCache: true}

      },
          {
            path: '/customer',
            component: () => import('../views/customer/index'),
            name: '锅炉厂管理',
            meta: { title: '锅炉厂管理', noCache: true}
      },
          {
            path: '/agent',
            component: () => import('../views/agent/index'),
            name: '代理管理',
            meta: { title: '代理管理', noCache: true}
      },
          {
            path: '/enduser',
            component: () => import('../views/enduser/index'),
            name: '终端用户管理',
            meta: { title: '终端用户管理', noCache: true}
      },
          {
            path: '/device',
            component: () => import('../views/device/index'),
            name: '设备管理',
            meta: { title: '设备管理', noCache: true}
      },
          {
            path: '/employee',
            component: () => import('../views/employee/index'),
            name: '用户管理',
            meta: { title: '用户管理', noCache: true}
      },
          {
            path: '/org',
            component: () => import('../views/org/index'),
            name: '组织类型管理',
            meta: { title: '组织类型管理', noCache: true}
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: '锅炉厂数据管理',
    meta: {title: '锅炉厂数据管理',noCache: true},
    children: [
      {
        path: '/customer/customermanage/resource',
        component: () => import('../views/customermanage/resource/index'),
        name: '功能管理',
        meta: { title: '功能管理', noCache: true}
      },
      {
        path: '/customer/customermanage/orgresource',
        component: () => import('../views/customermanage/orgresource/index'),
        name: '锅炉厂与功能管理',
        meta: { title: '锅炉厂与功能管理', noCache: true}
      },
      {
        path: '/customer/customermanage/user',
        component: () => import('../views/customermanage/user/index'),
        name: '锅炉厂用户管理',
        meta: { title: '锅炉厂用户管理', noCache: true}
      },
      {
        path: '/customer/customermanage/category',
        component: () => import('../views/customermanage/category/index'),
        name: '辅机管理',
        meta: { title: '辅机管理', noCache: true}
      }
    ]
  },
  {
    path: '/wx',
    component: Layout,
    name: '微信数据管理',
    meta: {title: '微信数据管理',noCache: true},
    children: [
      {
        path: '/wx/devicecontrol',
        component: () => import('../views/deviceControl/index'),
        name: '微信设备控制管理',
        meta: { title: '微信设备控制管理', noCache: true}
      },
      {
        path: '/wx/devicepermission',
        component: () => import('../views/devicePermission/index'),
        name: '微信设备管理',
        meta: { title: '微信设备管理', noCache: true}
      },
      {
        path: '/wx/devicesms',
        component: () => import('../views/deviceSms/index'),
        name: '微信设备短信管理',
        meta: { title: '微信设备短信管理', noCache: true}
      },
      {
        path: '/wx/wechat',
        component: () => import('../views/wechat/index'),
        name: '微信购买项管理',
        meta: { title: '微信购买项管理', noCache: true}
      },
      {
        path: '/wx/wechatdiscount',
        component: () => import('../views/wechatdiscount/index'),
        name: '微信购买折扣管理',
        meta: { title: '微信购买折扣管理', noCache: true}
      }
      ,
      {
        path: '/wx/order',
        component: () => import('../views/order/index'),
        name: '微信订单管理',
        meta: { title: '微信订单管理', noCache: true}
      } ,
      {
        path: '/wx/simpayment',
        component: () => import('../views/simpayment/index'),
        name: '微信充值管理',
        meta: { title: '微信充值管理', noCache: true}
      }
    ]
  },
  {
    path: '/enduser',
    component: Layout,
    name: '终端用户数据管理',
    meta: {title: '终端用户数据管理',noCache: true},
    children: [
      {
        path: '/enduser/endusermanage/resource',
        component: () => import('../views/endusermanage/resource/index'),
        name: '功能管理',
        meta: { title: '功能管理', noCache: true}
      },
      {
        path: '/enduser/endusermanage/orgresource',
        component: () => import('../views/endusermanage/orgresource/index'),
        name: '终端用户与功能管理',
        meta: { title: '终端用户与功能管理', noCache: true}
      },
      {
        path: '/enduser/endusermanage/user',
        component: () => import('../views/endusermanage/user/index'),
        name: '终端用户用户管理',
        meta: { title: '终端用户用户管理', noCache: true}
      },
      {
        path: '/enduser/endusermanage/category',
        component: () => import('../views/endusermanage/category/index'),
        name: '辅机管理',
        meta: { title: '辅机管理', noCache: true}
      }
    ]
  },
]
export default new Router({
  mode: 'history',
  base:__dirname,
  routes:constantRouterMap
})
