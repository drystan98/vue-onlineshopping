import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/Cate";
import Params from "../components/goods/Params";
import List from "../components/goods/List";
import Add from "../components/goods/Add";
import Order from "../components/order/Order";
import Report from "../components/report/Report";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      /*欢迎子路由*/
      {
        path: '/welcome',
        component: Welcome
      },
      /*用户列表子路由*/
      {
        path: '/users',
        component: Users
      },
      /*用户权限子路由*/
      {
        path: '/rights',
        component: Rights
      },
      /*角色列表子路由*/
      {
        path: '/roles',
        component: Roles
      },
      /*分类列表管理路由*/
      {
        path: '/categories',
        component: Cate
      },
      /*分类参数路由*/
      {
        path: '/params',
        component: Params
      },
      /*商品列表路由*/
      {
        path: '/goods',
        component: List
      },
      /*添加商品页面路由*/
      {
        path:'/goods/add',
        component:Add
      },
      /*订单列表页面路由*/
      {
        path:'/orders',
        component:Order
      },
      /*报表页面路由*/
      {
        path:'/reports',
        component:Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从那个路径跳转而来
  //next函数，表示放行
  //  next() 放行  next('/login')强制跳转

  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
