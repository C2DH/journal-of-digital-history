import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import webfontDownload from 'vite-plugin-webfont-dl'
import { serifPro, firaCode, firaSans } from './src/assets/fonts/fonts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    optimizeDeps: {     
      include: ['@codemirror/state'],
    },
    resolve: {
      alias: {
          '@codemirror/state': path.resolve(
            __dirname,
            './node_modules/@codemirror/state/dist/index.cjs'
          ),
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
      webfontDownload([serifPro, firaCode, firaSans]),
    ],
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
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
  }
})

