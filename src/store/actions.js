import {apiGetUserAuth} from '@/api/userInfo.js'
import {formatRouterTree } from '@/utils/routerFormat'
export default {
    async getAuthRouter(context){
        const res = await apiGetUserAuth(context.state.phone),
            playload = formatRouterTree(res.auth)
        context.commit('saveUserRouters',playload)
        context.commit('saveAuth',true)
    }
}
