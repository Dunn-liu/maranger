import axios from 'axios'
import {localGet} from '@/utils/local'
const fetch = axios.create({
  baseURL: '/api',
  withCredentials: true
})
fetch.interceptors.request.use(
  config => {
    config.headers.authorization = localGet('token')||''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
fetch.interceptors.response.use(
  response => {
      return response.data
  },
  error => {
      console.log(error)
  }
)
export default fetch
