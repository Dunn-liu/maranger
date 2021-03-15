import fetch from './index.js'
function apiRegiste (data) {
  return fetch({
    url: '/peoples',
    method: 'get',
    data
  })
}
export { apiRegiste }
