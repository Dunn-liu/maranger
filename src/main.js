import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/commont.css'
import router from './router/index'

createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
