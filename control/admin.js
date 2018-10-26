const {db} = require('../schema/connect');
const articleSchema = require('../schema/article');
const commentSchema = require('../schema/comment');
const userSchema = require('../schema/user');


const aS = db.model('articles',articleSchema); //只能操作 articles
const cS = db.model('comments',commentSchema); //只能操作 comments
const uS = db.model('users',userSchema); //只能操作 users

//后期增加模块用的
const fs = require('fs');
const {join} = require('path');

    /*------------以上为后期增加模块功能做准备---------------*/



module.exports.index = async (ctx)=>{

    if(ctx.session.role && ctx.session.role.length !== 7 || ctx.session.isNew){
        ctx.status = 404 ;
        await  ctx.render('go404',{
            content : '404! 此页面不存在,请重试!'
        });
        return ;
    }
    const arr = fs.readdirSync(join('__dirname','../views/admin'));
    let flag = false,
        path = '';
    const id = ctx.params.id || 'index';
    arr.forEach(it=>{

        //console.log(it.replace(/^(admin-)|(\.ejs)$/g,'')); admin- .ejs 替换成null
        let val = it.replace(/^(admin-)|(\.ejs)$/g,'') === id;
        if(val){
            flag = true;
            path = './admin/admin-'+id;
        }
    });
    if(!flag){
        ctx.status = 404 ;
        await  ctx.render('go404',{
            content : '404! 此页面不存在,请重试!'
        });

        return ;
    }
    await ctx.render(path,{

    });

};