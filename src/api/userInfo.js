import fetch from './index'
export function apiGetUserInfo(){
    return fetch({
        method:'get',
        url:'/profile'
    })
}
export function apiGetUserAuth(phone){
    return fetch({
        method:"get",
        url:'/router',
        params: {phone}
    })
}
export function apiVerifyToken() {
    return fetch({
        method:"get",
        url:'/verifyToken'
    })
}
