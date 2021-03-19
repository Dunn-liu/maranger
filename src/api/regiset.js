import fetch from './index.js'
function apiRegister (data) {
  return fetch({
    url: '/peoples',
    method: 'get',
    data
  })
}
export { apiRegister }
