import fetch from './index'
export function apiGetClassify() {
    return fetch({
        method:'get',
        url:'/articleClassify'
    })
}
export function apiPublishArticle(data){
    return fetch({
        method:'post',
        url:'/publishArticle',
        data
    })
}
export function apiGetArticle(params){
    return fetch({
        method:'get',
        url:'/queryArticle',
        params:params
    })
}
