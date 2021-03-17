import {createRouter,createWebHashHistory} from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const routes = [
    {
        path: '/home',
        name:'Home',
        meta:{title:'首页'},
        component:()=>import('../views/layout/Layout.vue')
    },
    {
        path:'/login',
        name:'Login',
        meta:{title:'登录'},
        component:()=>import('../views/login/Login.vue')
    }
]
const router = createRouter({
     history:createWebHashHistory(),
     routes
 })
router.beforeEach((to,from,next) => {
    NProgress.start()
next()
})
router.afterEach(to => {
    document.title = to.meta.title
    NProgress.done()
})
export default router
