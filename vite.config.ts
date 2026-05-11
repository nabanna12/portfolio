import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js in its own chunk — loaded separately, doesn't block React boot
          three: ['three'],
          // Framer Motion in its own chunk
          motion: ['framer-motion'],
          // React core together
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Raise warning limit since Three.js is legitimately large
    chunkSizeWarningLimit: 800,
  },
})