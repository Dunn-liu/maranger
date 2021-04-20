import fetch from './index'
export function apiUploadImg(data){
    return fetch({
        url:'/upload/image',
        method:'post',
        data
    })
}
