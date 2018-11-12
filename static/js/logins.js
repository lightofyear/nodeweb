
$(document).ready(()=>{
    let
        rm = $(".remember")[0],
        btn = $(".btn");
    if(btn[0].getAttribute('login')){
        let date = localStorage.getItem('date');
        let uid = localStorage.getItem('uid');
        let psw = localStorage.getItem('psw');

        if(new Date().getTime() - date < 7*24*60*60*1000){
            $("#inputnName")[0].value = uid;
            $("#inputPassword")[0].value = psw;
            rm.checked = true;
        }
        else {
            localStorage.clear();
        }



        btn[0].onclick = function () {
            uid = $("#inputnName")[0].value;
            psw = $("#inputPassword")[0].value;
            console.log(uid,psw);
            if(uid && psw && rm.checked){

                localStorage.setItem('date',new Date().getTime());
                localStorage.setItem('uid',uid);
                localStorage.setItem('psw',psw);
                localStorage.setItem('status',rm.checked);

            }
            else if(uid && psw && !rm.checked){

            }
            btn[1].click();
        }
    }else {
        let codeBtn = $('.getc')[0];
        console.log(codeBtn);
        codeBtn.onclick = function () {
            let email = $('#inputEmail')[0].value.trim(),
                codeInput = $('#code')[0];

            $.ajax('/getcode',{
                type:'post',
                data:{
                    email
                },
                success:(data)=>{
                    console.log(data);
                    if(data.status === 200 ){
                        $("#crypto")[0].value = data.crypto;
                        codeInput.disabled = false;
                        let timeOut = 60;
                        let click = this.onclick ;
                        this.onclick = null;
                        let _this = this;
                        let c = setInterval( ()=> {
                            console.log(_this);
                            if (timeOut -- >0){
                                _this.innerText = timeOut + ' 秒后重新发送'
                            }
                            else {
                                _this.onclick = click;
                                _this.innerText ='重新发送';
                                clearInterval(c);
                            }
                        },1000);
                    }
                    alert(data.msg);
                }
            });
        };
        function djs(time=120) {

        }
    }

    function getCode() {

    }

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3000
    };

    function success(pos) {
        const crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);


});


