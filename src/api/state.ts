import fetch from '../utils/http'
type query = {
    creator?: string
    limit?: number
    page?: number
}
// 获取动态数据
export function apiGetState(data:query) {
    return fetch({
        method: 'post',
        url: '/state',
        data
    })
}