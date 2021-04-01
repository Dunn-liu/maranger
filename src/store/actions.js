import {apiGetUserAuth} from '@/api/userInfo.js'
import {formatRouterTree } from '@/utils/routerFormat'
import {localGet} from '@/utils/local'
export default {
    async getAuthRouter(context){
        const res = await apiGetUserAuth(localGet('phone')),
            playload = formatRouterTree(res.auth);
        context.commit('saveUserRouters',playload)
        context.commit('saveAuth',true)
    }
}
