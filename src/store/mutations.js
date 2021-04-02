export default {
    saveAuth(state,playload){
        state.hasAuth = playload
    },
    saveUserinfo(state,playload){
        state.userinfo = playload
    },
    saveUserRouters(state,playload){
        state.userRouters = playload
    },
    saveHeaderTitle(state,playload){
        state.headerTitle = playload
    }
}
