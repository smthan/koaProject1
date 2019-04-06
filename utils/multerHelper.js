const multer = require('koa-multer');
const path = require('path');

//以下是配置
var storage = multer.diskStorage({
    //定义文件保存路径
    destination: function (req, file, cb) {
        cb(null, './public/imgs/'); //路径根据具体而定。如果不存在的话会自动创建一个路径
    }, //注意这里有个，
    //修改文件名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, fileFormat[0] + "_" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

var upload = multer({
    storage: storage
});

module.exports = upload;