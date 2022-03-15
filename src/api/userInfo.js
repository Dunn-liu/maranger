import fetch from '@/utils/http'
export function apiGetUserInfo(email) {
    return fetch({
        method: 'get',
        url: '/profile',
        params: { email }
    })
}
export function apiGetUserAuth(email) {
    return fetch({
        method: "get",
        url: '/router',
        params: { email }
    })
}
export function apiUpdateInfo(data) {
    return fetch({
        method: "post",
        url: '/userinfo/update',
        data
    })
}
export function apiUpdateAvatar(data) {
    return fetch({
        method: "post",
        url: '/userinfo/updateAvatar',
        data
    })
}
export function apiResetPass(data) {
    return fetch({
        method: "post",
        url: '/userinfo/resetPass',
        data
    })
}
