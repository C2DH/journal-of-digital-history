import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'jdh-lib',
      fileName: (format) => `jdh-lib.${format}.ts`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  plugins: [react()],
})
