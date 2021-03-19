import {createRouter,createWebHashHistory} from "vue-router";
import state from '../store/state'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const routes = [
    // 路由重定向
    {
        path:'/',
        redirect:'/home'
    },
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
    },
    {
        path:'/register',
        name:'Register',
        meta:{title:'注册'},
        component:()=>import('../views/login/Register.vue')
    },
    // 404页面
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: ()=>import('../views/NotFound.vue')}
]
const router = createRouter({
     history:createWebHashHistory(),
     routes
 })
router.beforeEach((to,from,next) => {
    NProgress.start()
    // if(to.path==='/login'||to.path==='/register'){
    //     next()
    // }else{
    //     if(!state.userinfo.token){
    //
    //     }
    // }
    next()

})
router.afterEach(to => {
    document.title = to.meta.title
    NProgress.done()
})
export default router
