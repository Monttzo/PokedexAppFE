const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/pokedexapp', // Cambia esto a la ruta de tu API
    createProxyMiddleware({
      target: 'http://54.236.255.171', // Cambia esto a la URL de tu servidor HTTP
      changeOrigin: true,
    })
  );
};
