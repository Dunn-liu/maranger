import {apiGetUserAuth,apiGetUserInfo} from '@/api/userInfo.js'
import {formatRouterTree } from '@/utils/routerFormat'
import {localGet} from "../utils/local";
export default {
    async getAuthRouter({commit}){
        const res = await apiGetUserAuth(localGet('email')),
            playload = formatRouterTree(res.auth);
        commit('saveUserRouters',playload)
        commit('saveAuth',true)
    },
    async getUserInfo({commit}) {
        const resUser = await apiGetUserInfo(localGet('email'))
        commit('saveUserinfo',resUser.data)
    }
}
