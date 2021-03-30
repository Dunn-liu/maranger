export default {
    saveAuth(state,playload){
        state.hasAuth = playload
        console.log(state)
    },
    saveUserPhone(state,playload){
        state.phone = playload
    }
}
