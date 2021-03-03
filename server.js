const promBundle = require("express-prom-bundle");
const next = require('next');
const logger = require('koa-logger');
const Koa = require('koa');
const Router = require('@koa/router');
const c2k = require("koa-connect");
const metricsMiddleware = promBundle({
  includePath: false,
  includeMethod: true,
  buckets: [0.1, 0.2, 0.3, 0.5, 1, 2, 5],
  promClient: {
    collectDefaultMetrics: {}
  }
});

// Initialize KoaJs server and router
const dev = process.env.NODE_ENV !== 'production'
const server = new Koa();
const router = new Router();
server.use(c2k(metricsMiddleware));

if (!dev) {
  server.use(logger());
}

// Initialize NextJs instance and expose request handler
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

(async () => {
  try {
    await nextApp.prepare();

    router.get('/healthz', async ctx => ctx.body = 'ok');

    router.get('(.*)', async ctx => {
      await handler(ctx.req, ctx.res);
      ctx.respond = false;
    });

    router.post('(.*)', async ctx => {
      await handler(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(router.routes());
    server.listen(3000, _ => console.log('App running on port 3000'));
  } catch (e) {
    console.error(e);
    process.exit();
  }
})();