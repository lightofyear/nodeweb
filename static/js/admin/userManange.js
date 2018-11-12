let userManage = {
  add :()=>{
      let addBtn = $('.addBtn')[0];
      addBtn.onclick = () => {
          let uname = $("input[name='username']").val().trim(),
              psw = $('input[name="password"]').val().trim(),
              repsw = $('input[name="repassword"]').val().trim(),
              role = $('input[name="role"]').val().trim(),
              email = $('input[name="email"]').val().trim();
            if(!(uname&&psw&&repsw&&role&&email)){
                alert('请填写完整信息');
            }
            else {
                if(!(psw===repsw)){
                    alert('两次输入的密码不匹配,请重新输入!');
                }
                else {
                    // let reg = /(@+|\.com$)/;
                    // let eml = email.match(reg);
                    // console.log(eml);
                    $.ajax('/admin/um/add',{
                        type:'post',
                        data:{
                            uname,
                            psw,
                            role,
                            email
                        },
                        success:(data)=>{
                            console.log(data);
                        }
                        }
                    )
                }
            }
      }
  },
  select :()=>{
      let selbtn = $('.selbtn')[0];
      selbtn.onclick = () => {
          let selname = $("input[name='selname']").val();
          if(!selname.trim()){
            alert('请输入查询的用户名');
          }
          else{
              $.ajax('/admin/um/select',{
                  type:'post',
                  data:{
                      selname
                  },
                  success:(data)=>{
                      let divHandle = $('.handle')[0];
                      let box = document.createElement('div');
                        console.log(data);
                      console.log(typeof data.status);
                      if(data.status === 200){
                          box.innerHTML = `
                        用户名 : <span>${data.msg.username}</span><br/>
                        权限 : <span>${data.msg.role}</span><br/>
                        邮箱 : <span>${data.msg.email}</span>
                         `;

                          userManage.delete(data.msg._id,divHandle);
                          userManage.update(data.msg,divHandle);
                      }
                      else {
                          box.innerText = data.msg;
                      }
                      divHandle.appendChild(box);
                  }
              })
          }
      }
  },
    delete: (id,ele)=>{
        let del = document.createElement('button');
        del.innerText = '删除';
        del.onclick = ()=>{
            $.ajax('/admin/um/delete',{
                type:'post',
                data:{
                    id
                },
                success:(data)=>{
                    console.log(data);
                }
        })
        };
        ele.appendChild(del);
    },
    update: (data,ele)=>{

        let
            up = document.createElement('button');
            up.innerText = '更新';
        ele.appendChild(up);
        let eleHtml = ele.innerHTML;
        console.log(ele.innerHTML);
        console.log(ele);
            up.onclick = ()=>{
            ele.innerHTML = `
                        用户名 : <input type="text" value="${data.username}" class="up"><br/>
                        权限 : <input type="text" value="${data.role}" class="up"><br/>
                        邮箱 : <input type="text" value="${data.email}" class="up"> 
                         `;
            let sure = document.createElement('button');
            sure.innerText = '确定';
            ele.appendChild(sure);
            sure.onclick = ()=>{
                let up = $('.up'),
                    username = up[0].value.trim(),
                    role = up[1].value .trim(),
                    _id = data._id,
                    email = up[2].value .trim();
               if(username&&role&&email){
                   $.ajax('/admin/um/update',{
                       type:'post',
                       data:{
                           username,
                           role,
                           _id,
                           email
                       },
                       success:(data)=>{
                           console.log(data);
                       }
                   })
               }
                console.log(username,role,email)
            }
            let cancel = document.createElement('button');
            cancel.innerText = '取消';
            ele.appendChild(cancel);
            cancel.onclick = ()=>{
                ele.innerHTML = eleHtml;
            };
        };
    }
};
userManage.add();
userManage.select();