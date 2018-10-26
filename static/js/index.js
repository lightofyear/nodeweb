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

console.log($('.sure'));