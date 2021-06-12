export default {
    saveAuth(state,payload){
        state.hasAuth = payload
    },
    saveUserinfo(state,payload){
        state.userinfo = payload
    },
    saveUserRouters(state,payload){
        state.userRouters = payload
    },
    saveHeaderTitle(state,payload){
        state.headerTitle = payload
    },
}
