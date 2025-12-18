
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 關鍵：確保 GitHub Pages 子目錄路徑正確
  build: {
    minify: 'terser', // 使用更強大的混淆器
    terserOptions: {
      compress: {
        drop_console: true, // 生產環境移除 console
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
