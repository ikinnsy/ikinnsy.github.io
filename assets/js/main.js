// assets/js/main.js
const btnTest = document.getElementById("btn-test");
const msgTest = document.getElementById("msg-test")
const btnConfirm = document.getElementById("btn-confirm");
const btnClear = document.getElementById("btn-clear");
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");
function print(n){
    console.log(n);
    return n
}
let flag = false
msgTest.textContent="Hello World!";
btnTest.textContent = "按下以查看";
btnTest.addEventListener("mousedown",()=>{
    btnTest.textContent="松开以隐藏";
    if (!flag){
    msgTest.textContent="你好，世界！";
    }
});
btnTest.addEventListener("mouseup",()=>{
    btnTest.textContent="按下以查看";
    if (!flag){
    msgTest.textContent="Hello World!";
    }
});

let username,password;

btnConfirm.addEventListener("click",async ()=>{
    console.log("点击成功");
    const response = await fetch("./assets/data/data.json");
    const object = await response.json();
    console.log("处理成功");
    username = inputUsername.value;
    password = inputPassword.value;
    if (username in object ) {
        if (password == object[username]){
            alert("登陆成功");
            flag =true
            msgTest.textContent="你好，"+ username;
        }else{
            alert("密码错误");
        }
    } else{
        alert("账户错误");
    }
})



