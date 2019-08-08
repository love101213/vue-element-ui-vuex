import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/Users.vue'
import Rights from './components/power/Right.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
import Report from './components/report/Report.vue'
Vue.use(Router)
    //进入页面的限制 类似路由拦截/
const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/welcome',
                children: [
                    { path: '/welcome', component: Welcome },
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Params },
                    { path: '/goods', component: List },
                    { path: '/goods/add', component: Add },
                    { path: '/orders', component: Order },
                    { path: '/reports', component: Report }

                ]
            },

        ]
    })
    // to将要访问的路径 fron 从哪个路径跳转过来 next() 是一个函数 next() 或者nwext('路径')
    // 强制跳转   导航守卫
router.beforeEach((to, from, next) => {
        if (to.path == '/login') return next()
        const tokenStr = window.sessionStorage.getItem('token')
        if (!tokenStr) return next('/login')
        next()
    })
    // 一定要把路由暴露出去
export default router