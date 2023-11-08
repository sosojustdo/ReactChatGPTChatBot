import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),compression()],
  base: '/static/templates',
  build: {
    assetsDir: 'chat4',
    rollupOptions: {
      input: {
        index: 'index.html'
      },
      output: {
        chunkFileNames: 'chat4/js/[name]-[hash].js',
        entryFileNames: 'chat4/js/[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          // 用后缀名称进行区别处理
          let subDir = "assets";
          if (path.extname(chunkInfo.name) === ".css") {
            subDir = "css";
          }
          return `chat4/${subDir}/[name]-[hash].[ext]`;
        },
        cssCodeSplit: false,
        cssFileNames: 'chat4/css/[name]-[hash].css',
      },
    }
  }
})
