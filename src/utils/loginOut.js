import { localRemove,sessionRemove } from '@/utils/local'
import router from '@/router/index'
export default function loginOut() {
  localRemove('token')
  router.push('/login')
  sessionRemove('vuex')
}