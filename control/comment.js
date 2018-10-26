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

    uS.updateOne({'_id': uid}, {$inc: {commentnum: 1}},(err)=>{
        err && console.log(err);
    });
      aS.updateOne({'_id': aid}, {$inc: {commentnum: 1}},(err)=>{
             err && console.log(err);
        });

    ctx.redirect('/art/'+aid);

};