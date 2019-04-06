var Db = require('./mongoDbHelper');

function callBack(err, data) {
    var ret = null;
    if (err) {
        var errMsg = "add error : " + err;
        console.log(errMsg);
        ret = {
            code: 100,
            message: errMsg
        };     
    }
    else {
        console.log("add ok : " + data);
        ret = {
            code: 0,
            message: 'OK',
            data: data
        };
    }
    //throw Error ('普通函数抛出的异常： callback...');
    return ret;
}

async function getAllBom(cb) {
    var p = new Promise(async function (res, rej) {
        await Db.bomPart.find({}, function (err, data) {
            if (err)
                rej(err);
            res(data);
        });
    });
    await p.then(async function (data, err) {
        await cb(data, null);
    }).catch(function (err) {
        cb(null, new Error("getAllBom error : " + err));
    });
}

async function deletebyId(ctx, next) {
    var id = ctx.params.id;
    console.log('del ' + id);
    await Db.bomPart.remove({ _id: Db.getMid(id) }, function (err, data) {
        if (err) throw err;
        console.log('delete ' + id + ' ' + data);
        ctx.body = ({
            code: 0,
            del_id: id
        });
    });
}

//  异步 转 同步 | 使用 promise 将异步操作转为同步操作
const saveDB = function (bom) {
    return new Promise(async (resolve, reject) => {  // Promise 内部 抛出的异常 无法捕获 注意不能再内部 throw 异常
        /*
        //  可以 正常 抛出 异常 callBack
        const db = await bom.save();
        try {
            resolve(callBack(null,db));
        } catch (error) {
            error.message = 'Promise 中 try catch 捕获到的异常:\n' + error.message;
            reject(error);
        }
        */
        
        bom.save(async (err, db) => {
            if (err)
                reject(err);
            else {
                try {
                    resolve(callBack(null, db));
                } catch (error) {
                    error.message = 'bom.save 回调函数中 出现异常 ：\n'  + error.message;
                    reject(error);
                }
            }
        });                          
    });
}

async function add(ctx, next) {
    try {
    var bom = new Db.bomPart({
        partNo: ctx.request.body.partNo,
        partName: ctx.request.body.partName,
        img: ctx.request.body.img,
        size: ctx.request.body.size,
        material: ctx.request.body.material,
        hot: ctx.request.body.hot,
        supplier: ctx.request.body.supplier,
        note: ctx.request.body.note
    });
    /*
    try {
        ctx.body = {
            code: 0,
            data: await bom.save() // 使用 then + catch 模式 无法 为 ctx.body 赋值
        };
    } catch (error) {
        next(error);
    }*/

    //throw Error("这是个测试异常");  // 可以被下面的catch捕获
    ctx.body = await saveDB(bom); // ctx.body 不能再回调函数中赋值
    //ctx.throw(new Error('ctx.throw')); // 可以 抛出 异常 可以被下面的catch捕获
    /*
    // 使用 then + catch 模式 无法 为 ctx.body 赋值  (下面的方式是错误的)
    saveDB(bom).then(db=>{
        ctx.body = db;
    }).catch(err=>{
        next(err);
    });
    */    
   } catch (error) {
       error.message = '数据库保存数据失败：' + '\n' + error.message;
       ctx.throw(error);
   }
};

async function addFile(ctx, next) { 
    try {
        console.log(">>> addFile : " + ctx.req.file.filename + " " + ctx.req.body.partNo);
        console.log(ctx.status);
        if (ctx.req.file.length === 0) { //判断一下文件是否存在，也可以在前端代码中进行判断。
            resx.render("error", {
                message: "上传文件不能为空！"
            });
            return
        } else {
            let file = ctx.req.file;
            var bom = new Db.bomPart({
                partNo: ctx.req.body.partNo,
                partName: ctx.req.body.partName,
                img: 'imgs/' + file.filename,
                size: ctx.req.body.size,
                material: ctx.req.body.material,
                hot: ctx.req.body.hot,
                supplier: ctx.req.body.supplier,
                note: ctx.req.body.note
            });

            /*
            try {
                ctx.body = {
                    code: 0,
                    data: await bom.save()
                };
            } catch (error) {
                next(error);
            }*/
            
            ctx.body = await saveDB(bom); // ctx.body 不能再回调函数中赋值
            
            
        }  
    } catch (error) {
        ctx.throw(error);
    }
};

async function getList(ctx, next) {
    console.log('>>> getList');
    await getAllBom(async function (data, err) {
        if (err) {
            console.log(err);
            throw err;
        }
        await (()=>{
            ctx.body = data;
            console.log(">>> getList END!")
        })(); 
    });
}

//  下载 文件
async function download(ctx, next) {
    await ctx.download('public/imgs/12.png', '123.png', err => {
        if(err)
            ctx.status(404).send(err.message);
    })
}

module.exports = {
    add,
    addFile,
    getList,
    deletebyId,
    getAllBom,
    download,
    callBack
}
