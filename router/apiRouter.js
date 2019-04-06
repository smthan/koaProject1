// apiRouter.js
const Router = require('koa-router');
const bomRouter = require('./routers/bomRouter')
const docApi = require('./../utils/docHelper');

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

/*
var apiBomCtrl = require('./../utils/bomHelper');
var uploadOption = require('./../utils/multerHelper')

router.get('/bom/del/:id', apiBomCtrl.deletebyId);

router.get('/bom/download', apiBomCtrl.download);

router.post('/bom/add', apiBomCtrl.add);

router.post('/bom/addFile', uploadOption.single('file'), apiBomCtrl.addFile);

router.get('/bom/list', apiBomCtrl.getList);
*/

//  使用 嵌套 路由 模式
router.use('/bom', bomRouter.routes()); 

module.exports = router;