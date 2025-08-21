import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // 이 경로가 중요
  },
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 target으로 프록시
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 서버 주소
        changeOrigin: true, // CORS 해결
      },
    },
  },
})
