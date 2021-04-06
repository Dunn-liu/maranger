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
export  function apiUpdateArticle(data){
    return fetch({
        url:'/updateArticle',
        method:'post',
        data
    })
}
export  function apiDelArticle(params){
    return fetch({
        url:'delArticle',
        method:'get',
        params:params
    })
}
