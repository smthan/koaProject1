// indexRouter.js
const Router = require('koa-router');

const docApi = require('./docHelper');
const txtApi = require('./fsHelper')

const router = new Router();

router.get('/', async ctx => {
    await ctx.render('doclist', { title: "博客" });     
});


router.get('txt', async ctx => {
    await txtApi.LoadTxt(async (d)=>{
        await ctx.render('txt',{title:'博客 - 详情',content:d});     
    });  
});

router.get('login', async ctx => {
    await ctx.render('login', { title: "登录" });
});

router.get('register', async ctx => {
    await ctx.render('register', { title: "注册" });
});

router.get('docs', async ctx => {
    await ctx.render('doclist', { title: "博客" });
});



router.get('doc/:id', async ctx => {
    /*
    await axios.get('https://cnodejs.org/api/v1/topic/'+ctx.params.id).then(async res => {
        d = res.data.data;   
        console.log(d);  
        await ctx.render('doc',{title:'博客 - 详情',doc:d});  
    }).catch(err=>{
        console.log(err);
    });        
     */
    await docApi.getDoc(ctx.params.id,async (d)=>{
        await ctx.render('doc',{title:'博客 - 详情',doc:d});     
    });   
});

router.post('login', async ctx => {
    ctx.body = {
        code: 0,
        email: ctx.request.body.email,
        password: ctx.request.body.password
    }
});

router.post('register', async ctx => {
    ctx.body = {
        code: 0,
        emial: ctx.request.body.email,
        name: ctx.request.body.name,
        password: ctx.request.body.password
    }
});

module.exports = router;