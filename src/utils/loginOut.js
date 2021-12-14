import { localRemove } from '@/utils/local'
import router from '@/router/index'
import {useStore} from 'vuex'
export default function loginOut() {
  const store = useStore();
  localRemove('token')
  store.commit('removeUserInfo')
  router.push('/login')
}