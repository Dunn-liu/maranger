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
    if (response.data&&response.data.code == 200) {
      return response.data
    }
    else{
        return response.data
    }
  },
  error => {
      console.log(error)
  }
)
export default fetch
