import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // server: {
  //   host: '192.168.104.169',
  //   port: 2004, // ya jo bhi port chahiye
  // },

})
