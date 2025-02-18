import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          exportType: 'default',
        },
      }),
    ],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/explain': {
          target: env.VITE_ENABLE_CODE_EXPLAINER_PROXY || 'http://localhost:5000',
          changeOrigin: true,
          pathRewrite: {
            '^/api/explain': '/explain',
          },
        },
        '/api': {
          target: env.VITE_PROXY || 'http://localhost',
          changeOrigin: true,
        },
        '/proxy-githubusercontent': {
          target: env.VITE_PROXY || 'http://localhost',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 3000,
      open: true,
      proxy: {
        '/api/explain': {
          target: env.VITE_ENABLE_CODE_EXPLAINER_PROXY || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/explain/, '/explain'),
        },
        '/api': {
          target: env.VITE_PROXY || 'http://localhost',
          changeOrigin: true,
        },
        '/proxy-githubusercontent': {
          target: env.VITE_PROXY || 'http://localhost',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: false,
      outDir: 'dist',
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
  }
})
