const {db} = require('../schema/connect');
const commentSchema = require('../schema/comment');
const articleSchema = require('../schema/article');
const userSchema = require('../schema/user');


const cS = db.model('comments',commentSchema); //只能操作 comment
const aS = db.model('articles',articleSchema); //只能操作 article
const uS = db.model('users',userSchema); //只能操作 users


//保存内容
exports.add = async (ctx)=>{

    if(ctx.session.isNew){
      await  ctx.redirect('/user/login');
      return;
    }

    const aid = ctx.params.id;
    const uid = ctx.session.uid;
    const content = ctx.request.body.content;

    await new Promise(async (res,rej)=>{
        const  cs = new cS({
            content,
            uid,
            aid
        });
        cs.save((err,data)=>{
            err && rej(err);
            res(data);
        });
    }).then((data)=>{
        // console.log(data);
    }).catch(err=>{
        console.log(err);
    });

      aS.updateOne({'_id': aid}, {$inc: {commentnum: 1}},(err)=>{
             err && console.log(err);
        });

    ctx.redirect('/art/'+aid);

};
exports.del = async (ctx)=>{

    if(ctx.session.isNew || ctx.session.role.length <5){
        await ctx.render('go404',{
            content:'页面不存在!'
        });
        return ;
    }

    const _id = ctx.params.cid,
            resdata = {
                status : 200,
                msg: '评论删除成功'
            };



     await new Promise((res,rej)=>{
        cS.find({_id},{aid:1},(err,data)=>{
            if(err){
                resdata.status = 500;
                resdata.msg ='服务器出错';
                console.log(err);
                rej(err);
            }
            else{
                if(data.length){
                    res(data[0].aid);
                }
                else {
                    resdata.status = 404;
                    resdata.msg ='找不到此文章';
                }
            }
        })
    }).then(async data => {
         aS.updateOne({_id:data},{$inc:{commentnum:-1}},(err)=>{
            err && console.log(err);
        });
    })
        .catch(err=>{console.log(err)});

   await new Promise((res)=>{
         cS.deleteOne({_id},async (err)=>{
             if(err){
                 resdata.status = 500;
                 resdata.msg ='服务器出错';
                console.log(err);
             }
             res(resdata);
         });
     })
        .then(data=>data);
    ctx.body= resdata;
    // ctx.redirect('/art/'+aid);

};