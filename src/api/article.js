import fetch from './index'
// 获取文章分类数据
export function apiGetClassify() {
    return fetch({
        method: 'get',
        url: '/articleClassify'
    })
}
// 添加文章分类
export function apiAddClassify(data) {
    return fetch({
        method: 'post',
        url: '/addClassify',
        data
    })
}
// 更新文章分类
export function apiUpdataClassify(data) {
    return fetch({
        method: 'post',
        url: '/updataClassify',
        data
    })
}
// 删除文章分类
export function apiDelClassify(id) {
    return fetch({
        method: 'post',
        url: '/delClassify',
        data: {
            id
        }
    })
}
// 发布文章
export function apiPublishArticle(data) {
    return fetch({
        method: 'post',
        url: '/article/publishArticle',
        data
    })
}
// 获取文章列表
export function apiGetArticle(params) {
    return fetch({
        method: 'get',
        url: '/article/queryArticle',
        params: params
    })
}
//更新文章
export function apiUpdateArticle(data) {
    return fetch({
        url: '/article/updateArticle',
        method: 'post',
        data
    })
}
//删除文章
export function apiDelArticle(params) {
    return fetch({
        url: '/article/delArticle',
        method: 'get',
        params: params
    })
}
// 更改文章状态
export function apiChangeStatus(data) {
    return fetch({
        url:'/article/changeStatus',
        method: 'post',
        data
    })
}
