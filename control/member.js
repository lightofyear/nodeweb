
const {db} = require('../schema/connect');
const articleSchema = require('../schema/article');


const aS = db.model('articles',articleSchema); //只能操作 articles


module.exports.int = async (ctx)=>{

    if(ctx.session.isNew){
        ctx.status = 404 ;
        await  ctx.render('go404',{
            content : '404!  请先登录后,重试!'
        })
    }
    else{

        await  ctx.render('member')
    }
};