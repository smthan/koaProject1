const fs = require('fs')

const readTxt = function (path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,(err,data)=>{
            if(err)
                reject(err);
            resolve(data);
        })
    });
}

async function LoadTxt(cb){
    await readTxt('./public/txt/index.txt',cb).then(async data=>{
        const txt = data.toString();
        const titles = txt.split('\r\n');
        var dts=[];
        for(t of titles){
            await readTxt('./public/txt/'+t,cb).then(d=>{
                var st={
                    title : t,
                    content : d.toString().split('\r\n')
                };
                dts.push(st);
            });
        }
        await cb(dts);
    }).catch(err=>{
        console.log(err);
    });
}
module.exports = {
    LoadTxt
}