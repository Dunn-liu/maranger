import fetch from './index.js'
function apiRegiste (params) {
  return fetch({
    url: '/route/to/demo',
    method: 'get',
    params
  })
}
export { apiRegiste }
