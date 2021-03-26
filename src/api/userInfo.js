import fetch from './index'
export function apiGetUserInfo(){
    return fetch({
        method:'get',
        url:'/profile'
    })
}
