import fetch from '@/utils/http'
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
export function apiDelImage(id) {
    return fetch({
        url: '/image/del',
        method: 'get',
        params:{id}
    })
}
