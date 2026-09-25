// assets/js/main.js
//def
const btnTest = document.getElementById("btn-test");
const msgHeading = document.getElementById("msg-heading")
const btnConfirm = document.getElementById("btn-confirm");
const btnClear = document.getElementById("btn-clear");
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");


//tools functions 
function print(n){
    console.log(n);
    return n
}
let flag = false
msgHeading.textContent="Hello World!";
btnTest.textContent = "discover";
btnTest.addEventListener("mousedown",()=>{
    btnTest.textContent="hide";
    if (!flag){
    msgHeading.textContent="你好，世界！";
    }
});
btnTest.addEventListener("mouseup",()=>{
    btnTest.textContent="discover";
    if (!flag){
    msgHeading.textContent="Hello World!";
    }
});

let username,password;

btnConfirm.addEventListener("click",async ()=>{

    const response = await fetch("./assets/data/data.json");
    const object = await response.json();

    username = inputUsername.value;
    password = inputPassword.value;
    if (username in object ) {
        if (password == object[username]){
            alert("登陆成功");
            flag =true
            msgHeading.textContent="你好，"+ username;
        }else{
            alert("密码错误");
        }
    } else{
        alert("账户错误");
    }
})



