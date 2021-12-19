import { localRemove,sessionRemove } from '@/utils/local'
import router from '@/router/index'
import store from '@/store/index'
export default function loginOut() {
  store.commit('saveUserinfo',{})
  store.commit('saveAuth',false)
  localRemove('token')
  router.push('/login')
}