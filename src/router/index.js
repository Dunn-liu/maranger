import {createRouter,createWebHistory} from "vue-router";
const routes = [
    {
        path: '/home',
        name:'Home',
        component:()=>import('../views/layout/Layout.vue')
    },
    {
        path:'/login',
        name:'Login',
        component:()=>import('../views/login/Login.vue')
    }
]
const router = createRouter({
     history:createWebHistory(),
     routes
 })
export default router