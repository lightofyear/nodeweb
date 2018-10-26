const {db} = require('../schema/connect');
const articleSchema = require('../schema/article');
const commentSchema = require('../schema/comment');
const userSchema = require('../schema/user');


const aS = db.model('articles',articleSchema); //只能操作 articles
const cS = db.model('comments',commentSchema); //只能操作 comments
const uS = db.model('users',userSchema); //只能操作 users

// 返回文章发表页
exports.addPage = async (ctx)=>{

    let data = ctx.params.data;
    // console.log(ctx.params.data);
    await ctx.render('article',{
        title : "文章发表页",
        session: ctx.session,
        data
    });
};

//保存内容
exports.add = async (ctx)=>{

    const content = ctx.request.body.content;
    const uid = ctx.request.body.uid;
    const commentnum = 0;

    await new Promise(async (res,rej)=>{
        const  as = new aS({
            content,
            uid,
            commentnum
        });
        as.save((err,data)=>{
            err && rej(err);
            res(data);
        });
    }).then((data)=>{

        // console.log(data);
    }).catch(err=>{
        console.log(err);
    });
    uS.updateOne({'_id': uid}, {$inc: {articlenum: 1}},(err)=>{
        err && console.log(err);
    });
    ctx.redirect('/article');

};

exports.getList =  async (ctx)=>{

    // if(ctx.session.isNew){
    //   await  ctx.redirect('/user/login');
    //   return;
    // }

    let page = ctx.params.id || 1;
    page --;

    const maxN = await aS.estimatedDocumentCount((err,data)=>{
        if(err){
            throw err;
        }
        else{
            return data;
        }
    });
    await aS
        .find()
        .sort('_created') //按时间顺序 早-> 晚
        .skip(5*page)
        .limit(5)
        .populate({
            path: 'uid',
            select: 'created username hpic' //不写返回全部
        })
        .then( async data => {
            // console.log(data);
            await ctx.render('article',{
                title : "文章发表页",
                session: ctx.session,
                data,
                maxN
            });
        })
        .catch(err => {throw err});


};

exports.getIt = async (ctx)=>{

    // if(ctx.session.isNew){
    //     await  ctx.redirect('/user/login');
    //     return;
    // }

    let _id = ctx.params.id;
    // console.log(_id);
   let data = await aS
        .findById(_id)
        .populate({
            path: 'uid',
            select: 'created username hpic' //不写返回全部
        })
        .then( async data => data)
        .catch(err => {throw err});

    let data1 = await cS
        .find({'aid':_id})
        .populate({
            path: 'uid',
            select: 'created username hpic' //不写返回全部
        })
        .sort('_created')
        .then( async data => data)
        .catch(err => {throw err});

    console.log(data1);
   if(data){
       // console.log(data);
       await ctx.render('artit',{
           session: ctx.session,
           data,
           data1
       });
   }

};