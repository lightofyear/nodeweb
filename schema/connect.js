// 导出db schema

const mongoose = require('mongoose');
const db = mongoose.createConnection("mongodb://localhost:27017/xm",{
    useNewUrlParser:true
});

//导出mongose schema
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

db.on('error',(err)=>{
    console.log(err);
});
db.on('open',()=>{
    console.log('db success');
});

module.exports = {
    db,
    Schema
};