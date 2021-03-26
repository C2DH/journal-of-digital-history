const { createProxyMiddleware } = require('http-proxy-middleware');
const target = process.env.REACT_APP_PROXY || 'http://localhost'

console.info('using setupProxy, target:', target)

module.exports = function(app) {
  app.use(
    '/api',
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
