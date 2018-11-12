// $('.sure')[0].onclick=(ev)=>{
//     let usn = document.getElementsByName('usn')[0].value,
//         psw = document.getElementsByName('psw')[0].value;
//     if(!(usn.trim()&&psw.trim())){
//         ev.preventDefault();
//         ev.stopPropagation();
//         console.log(11111111111);
//     }
//     else {
//         $.ajax('http://localhost:3004/user/login',{
//             type : 'post',
//             data : {
//                 usn ,
//                 psw,
//             },
//             success: (data)=>{console.log(data)},
//             error: (err)=>{console.log(err)}
//         })
//     }
// };
//
!function (){
    let linSrc = 'http://localhost:3000/',
        llin = $('#llin')[0];
    llin.onclick = function () {
        window.location.href = linSrc;
        console.log(1111111);
    };

}();
!function (){ //post方式处理的api测试
   let btn = $('#btn')[0];
   console.log(btn);
    if(!btn){
        return;
    }
    else{}
   btn.onclick = (e)=>{
       $.ajax({
         url : '/handle/select',
         method : 'post',
         data: {username : '123' },
         success : (data)=>{ console.log(data)}
       })
   }

}();

