import axios from 'axios'
import {localGet,localRemove} from '@/utils/local'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
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
    // if (response.data&&response.data.code == 206) {
    //     ElMessage.error('请先登录!')
    //     router.push('/login')
    //     localRemove('token')
    //   return Promise.reject(response)
    // }
    else{
        return response.data
    }
  },
  error => {
      console.log(error)
  }
)
export default fetch
