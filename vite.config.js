import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@' will point to /src
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@API': path.resolve(__dirname, './src/API'),
      '@Assets': path.resolve(__dirname, './src/assets'),
    },
  },
   server: { 
    host: true, // or use '0.0.0.0' for more control
    port: 8001, // or any port you prefer
  },
  test: {
     globals: true,
    environment: 'jsdom',
     setupFiles: ['./src/setupTest.jsx'],
  },
  coverage: {
      provider: 'c8', // or 'v8'
      reporter: ['text', 'html', 'lcov'], // output formats
      exclude: ['src/__test__', '**/*.test.*'], // files to exclude
    },
})
