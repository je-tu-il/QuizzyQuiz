import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    include: ['peerjs', 'lucide-react', 'qrcode.react', 'react-router-dom'],
  },
  server: {
    host: true, // expose local IP so other devices on same WiFi can join easily
  },
});
