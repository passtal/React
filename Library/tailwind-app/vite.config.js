import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // '/api'로 시작하는 요청들을 프로시 처리
      '/api' : {
        // 실제 요청을 보낼 백엔드 주소
        target : 'http://localhost:8080',
        // 요청 헤더 host 를 지정한 target으로 변경
        // Host : http://localhost:5173/api/boards
        // → Host : http://localhost:8080/boards
        changeOrigin : true,
        rewrite : (path) => path.replace(/^\/api/, ''),
        // 프록시 동작 설정
        configure: (proxy) => {
          // proxyReq 이벤트 : 백엔드 요청을 가로채는 이벤트
          proxy.on('proxyReq', (proxyReq) => {
            // origin 헤더 제거
            proxyReq.removeHeader('origin')
          })
        }
      }
    }
  }
})