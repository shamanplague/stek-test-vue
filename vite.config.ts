import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@repositories': path.resolve(__dirname, 'src/repositories'),
      '@strategies': path.resolve(__dirname, 'src/strategies'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  }
})
