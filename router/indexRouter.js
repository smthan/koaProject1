// indexRouter.js
const Router = require('koa-router');

const docApi = require('./../utils/docHelper');
const txtApi = require('./../utils/fsHelper')

const router = new Router();

router.get('/', async ctx => {
    await ctx.render('index', {
        title: "首页",
        content: '<h1>Index</h1>'
    });
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

router.get('boms', async ctx => {
    await ctx.render('bom', {
        title: "BOM"
    });
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

var axios = require('axios')

async function getValue(cook, cb) {
    await axios.post('http://test1.moldyun.com/front/cam/api/v1/getConstant.do', null, {
        headers: { "Cookie": cook }, // 携带 参数
        //timeout: 100, // 请求超时
    }).then(res => {
        cb(res.data);
    }).catch(err => {
        console.log(err.message);
    });
}
async function getMD(cb) {
    await axios.post('http://test1.moldyun.com/front/upms/user/login', {
        password: "a000000", phoneNum: "13900000000", userFrom: "MOLDCIO+"
    }).then(async function (response) {
        await getValue(response.headers['set-cookie'], (da) => {  // post 为 异步模式 并非顺序执行
            cb(da.data.schModelNames);
        });
    }).catch(function (error) {
        console.log(error);
    });
}

router.post('getMdb', async ctx => {
    await getMD((data) => {
        ctx.body = data;
    });
});

var mysql      = require('mysql');
const pool = mysql.createPool({
    host     :  '192.168.1.65',
    user     :  'root',
    password :  '',
    database :  'mdb_cloud_tenant_data'
  })
 
let query = function (sql, values) {
    return new Promise((resolve, reject) => {  // 返回一个 Promise
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }                    
                    connection.release() // 结束会话
                })
            }
        })
    })
}

router.post('getDb',async ctx=>{
   let data = await query('SELECT part_type_name,name_pre,sys_part_code FROM `t_bom_part_type` T WHERE T.tenant_id = 32');
   console.log(data);
   ctx.body = data;
});

module.exports = router;