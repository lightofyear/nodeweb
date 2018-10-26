window.onload=function (ev) {
    (function(win,doc){
        var body =doc.documentElement ||document .body,
            content=doc.getElementsByClassName('content')[0];
        body.style.fontSize =1*(content.clientWidth/ 1080)+'px';
        var resize ='orientationchange' in win ? 'orientationchange' :'resize';
        function rem(){
            body.style.fontSize =1*(content.clientWidth/ 1080)+'px';
        }
        doc.addEventListener('DOMContentLoaded',rem,false);
        win.addEventListener(resize,rem,false);
    })(window,document);
};