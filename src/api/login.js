import fetch from './index.js'
function apiToLogin(data){
    return fetch({
        url:'/login',
        method:'post',
        data
    })
}
function apiRegister(data){
    return fetch({
        url:'/register',
        method:'post',
        data
    })
}
function apiSendCode(data){
    return fetch({
        url:'/getEmailCode',
        method:'post',
        data
    })
}
export {
    apiToLogin,
    apiRegister,
    apiSendCode
}
