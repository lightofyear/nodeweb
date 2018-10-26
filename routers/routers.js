const Router = require('koa-router');
const user = require('../control/user');//拿到user表的控制层
const article = require('../control/article');//拿到article表的控制层
const comment = require('../control/comment');//拿到comment表的控制层
const member = require('../control/member');//用户中心
const admin = require('../control/admin');// 管理员操作和信息修改
const update = require('../util/update');//文件上传
const router = new Router;


//主页 地址 '/' get

router.get('/',user.keepLogin,async ctx =>{ //kepLogin

    // console.log(ctx.session);
    let option = '';

    if(!ctx.session.isNew){
        switch (ctx.session.role.length){
            case 7 :
                option = 'admin';
                break;
            default :
                option = 'member';
                break;
        }
    }

    await  ctx.render("index",{
        isNew:ctx.session.isNew,
        title : '首页',
        session:ctx.session,
        option
    });
});

router.get(/^\/user\/(?=reg|login)/,async ctx =>{ //  /user/login  /user/reg
    //title

    if(!ctx.session.isNew){
        await ctx.render('go404',{content:'请先退出账号,在登录!'});
        return;
    }
    let show = /reg$/.test(ctx.path), //判断  /reg 还是/login
        path = show ? 'reg' : 'login';
        title = show ? '注册' : '登录';
    ctx.body = show;
    // console.log(path);
    await  ctx.render("login",{
        session:{
            role:666
        },
        show,
        path,
        title,
        no : false,
        msg : ''
    });
});

// router.post('/user/login',async ctx =>{
//     console.log(ctx.request.body);
//     let data = ctx.request.body;
//     await  ctx.redirect("/");
// });
// router.post('/user/reg',async ctx =>{
//     console.log(ctx.request.body);
//     let data = ctx.request.body;
//     ctx.body = 33333;//{'id':123}
// });
//用户注册
router.post('/user/reg',user.reg);
//用户登录
router.post('/user/login',user.login);
//用户退出
router.get('/user/logout',user.logout);

//进入文章页面 并 链表查询文章
router.get('/article',user.keepLogin,article.getList);
//文章 发表
router.post('/article',user.keepLogin,article.add);
// 动态查询 进入文章总页面 并 链表查询文章
router.get('/article/:id',user.keepLogin,article.getList);
// 单篇文章页面
router.get('/art/:id',user.keepLogin,article.getIt);
//提交评论
router.post('/comment/:id',user.keepLogin,comment.add);
//个人中心
router.get('/member',user.keepLogin,member.int);
router.get('/member/:d',user.keepLogin,member.int);
//管理员后台
router.get('/admin',user.keepLogin,admin.index);
router.get('/admin/:id',user.keepLogin,admin.index);
//头像上传
router.post('/upload',user.keepLogin,update.single("hpic"),user.update);

// 404 页面
router.get('*',async (ctx)=>{
   await ctx.render('go404',{content:'找不到您需要的页面.先稍稍!'});
});

module.exports = router;