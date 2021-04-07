import axios from 'axios'
import {localGet} from '@/utils/local'
const {VITE_BASE_URL} = import.meta.env
console.log('VITE_BASE_URL',VITE_BASE_URL)
const fetch = axios.create({
  baseURL: VITE_BASE_URL,
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
