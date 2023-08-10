import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/templates',
  build: {
    assetsDir: 'chat3',
    rollupOptions: {
      input: {
        index: 'index.html'
      },
      output: {
        chunkFileNames: 'chat3/js/[name]-[hash].js',
        entryFileNames: 'chat3/js/[name]-[hash].js',
        //assetFileNames: '[ext]/[name]-[hash].[ext]',
        assetFileNames: (chunkInfo) => {
          // 用后缀名称进行区别处理
          let subDir = "assets";
          if (path.extname(chunkInfo.name) === ".css") {
            subDir = "css";
          }
          return `chat3/${subDir}/[name]-[hash].[ext]`;
        },
        cssCodeSplit: false,
        cssFileNames: 'chat3/css/[name]-[hash].css',
      },
    }
  }
})
