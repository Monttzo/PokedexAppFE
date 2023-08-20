const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
  app.use(createProxyMiddleware('/pokedexapp',
  { target: 'http://54.236.255.171' 
  }));
}
