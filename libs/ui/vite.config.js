import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@c2dh/jdh-ui',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.js'
        if (format === 'umd') return 'index.umd.cjs'
        return `index.${format}.js`
      },
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
  plugins: [react(), dts([{ include: 'src/**/*.{ts,tsx}' }])],
})
