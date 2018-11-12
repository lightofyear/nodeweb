const {db} = require('../schema/connect');
const crypto = require('../util/crypto');
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
    let select ;
    switch (id){
        case 'article':
            select = {
                db: aS,
                util: {content: 0 },
                populate:{
                    path:'uid',
                    select: 'username created'
                }
            };
            break;
        case 'user':
            select = {
                db:uS,
            };
            break;
        case 'comment':
            select = {
                db:cS,
            };
            break;
        default:
            select = {
                db:uS,
                find:{
                    username:ctx.session.uid
                }
            };
    }
    await new Promise((res,rej)=>{
        let util = select.util || {},
            find = select.find || {},
            db = select.db;
        if(select.populate){
            db.find(find,util)
                .populate(select.populate)
                .then((data)=>{
                    res(data);
                })
                .catch((err)=>{
                    rej(err);
                })
        }
        else{
            db.find(find,util)
                .then((data)=>{
                    res(data);
                })
                .catch((err)=>{
                    rej(err);
                })
        }

    }).
    then(async (data)=>{
        if(data.length){
            await ctx.render(path,{
                data,
                msg : '1',
                status : 200
            });
        }
        else{
            await ctx.render(path,{
                data,
                msg : '0',
                status : 304
            });
        }
    }).
    catch(async (err)=>{
        console.log(err);
        await ctx.render(path,{
            data,
            msg : '数据库出错!',
            status : 505
        });
    });



};

//用户查找
module.exports.um = async (ctx)=>{
    if(ctx.session.isNew || ctx.session.role.length !== 7){
        ctx.body = {
            status : 405,
            msg : '无法进行此操作!'
        };
        return ;
    }
    // let data = ctx.request.body;
    // let username = data.uname,
    //     password = data.psw,
    //     role = data.role,
    //     articlenum = 0,
    //     email = data.email;
    // let rdata = {};
    // await new Promise((res,rej)=>{
    //     uS.find({username},(err,data)=>{
    //         if(err){
    //             rdata ={
    //                 status : 505,
    //                 msg : '数据库出错!'
    //             };
    //             rej(rdata);
    //         }
    //         if(data.length !== 0){
    //             rdata ={
    //                 status : 200,
    //                 msg : '用户名已存在!'
    //             };
    //             res(rdata);
    //
    //         }
    //         else {
    //             password = crypto(password,username);
    //             let xm = new uS({
    //                 username,
    //                 password,
    //                 email,
    //                 articlenum,
    //                 role
    //             });
    //             xm.save((err)=>{
    //                 rdata =  err ?
    //                     {
    //                         status : 505,
    //                         msg : '数据库出错!'
    //                     }
    //                     :
    //                     {
    //                         status : 200,
    //                         msg : '用户添加成功!'
    //                     };
    //                 err ?  rej(rdata): res(rdata);
    //             });
    //         }
    //     })
    // }).then(async data => data)
    //     .catch(async err=>err);
    //
    // console.log(rdata);
    // ctx.body = rdata;
    let handler = {
        //添加用户
      add: async ()=>{
          let data = ctx.request.body;
          let username = data.uname,
              password = data.psw,
              role = data.role,
              articlenum = 0,
              email = data.email;
         let rdata = await new Promise((res,rej)=>{
              uS.find({username},(err,data)=>{
                  if(err){
                      rej({
                          status : 505,
                          msg : '数据库出错!'
                      });
                  }
                  if(data.length !== 0){
                      res({
                          status : 200,
                          msg : '用户名已存在!'
                      });
                  }
                  else {
                      password = crypto(password,username);
                      let xm = new uS({
                          username,
                          password,
                          email,
                          articlenum,
                          role
                      });
                      xm.save((err)=>{
                          err ?  rej({
                              status : 505,
                              msg : '数据库出错!'
                          }): res( {
                              status : 200,
                              msg : '用户添加成功!'
                          });
                      });
                  }
              })
          }).then( data => data)
              .catch( err => err);

          ctx.body = rdata;
      },
      //查询用户
      select: async ()=>{
          let username = ctx.request.body.selname;
          let data = await new Promise((res,rej)=>{

              uS.find({username},{role:1,username:1,email:1},(err,data)=>{
                  if(err){
                    rej(
                        {
                            status:505,
                            msg: '数据库出错!'
                        }
                    );
                  }
                  else{
                      if(!data.length){
                        res({
                            status:405,
                            msg:'此用户不存在!'
                        })
                      }
                      else{
                          res(
                              {
                                  status:200,
                                  msg:data[0]
                              }
                          );
                      }
                  }
              })


          }).then((data)=>{
              return data;
          }).catch((err)=>{return err});

          ctx.body = data;
      },
        //删除用户
      delete:async ()=>{
          let _id = ctx.request.body.id;
          let data = await new Promise((res,rej)=>{
              uS.deleteOne({_id},(err)=>{
                  if(err){
                    rej({
                        status:505,
                        msg : '数据库出错!'
                    })
                  }
                  else{
                      res(
                          {
                              status:200,
                              msg:'用户删除成功!'
                          }
                      )
                  }
              })
          }).then(data=>data)
              .then((err)=>err);
          ctx.body = data;
      },
        //更新用户信息
      update:async ()=>{
          let sDate = ctx.request.body;
          let data = await new Promise((res,rej)=>{
              let username = sDate.username,
                  role = sDate.role,
                  _id = sDate._id,
                  email = sDate.email;
              uS.find({
                  username,
                  _id
              },(err,data)=>{
                  if(err){
                    rej({
                        status: 505,
                        msg: '数据库出错'
                    });
                  }
                  else{
                      if(data.length){
                        uS.updateOne({_id},{$set:{role,email}},(err)=>{
                            if(!err){
                                res({
                                    status: 200,
                                    msg: '数据更新成功!'
                                });
                            }
                            else{
                                rej({
                                    status: 505,
                                    msg: '数据库出错'
                                });
                            }
                        });
                      }
                      else{
                          uS.find({username},(err,data)=>{
                              if(err){
                                rej({
                                    status: 505,
                                    msg: '数据库出错'
                                });
                              }
                              else{
                                  if(data.length){
                                      rej({
                                          status: 405,
                                          msg: '用户名已存在!'
                                      });
                                  }
                                  else{
                                      uS.updateOne({_id},{$set:{username,role,email}},(err)=>{
                                          if(!err){
                                              res({
                                                  status: 200,
                                                  msg: '数据更新成功!'
                                              });
                                          }
                                          else{
                                              rej({
                                                  status: 505,
                                                  msg: '数据库出错'
                                              });
                                          }
                                      });
                                  }
                              }
                          })
                      }
                  }
              });
              console.log(username,role,email,_id);

          }).then(data => data)
              .catch(err => err);
          ctx.body = data;
      }

    };

    switch (ctx.params.action){
        case 'add':
           await handler.add();
            break;
        case 'select':
            await handler.select();
            break;
        case 'delete':
            await handler.delete();
            break;
        case 'update':
            await handler.update();
            break;
    }

};