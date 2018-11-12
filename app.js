const koa = require('koa');
const {join} = require('path');
const routers = require('./routers/routers.js');
const llrouter = require('./routers/llrouter.js');
const static = require('koa-static');
const views = require('koa-views');
const logger = require('koa-logger');
const body = require('koa-body');
const session = require('koa-session');
const compress = require('koa-compress');

const {db} = require('./schema/connect');
const userSchema = require('./schema/user');
const crypto = require('./util/crypto');


let num = 10e5,
    arr = [];
for(let i=0;i< num; i++){
    str = new Date().getTime()*Math.random()+'key';
    arr.push(str);
}

const app = new koa;
app.keys =  arr;
const session_config = {
    key : "SID",
    maxAge:36e5,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true //是否更新session
};

// app.use(logger());


app.use(compress(
    {
        threshold: 1024,
        flush: require('zlib').Z_SYNC_FLUSH
    }
));

app.use(session(session_config,app));
app.use(body());

app.use(views(join(__dirname,'views'),{
    extension:'ejs',
}));

app.use(static(join(__dirname,'static')));

app.use(llrouter.routes()).use(llrouter.allowedMethods());
app.use(routers.routes()).use(routers.allowedMethods());


//初始化,超级管理员

const Xm = db.model('users',userSchema);
let username = 'gn';

Xm.find({username},(err,data)=>{
    if(err){
        throw err;
    }
    if(data.length !== 0){
        return console.log("管理员账号已存在");
    }
    else {
      let password = crypto('q1314520',username),
          email ='595379959@qq.com',
          articlenum = 0,
          role =  '1000000';

        let xm = new Xm({
            username,
            password,
            email,
            role,
            articlenum
        });
        xm.save((err,data)=>{
            err ?  console.log(err): console.log(data);
        });
    }
});

// let port = 80,
//     host = '0.0.0.0';
// app.listen(port,host,()=>{
//     console.log('success');
// });
app.listen(3004,()=>{
    console.log('success');
});


