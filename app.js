//app.js
const Koa = require('koa')
const BodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const views = require('koa-views')
const path = require('path')
const render = require('koa-ejs'); 
const favicon = require('koa-favicon')

const indexRouter = require('./router/indexRouter');
const apiRouter = require('./router/apiRouter');

const app = new Koa()

app.use(BodyParser({enableTypes:['json', 'form', 'text']}));

app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/node_modules'))

app.use(favicon(('./public/favicon.ico')));

app.use(views(__dirname + '/views', {extension: 'ejs'}))

const handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        //console.error(err,ctx);
        ctx.response.body = {
            code:0,
            message: err.message,
            error:err,
            response:ctx.response
        };
    }
};

app.use(handler);

let mainRouter = new Router();
mainRouter.use('/',indexRouter.routes());
mainRouter.use('/api',apiRouter.routes());

app.use(mainRouter.routes(),mainRouter.allowedMethods());

app.use(async (ctx, next) => {
    await ctx.render('404', {
      title: 'page not find'
    })
})

app.listen(3000,()=>{
    console.log("demo in run");
})

// git 提交测试 20190406