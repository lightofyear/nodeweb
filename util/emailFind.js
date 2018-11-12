const userSchema = require('../schema/user');
const {db} = require('../schema/connect');
const Us =  db.model('user',userSchema);

module.exports = async (ctx,next) => {
    let email = ctx.request.body.email;
    if(email){
      await  new Promise((res,rej)=>{
            Us.find({email},(err,data)=>{
                if(err){
                    console.log(err);
                    rej({
                        status:505,
                        msg: '数据库出错'
                    })
                }
                else{
                    if(data.length){
                        ctx.next =  {
                            emailFind:true
                        };
                        res(false);
                    }
                    else{
                        ctx.next =  {
                            emailFind:false
                        };
                        res(true);
                    }
                }
            });
        })
            .then(async (data)=>{
                if(data){
                    await next();
                }
                else{
                    ctx.body =  {
                        status:304,
                        msg: '该邮箱已被注册!'
                    }
                }
            })
            .catch((err)=>{
                ctx.body = err;
            });

    }
    else{
        ctx.body = {
            status : 405,
            msg: '请填写邮箱地址'
        }
    }

};