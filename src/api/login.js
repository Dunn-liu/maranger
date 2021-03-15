import fetch from './index.js'
function getUserRouters(data){
    return fetch({
        url:'/router',
        method:'post',
        data
    })
}
export {
    getUserRouters
}
