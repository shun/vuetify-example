import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

const base = process.env.GITHUB_PAGES === 'true' ? '/vuetify-example/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
})
