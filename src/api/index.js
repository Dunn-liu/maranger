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
    config.headers.authorization = 'Bearer '+localGet('token')||''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
fetch.interceptors.response.use(
  response => {
      if(response.data && response.data.code !== 200) {
          ElMessage({
              message:response.data.msg || 'error',
              type:'error',
              showClose: true
          })
      }
      return response.data
  },
  error => {
      if (error.response && error.response.status === 401){
          ElMessage({
              message:'token已过期,请重新登录!',
              type:'error',
              showClose: true
          })
          localRemove('token')
          router.push('/login')
      }else {
          ElMessage({
              message:error.response.data.msg,
              type:'error',
              showClose: true
          })
      }
      return error
  }
)
export default fetch
