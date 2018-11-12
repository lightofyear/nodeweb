//评论删除
!function () {
    let cms = $('.comments')[0],
        cmbtns = $('.comments')[0];
    console.log(cmbtns);
    cms.onclick = function (e) {
        console.dir(e.target.getAttribute('href'));
        let href = e.target.getAttribute('href'),
            targetParent = e.target.parentElement;
        $.ajax(href,{
            type :'post',
            success:(data)=>{
                if(data.status === 200){
                    cmbtns.remove(targetParent);
                }
                else{}
            }
        })
    }
}();
