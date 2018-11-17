const Router = require('koa-router');
router = new Router;
const user = require('../control/user');//拿到user表的控制层

router.get('/llin/',function (ctx) {
    ctx.body= {
        status:200,
        msg: '琳琳的路由!'
    }
});

router.get('/llin/getnz',function (ctx) {
    ctx.body= {
        status:200,
        msg: '琳琳的!'
    }
});

module.exports = router;
