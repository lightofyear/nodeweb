
const request = require('request');

module.exports = ctx =>{
    request('https://api.map.baidu.com/location/ip?ip=117.136.11.11&ak=5PmeG0zCUFEyKouAiKDmkskReKrWzNvm&coor=bd09ll', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

    });
    // console.log( ctx.request.headers['x-forwarded-for']);
    // console.log(ctx.request.connection);
    console.log(ctx.request.socket.remoteAddress);
    // console.log(ctx.request.connection.socket);
    console.log(ctx.request.ips);
    console.log(ctx.request.ip);
    ctx.set('status',200);
    ctx.set('Content-Type','text/html; charset=utf-8');
    let str ;
    for (let i in ctx.request){
         str += i + '<br/>';
    }
    ctx.body = str ;
};