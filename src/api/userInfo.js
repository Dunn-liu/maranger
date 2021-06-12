import fetch from './index'
export function apiGetUserInfo(phone){
    return fetch({
        method:'get',
        url:'/profile',
        params: {phone}
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
export function apiUpdateInfo(data) {
    return fetch({
        method:"post",
        url:'/userinfo/update',
        data
    })
}
export function apiUpdateAvatar(data) {
    return fetch({
        method:"post",
        url:'/userinfo/updateAvatar',
        data
    })
}
