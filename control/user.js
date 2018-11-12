const {db} = require('../schema/connect');
const userSchema = require('../schema/user');
const crypto = require('../util/crypto');
const fs = require('fs');
const {join} = require('path');

//通过 db 对象创建操作 xm 数据库的模型对象

const Xm = db.model('users',userSchema); //只能操作 users表

exports.reg = async (ctx) => {
    //接收用户注册信息
    let reg = ctx.request.body ,
        username = reg.usn,
        password = reg.psw,
        email = reg.eml,
        code = reg.code,
        cryptoCode = reg.cryCode,
        articlenum = 0;

    if(cryptoCode !== crypto(code,code)){
        ctx.body = {
            status: 405,
            msg: '验证码和邮箱不匹配!'
        };
        return;
    }
    // 1.查询数据库  异步操作 await后面加promise对象
    await new Promise((res,rej)=>{

        // 1.查询数据库
        Xm.find({username},(err,data)=>{
             if(err){
                return rej(err);
             }
             if(data.length !== 0){
                return res("");
             }
             else {
                 password = crypto(password,username);
                 let xm = new Xm({
                     username,
                     password,
                     email,
                     articlenum,
                 });
                 xm.save((err,data)=>{
                     err ?  rej(err): res(data);
                 });
             }
        });

    })
        .then(async (data)=>{
            const usn = crypto(username,'123');
           if(data){
               ctx.cookies.set("username",usn,{
                   domain : 'localhost',
                   path: '/',
                   maxAge: 36e5,
                   httpOnly:true,
                   overwrite:false,
               });

               ctx.set("uid",data._id,{
                   domain : 'localhost',
                   path: '/',
                   maxAge: 36e5,
                   httpOnly:true,
                   overwrite:false,
               });
               ctx.session = {
                   username,
                   role : data.role,
                   uid: data._id,
                   hpic: data.hpic
               };
              await ctx.redirect("/");
           }
           else{
               let msg = '用户名已存在';
                   await ctx.render('login',{
                       session:{
                           role:666
                       },
                       show : true,
                       path : 'reg',
                       title:'注册',
                       no : true,
                       msg
                   })
           }
        })
        .catch((err)=>{
            let msg = '数据库出错';
            ctx.body = msg;
            console.log(err);
        })

};

exports.login = async (ctx) => {
    //接收用户注册信息

    let reg = ctx.request.body ,
        username = reg.usn,
        password = reg.psw;
    // console.log(username,password);

    // 1.查询数据库  异步操作 await后面加promise对象
    await new Promise((res,rej)=>{

        // 1.查询数据库
        Xm.find({username},(err,data)=>{
            if(err){
                return rej(err);
            }
            if(data.length === 0){
                return res("此用户不存在!");
            }
            else {
                password = crypto(password,username);
                if(password === data[0].password){

                    const usn = crypto(username,'123');

                    ctx.cookies.set("username",usn,{
                        domain : 'localhost',
                        path: '/',
                        maxAge: 36e5,
                        httpOnly:true,
                        overwrite:false,
                    });

                    ctx.set("uid",data[0]._id,{
                        domain : 'localhost',
                        path: '/',
                        maxAge: 36e5,
                        httpOnly:true,
                        overwrite:false,
                    });
                    ctx.session = {
                        username,
                        role : data[0].role,
                        uid: data[0]._id,
                        hpic: data[0].hpic,
                    };

                    res(false);
                }
                else{
                    return res("密码错误,请重试!");
                }
            }
        });

    })
        .then(async (data)=>{
            if(!data){
             await ctx.redirect("/",{
                    session:{
                        role:666
                    },
                    title : '首页'
                });
            }
            else{
                let msg = data;
                await ctx.render('login',{
                    session:{
                        role:666
                    },
                    show : false,
                    path : 'login',
                    title:'登录',
                    no : true,
                    msg
                })
            }
        })
        .catch((err)=>{
            let msg = '数据库出错';
            ctx.body = msg;
            console.log(err);
        })

};

exports.reset = async (ctx)=>{

};

exports.keepLogin = async (ctx,next) =>{ //判断用户状态
    // console.log('ctx.session.isNew'+ctx.session.isNew);
    if(!ctx.session.isNew){
        if(ctx.cookies.get('uid')){
            ctx.session ={
                username: ctx.cookie.get('username'),
                uid: ctx.cookie.get('uid'),
            }
        }
    }
    await next();
};

exports.logout = async (ctx)=>{//用户退出

    ctx.session = null;
    ctx.cookies.get("username",null,{
        maxAge : 0
    });
    ctx.redirect('/');
};
//用户头像上传
exports.update = async (ctx) =>{
    if(!ctx.req.file){
     ctx.body = {
         status : 0,
         msg : '请重新选择图片上传!'
     };
     return;
    }

    const filename = ctx.req.file.filename;
    const hpic = "/imgs/update/"+filename;
    ctx.session.hpic = hpic; //更新ctx.session.hpic

    //先查找原本的图片
   await Xm.findById({'_id':ctx.session.uid},async (err,data)=>{
       //更新图片
       await Xm.updateOne({_id:ctx.session.uid},{$set: {hpic}}
           ,async (err)=>{

               if(err){
                   ctx.body = {
                       status : 0,
                       msg : err,
                   };
               }
               else{
                   ctx.body = {
                       status : 0,
                       msg : 'ok',
                   }
               }
               // await ctx.redirect('/',);

               if(err){
                   console.log(err);
               }
               else{

                   //删除原本的图片
                   if(data.hpic !== '/imgs/default/default.jpg'){

                       let path = join(__dirname,'../','/static',data.hpic);

                       await fs.unlink(path,(err)=>{
                           err && console.log(err);
                       });
                   }
               }
           });



   });


};
