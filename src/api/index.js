import axios from 'axios'
import { ElMessage } from 'element-plus'
const fetch = axios.create({
  baseURL: '/api',
  withCredentials: true
})
fetch.interceptors.request.use(
  config => {
    config.headers.token = 'dskjhgdkajs'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
fetch.interceptors.response.use(
  response => {
    if (response.status == 200) {
      return response
    }
    if (response.status == 206) {
      ElMessage.error('过期')
      return Promise.reject(response.data.message)
    }
  },
  error => {}
)
export default fetch
