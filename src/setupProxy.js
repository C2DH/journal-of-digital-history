const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')

const target = process.env.REACT_APP_PROXY || 'http://localhost'
const apiPath = process.env.REACT_APP_API_ROOT || '/api'

fs.appendFile(
  './setupProxy.log',
  `${new Date().toISOString()} target=${target} apiPath=${apiPath} REACT_APP_PROXY=${
    process.env.REACT_APP_PROXY
  } REACT_APP_ENABLE_CODE_EXPLAINER_PROXY=${process.env.REACT_APP_ENABLE_CODE_EXPLAINER_PROXY} \n`,
  (err) => console.error(err),
)

module.exports = function (app) {
  app.use(
    '/api/explain',
    createProxyMiddleware({
      target: process.env.REACT_APP_ENABLE_CODE_EXPLAINER_PROXY || 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/explain': '/explain',
      },
    }),
  )
  app.use(
    apiPath,
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  )
  app.use(
    '/proxy-githubusercontent',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  )
}
