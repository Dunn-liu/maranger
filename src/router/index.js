import {createRouter,createWebHashHistory} from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {ElMessage} from 'element-plus'
import {apiVerifyToken} from '@/api/userInfo.js'
import store from '@/store/index'
import {localGet,localRemove} from '@/utils/local'
import {generateRouter} from '@/utils/routerFormat'
const addRouters=(_route)=>{
    _route.forEach(item=>{
        router.addRoute(item.parentName,item)
    })
}
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
        component:()=>import('../views/layout/Layout.vue'),
    },
    {
        path:'/login',
        name:'Login',
        meta:{title:'登录'},
        component:()=>import('../views/login/Login.vue')
    },
    // 404页面
    { path: '/:pathMatch(.*)*', name: 'NotFound',meta:{title:'404 NotFound'}, component: ()=>import('../views/NotFound.vue')}
]
const router = createRouter({
     history:createWebHashHistory(),
     routes
 })
router.beforeEach(async (to,from,next) => {
    NProgress.start()
    // 获取token判断是否登录
    let isLogin = false
    if(localGet('token')){
        const res = await apiVerifyToken()
        if(res.code == 200){
            isLogin = true
        }else {
            localRemove('token')
        }
    }
    if(isLogin){ // 已登录
        if(to.path.includes('/login')){ // 已登录不可访问登录页
            next({path:'/'}) // 跳转到首页
            NProgress.done()
        }else{ // 异步获取路由
            if(store.state.hasAuth){ // 已有路由
                next()
            }else{ //异步获取路由
                try{
                    await store.dispatch('getAuthRouter')
                    const accessRouters = generateRouter(store.state.userRouters)
                    addRouters(accessRouters)
                    console.log(router.getRoutes())
                    next({path:to.path,replace:true})
                }catch (e) {
                    console.log(e)
                    next({
                        path:'/login',
                        params:{
                            redirect:to.path
                        }
                    })
                }
            }
        }
    }else { // 未登录
        if(to.path.includes('/login')){ // 未登录登录页直接访问
            next()
        }else { // 其他页面
            ElMessage.error('请先登录!')
            next({
                path:'/login',
                params:{
                    redirect:to.path
                }
            })
            NProgress.done()
        }
    }
})
router.afterEach(to => {
    document.title = to.meta.title
    NProgress.done()
})
export default router
