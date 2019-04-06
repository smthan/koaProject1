const path = require('path'); //引入原生path模块
const log4js = require('koa-log4'); //引入koa-log4

let programName = "log4j";

log4js.configure({
    appenders: {
        console: { //记录器1:输出到控制台
            type: 'console',
        },
        log_file: { //记录器2：输出到文件
            type: 'file',
            filename: `/logs/${programName}.log`, //文件目录，当目录文件或文件夹不存在时，会自动创建
            maxLogSize: 20971520, //文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            backups: 3, //default value = 5.当文件内容超过文件存储空间时，备份文件的数量
            //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            encoding: 'utf-8', //default "utf-8"，文件的编码
        },
        data_file: { //：记录器3：输出到日期文件
            type: "dateFile",
            filename: `/logs/${programName}`, //您要写入日志文件的路径
            alwaysIncludePattern: true, //（默认为false） - 将模式包含在当前日志文件的名称以及备份中
            daysToKeep: 10, //时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
            //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "-yyyy-MM-dd-hh.log", //（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', //default "utf-8"，文件的编码
        },
        error_file: { //：记录器4：输出到error log
            type: "dateFile",
            filename: `/logs/${programName}_error`, //您要写入日志文件的路径
            alwaysIncludePattern: true, //（默认为false） - 将模式包含在当前日志文件的名称以及备份中
            daysToKeep: 10, //时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
            //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "_yyyy-MM-dd.log", //（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', //default "utf-8"，文件的编码
            // compress: true, //是否压缩
        },
        //访问日志
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: "utf-8",
            filename: path.join('logs/', 'access.log') //生成文件路径和文件名
        },
        //系统日志
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: "utf-8",
            filename: path.join('logs/', 'application.log') //生成文件路径和文件名
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        },
        access: {
            appenders: ['access', 'console'], 
            level: 'info'
        },
        application: {
            appenders: ['application', 'console'],
            level: 'info'
        }
    }
});

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
exports.systemLogger = log4js.getLogger('application'); //记录所有应用级别的日志
exports.consolelogger = log4js.getLogger('defalut'); // 仅输出日志至console
