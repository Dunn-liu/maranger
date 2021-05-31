import axios from 'axios'
import {localGet,localRemove} from '@/utils/local'
import {ElMessage} from 'element-plus'
import router from '../router/index'
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
      if (response.data.code === 206){
          ElMessage({
              message:response.data.msg,
              type:'error'
          })
          localRemove('token')
          router.push('/login')
      }
      return response.data
  },
  error => {
      console.log(error)
  }
)
export default fetch
