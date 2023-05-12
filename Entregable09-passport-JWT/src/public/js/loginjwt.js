const form = document.getElementById('loginForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/jwt/loginjwt',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
                console.log(json);
                //localStorage.setItem('authToken', json.jwt);
            //    console.log("Cookies generadas:");
            //    console.log(document.cookie);
                window.location.replace('/users');
            });
        } else if (result.status === 401){
            console.log(result);
            window.location.replace('/users/register');
        } else if (result.status === 403){
            console.log(result);
            window.location.replace('/users/login');
        }
    }).then(result=>{
        if(result.status===200){
                window.location.replace('/users/login');
            }
    })
})