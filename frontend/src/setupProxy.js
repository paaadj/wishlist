const { createProxyMiddleware } = require("http-proxy-middleware");

const dom = process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : "backend";

module.exports = function (app) {
  app.use(
    '/backend',
    createProxyMiddleware({
      target: `http://${dom}:8000`,
      changeOrigin: true,
      pathRewrite: function (path, req) { return path.replace('/backend', '') }
    })
  );
};
