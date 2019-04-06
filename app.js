//app.js
const Koa = require('koa')
const BodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const views = require('koa-views')
const json = require('koa-json')
// const logger = require('koa-logger')
// const koaBunyanLogger = require('koa-bunyan-logger');
// const koaPinoLogger = require('koa-pino-logger');
const {accessLogger,systemLogger,consolelogger:logger,} = require('./utils/log4');
const path = require('path')
const render = require('koa-ejs'); 
const favicon = require('koa-favicon')

const indexRouter = require('./router/indexRouter');
const apiRouter = require('./router/apiRouter');

const app = new Koa()

app.use(BodyParser()); //{enableTypes:['json']}

app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/node_modules'))

app.use(favicon(('./public/favicon.ico')));

app.use(views(__dirname + '/views', {extension: 'ejs'}))

app.use(json());
// app.use(logger());  // 显示 请求的 url 和 响应时间
// app.use(koaBunyanLogger());
// app.use(koaPinoLogger());
 app.use(accessLogger());

//  全局 异常处理 | 在回调函数重 throw 抛出的异常 一定要 【就近】 捕获并处理
const handler = async (ctx, next) => {  // reject 异常
    try {
        await next();
    } catch (err) {
        console.log("### 服务器 出现 异常 ：");
        ctx.response.status = err.statusCode || err.status || 500;
        error = {
            code: 0,
            message: err.message,
            url: ctx.request.url,
            stack: err.stack,
            error: err,
            response: ctx.response
        }
        //console.error(JSON.stringify(error)); // 对象 转 Json 字符串
        //console.error('### error message:\n' + err.message, '\n### error stack:\n' + err.stack);
        //ctx.log.info('xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        //ctx.log.error('### error message:\n' + err.message, '\n### error stack:\n' + err.stack);
        systemLogger.error('### error message:\n' + err.message, '\n### error stack:\n' + err.stack);
        //logger.error('### error message:\n' + err.message, '\n### error stack:\n' + err.stack);
        //systemLogger.error(JSON.stringify(error));
        ctx.response.body = error;
    }
};

app.use(handler);

let mainRouter = new Router();
mainRouter.use('/',indexRouter.routes());
mainRouter.use('/api',apiRouter.routes());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.use(async (ctx, next) => {
    systemLogger.error("### no find : " + ctx.req.url);
    await ctx.render('404', {
      title: 'page not find'
    })
})

// app.on('error', err => {
//     logger.error(err);
// });

/*
app.onerror = (err)=>{
    console.log('********************************************');
    console.log(err);
}

app.on('error', function (err) {
    console.log('++++++++++++++++++++++++++++++++++++++++++++');
    log.error('server error', err);
});

app.on('error', function (err, ctx) {
    console.log('--------------------------------------------');
    log.error('server error', err, ctx);
});
*/
app.listen(3000,()=>{
    console.log("demo in run");
})

// git 提交测试