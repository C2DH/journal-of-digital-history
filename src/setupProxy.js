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
};