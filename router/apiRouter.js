// apiRouter.js
const Router = require('koa-router');

const router = new Router();

router.get('/test/:id',async ctx=>{
    console.log(ctx.params.id);
    ctx.body = {id:ctx.params.id}  // url 中的 参数
});

router.get('/para',async ctx=>{
    console.log(ctx.query);
    ctx.body = {id:ctx.query}  // url 中的 get 参数 /para?id=5&name=han
});

router.post('/post',async ctx=>{
    console.log(ctx.request.body);  // application/x-www-form-urlencoded | application/json
    ctx.body = {data:ctx.request.body}
});

router.post('/post2',async ctx=>{
    ctx.throw(new Error("aasdfasdfasdfasdf"));
});


const docApi = require('./docHelper');

router.post('/list',async ctx=>{ 
    var page = ctx.request.body.page;   
    await docApi.getList(page.toString(),d=>{
        ctx.body = d;
    })
});

router.post('/doc/:id',async ctx=>{
    await docApi.getDoc(ctx.params.id,d=>{
        ctx.body = d;              
    })
});

module.exports = router;