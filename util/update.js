
const multer = require('koa-multer');
const {join} = require('path');


const storage = multer.diskStorage({
    //保存位置
    destination: join(__dirname,"../static/imgs/update"),
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

module.exports = multer({storage});