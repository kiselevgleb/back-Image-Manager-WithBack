const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');
const public = path.join(__dirname, './public')
const app = new Koa();
const uuid = require('uuid');

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({
      ...headers
    });
    try {
      return await next();
    } catch (e) {
      e.headers = {
        ...e.headers,
        ...headers
      };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));
let f = [];
const Router = require('koa-router');
const router = new Router();
router.get('/pub', async (ctx) => {
console.log(ctx);
 ctx.body = "servers";
});


app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
