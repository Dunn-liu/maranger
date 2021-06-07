import fetch from './index'
export function apiUploadImg(data){
    return fetch({
        url:'/upload/image',
        method:'post',
        data
    })
}
export function apiGetImages(params) {
    return fetch({
        url: '/image/all',
        method: 'get',
        params
    })
}
