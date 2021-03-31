import {createStore} from 'vuex'
import createPersistedState  from 'vuex-persistedstate'
import state from './state'
import actions from './actions'
import mutations from './mutations'
const store = createStore({
    plugins:[createPersistedState(
        {
            reducer(val){
                return {
                   phone: val.phone
                }
            }
        }
    )],
    state,
    actions,
    mutations
})
export default store
