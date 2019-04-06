const Router = require('koa-router');

var apiBomCtrl = require('./../../utils/bomHelper');
var uploadOption = require('./../../utils/multerHelper')

const router = new Router();

router.get('/del/:id', apiBomCtrl.deletebyId);

router.get('/download', apiBomCtrl.download);

router.post('/add', apiBomCtrl.add);

router.post('/addFile', uploadOption.single('file'), apiBomCtrl.addFile);

router.get('/list', apiBomCtrl.getList
/*async (ctx,next)=>{
    console.log("1");
    await apiBomCtrl.getAllBom(data=>{
        ctx.body = data;
    })
    console.log("2");
}*/);

module.exports = router;