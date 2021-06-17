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
      if (response.data.code === 401){
          ElMessage({
              message:'登录已过期,请重新登录!',
              type:'error',
			  showClose: true
          })
          localRemove('token')
          router.push('/login')
      }
      return response.data
  },
  error => {
      console.log(error)
      return error
  }
)
export default fetch
