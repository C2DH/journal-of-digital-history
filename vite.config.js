import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import webfontDownload from 'vite-plugin-webfont-dl'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      proxy: {
        '/api/explain': {
          target: env.VITE_ENABLE_CODE_EXPLAINER_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/explain/, '/explain'),
        },
        '/api': {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
        '/proxy-githubusercontent': {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      nodePolyfills(),
      react(),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          exportType: 'default',
        },
      }),
      webfontDownload(),
    ],
    build: {
      outDir: 'build',
      emptyOutDir: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          dashboard: resolve(__dirname, '/dashboard/index.html'),
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
    resolve: {
      preserveSymlinks: true,
    },
  }
})
