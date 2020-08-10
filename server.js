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
        fs.readdir(public, (err, files) => {
        console.log(files);
ctx.body = files[0].size;
      });
  
  
  
 
});
router.get('/all', async (ctx) => {
   console.log("All");
      fs.readdir(public, (err, files) => {
        console.log(files);
        f = [];
        files.forEach(file => {
          let path = public + "//" + file;
          let size = fs.statSync(path)["size"];
          if (size > 0) {
            console.log("2");
            f.push({path: "https://back-image-manager.herokuapp.com/public/" + file, size: `${size}`});
          }
        });
      });
      ctx.body = f;
});


router.get('/delById', async (ctx) => {
const js = JSON.parse(ctx.body);
      console.log(js.num);
      console.log(public);
      fs.readdir(public, (err, files) => {
        files.forEach(file => {
          let path = public + "//" + file;
          console.log(path);
          // console.log(fs.statSync(path)["size"]);
          if (fs.statSync(path)["size"].toString() === js.num) {
            console.log(111);
            fs.unlink(path, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("file was del");
              }
            });
          }
        });
      });
  ctx.body = true;
});

router.get('/create', async (ctx) => {
console.log("create");
      console.log(ctx.files.file.size);
      if(ctx.files.file.size>0){
      const reader = fs.createReadStream(ctx.files.file.path);
      const stream = fs.createWriteStream(path.join(public, Math.random() + ".png"));
      reader.pipe(stream);}
      
 ctx.body = true;
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
