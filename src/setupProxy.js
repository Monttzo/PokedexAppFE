const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api2', // Esto debe coincidir con el prefijo en las solicitudes
    createProxyMiddleware({
      target: 'http://54.236.255.171',
      changeOrigin: true,
      pathRewrite: { '^/api2': '' } // Esto elimina el prefijo /api2 en las solicitudes reales
    })
  );
};
