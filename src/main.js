import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/commont.css'
import router from './router/index'
import store from './store/index'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

createApp(App)
  .use(router).use(store)
  .use(ElementPlus, { locale })
  .mount('#app')
