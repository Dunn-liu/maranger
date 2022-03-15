import fetch from '@/utils/http'
export function apiGetRouterAll(){
    return fetch({
        method: 'get',
        url: '/getAllRouter'
    })
}
export function apiGetUserList(data) {
    return fetch({
        method: 'get',
        url: '/getUserList',
        params:data
    })
}
export function apiChangeStatus(data) {
    return fetch({
        method: 'post',
        url: '/changeStatus',
        data
    })
}
export function apiResetPassWord(id) {
    return fetch({
        method: 'post',
        url: '/resetPassWord',
        data:{id}
    })
}
export function apiUpdateRouter(data) {
    return fetch({
        method: 'post',
        url: '/updateRouter',
        data
    })
}
export function apiDelUser(id) {
    return fetch({
        method: 'post',
        url: '/delUser',
        data:{id}
    })
}