
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 關鍵：確保 GitHub Pages 子目錄路徑正確，避免白色畫面
  define: {
    // 注入環境變數供程式碼內部透過 process.env.API_KEY 存取
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    minify: 'terser', // 使用 terser 進行生產環境優化
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase', '@google/genai', 'recharts'],
        },
      },
    },
  },
});
