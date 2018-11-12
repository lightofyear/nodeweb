
const {db} = require('../../schema/connect');
const articleSchema = require('../../schema/article');
const commentSchema = require('../../schema/comment');
const userSchema = require('../../schema/user');


const aS = db.model('articles',articleSchema); //只能操作 articles
const cS = db.model('comments',commentSchema); //只能操作 comments
const uS = db.model('users',userSchema); //只能操作 users


let middle = (ctx)=>{

    const handle = (hdObj)=>{
        let db = hdObj.db ,
            method = hdObj.method || 'select',
            condition = hdObj.condition || {},
            unless  = hdObj.unless || {};

        let methods = {
            select:async ()=>{
             let data = await new Promise((res,rej)=>{
                 db.find(condition,(err,data)=>{
                     let backVal = {};
                        backVal.status = 0;
                        backVal.msg = 'fail';
                        backVal.data = [];
                        if(err){
                            rej(err) ;
                        }
                        if(data.length){
                            ctx.body = 123;
                            backVal.status = 1;
                            backVal. msg = 'ok';
                            backVal. data = data;
                        }
                        res(backVal);
                    });
                }).then( data=>{
                    // console.log(data);
                    return data;
                })
                  .catch(err =>{
                    console.log(err);
                });
             console.log(data);
            return data;
            },
            insert:async()=>{
                callback(ctx);
            },
            update:async()=>{
                console.log('update');
            },
            delete:async()=>{
                console.log('delete');
                callback(ctx);
            }
        };

        methods[method]();
    };

    console.log(ctx.params.method);
    console.log(ctx.request.body);
    handle({
        db : uS,
        method : ctx.params.method,
        condition : ctx.request.body,
        unless : {}
    });
};
module.exports = middle;

/**
 1.表 db
 2.条件(字段)
 3.方法
 // 4.回调函数
 */
