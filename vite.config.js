import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  proxyTable:{
    '/api': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    }
  }
})
