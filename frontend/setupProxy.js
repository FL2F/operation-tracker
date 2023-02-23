const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      // target: "http://localhost:8080",
      target: "https://operation-tracker-backend-3yvuhaorjq-uc.a.run.app",
      changeOrigin: true,
    })
  );
};
