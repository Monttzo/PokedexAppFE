const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
    app.use(createProxyMiddleware('/api2', {
        target: 'http://54.236.255.171' ,
        changeOrigin: true,
        pathRewrite: { '^/api2': '' }
    })
    );
}
