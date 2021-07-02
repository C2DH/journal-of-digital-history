const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')

const target = process.env.REACT_APP_PROXY || 'http://localhost'
const apiPath = process.env.REACT_APP_API_ROOT || '/api'

fs.appendFile(
  './setupProxy.log',
  `${(new Date()).toISOString()} target=${target} apiPath=${apiPath}\n`,
  (err) => console.error(err)
);

module.exports = function(app) {
  app.use(
    apiPath,
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
  app.use(
    '/proxy-githubusercontent',
    createProxyMiddleware({
      target: 'https://raw.githubusercontent.com',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy-githubusercontent': '/', // rewrite path
      },
    })
  );
};
