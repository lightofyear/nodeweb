const Router = require('koa-router');
router = new Router;
const user = require('../control/user');//拿到user表的控制层

router.get('/llin/',function (ctx) {
    ctx.body= {
        status:200,
        msg: '大奶子琳琳的路由!'
    }
});

router.get('/llin/getnz',function (ctx) {
    ctx.body= {
        status:200,
        msg: '大奶子琳琳的奶子是我的!'
    }
});

module.exports = router;