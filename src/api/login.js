import fetch from './index.js'
function apiToLogin(data){
    return fetch({
        url:'/login',
        method:'post',
        data
    })
}
export {
    apiToLogin
}
