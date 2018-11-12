const nodeemail = require('nodemailer');
const crypto = require('../util/crypto');

const config = {
    host: 'smtp.126.com',
    port: 25,
    auth:{
        user: 'jq123jj@126.com',
        pass: 'hjq19950811'//授权码
    }
};

const transport = nodeemail.createTransport(config);

module.exports = async (ctx)=>{
    let email = ctx.request.body.email ;
    console.log(ctx.next);
    console.log(email);
    if(email){
        let getCode = {
            data: '',
            length: 6,
            getdata : function () {
                for(let i=0;i< this.length; i++){
                    let code = Math.floor((Math.random()*10));
                    this.data += code;
                }
                return this.data;
            }
        };
        let mail = {
            // 发件人
            from: 'gn <jq123jj@126.com>',
            // 主题
            subject: '在正确的时间,来到对的地方',
            // 收件人
            to: email,
            // 邮件内容，HTML格式
            text: '您的激活验证码是: '+getCode.getdata()+' !'//接收激活请求的链接
        };
            let data = await new Promise((res,rej)=>{
                transport.sendMail(mail,async (err,data)=>{
                    if(err){
                        console.log(err);
                        rej(
                            {
                                status: 505,
                                msg: '邮箱服务器出错!'
                            }
                        )
                    }
                    else{
                        console.log(data);
                        if(data.response.indexOf('OK') !== -1){

                            await  res({
                                status:200,
                                code : getCode.data,
                                msg : '验证码已发至您的邮箱,请及时填写!',
                                crypto: crypto(getCode.data,getCode.data)
                            });
                        }
                    }
                })
            })
                .catch(err=>err)
                .then(data=>data);
            console.log(data);
            ctx.body = data;

    }
};